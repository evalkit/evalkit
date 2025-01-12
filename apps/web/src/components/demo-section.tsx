'use client';

import { EvaluationExecutionReport } from '@evalkit/core';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { examples } from '@/lib/examples';

type ResultFormat = 'json' | 'console';

interface MetricGroup {
  passed: number;
  failed: number;
  totalScore: number;
  failedItems: Array<{
    result: {
      score: number;
      reasons: string[];
    };
  }>;
}

function ConsoleView({ result }: { result: EvaluationExecutionReport }) {
  if (!result?.items) {
    return null;
  }

  const totalEvals = result.items.length;
  const passedEvals = result.items.filter(item => item.result.passed).length;
  const failedEvals = totalEvals - passedEvals;
  const durationInSeconds = (result.duration / 1000).toFixed(2);

  // Group items by metric name
  const metricGroups = result.items.reduce((acc, item) => {
    const group = acc[item.metricName] || { passed: 0, failed: 0, totalScore: 0, failedItems: [] };
    if (item.result.passed) {
      group.passed++;
    } else {
      group.failed++;
      group.failedItems.push(item);
    }
    group.totalScore += item.result.score;
    acc[item.metricName] = group;
    return acc;
  }, {} as Record<string, MetricGroup>);

  return (
    <div className="font-mono text-sm whitespace-pre-wrap">
      <div className="text-primary font-bold">📊 EvalKit Report Summary</div>
      <div className="text-muted-foreground">========================</div>
      <div></div>
      <div>🕒 Duration: {durationInSeconds}s</div>
      <div>📝 Total Evaluations: {totalEvals}</div>
      <div className="text-green-500">✅ Passed: {passedEvals}</div>
      <div className="text-red-500">❌ Failed: {failedEvals}</div>
      <div></div>
      <div className="text-primary font-bold">📈 Metrics Breakdown</div>
      <div className="text-muted-foreground">------------------</div>
      <div></div>
      {Object.entries(metricGroups).map(([metricName, stats]) => (
        <div key={metricName} className="mb-4">
          <div className="text-primary">{metricName}:</div>
          <div className="ml-2">Score: {(stats.totalScore / (stats.passed + stats.failed)).toFixed(2)}</div>
          <div className="ml-2">Passed: {stats.passed} Failed: {stats.failed}</div>
          {stats.failedItems.length > 0 && (
            <div className="ml-2 text-red-500">
              Failed Evaluations:
              {stats.failedItems.map((item, i) => (
                <div key={i} className="ml-4">
                  - Score: {item.result.score.toFixed(2)}
                  {item.result.reasons.map((reason, j) => (
                    <div key={j} className="ml-6">{reason}</div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface EvaluationResult extends EvaluationExecutionReport {
  code: string;
}

export function DemoSection() {
  const [selectedExample, setSelectedExample] = useState(0);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ResultFormat>('console');
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const runExample = async () => {
    if (cooldown > 0) return;
    
    setLoading(true);
    setError(null);
    try {
      const example = examples[selectedExample];
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exampleId: example.id }),
      });
      
      if (response.status === 429) {
        const { remainingSeconds } = await response.json();
        setCooldown(remainingSeconds);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Evaluation failed');
      }
      
      const evalResult = await response.json();
      setResult(evalResult);
    } catch (error) {
      console.error('Evaluation failed:', error);
      setError(error instanceof Error ? error.message : 'Evaluation failed');
    } finally {
      setLoading(false);
    }
  };

  const currentExample = examples[selectedExample];

  return (
    <section className="container py-8 md:py-12 lg:py-24 mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mx-auto max-w-[64rem]"
      >
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Try it yourself</h2>
          <p className="text-muted-foreground">See how EvalKit evaluates different types of content</p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-3xl" />
          <div className="glass-effect rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Select an example:</label>
                <select 
                  className="w-full p-2 rounded bg-background/50 border border-border"
                  value={selectedExample}
                  onChange={(e) => setSelectedExample(Number(e.target.value))}
                >
                  {examples.map((example, index) => (
                    <option key={index} value={index}>{example.name}</option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-muted-foreground">{currentExample.description}</p>
              </div>

              <div className="bg-background/50 p-4 rounded-lg font-mono text-sm overflow-auto">
                <pre className="whitespace-pre-wrap text-primary-foreground">
                  <code>{currentExample.code}</code>
                </pre>
              </div>

              <div className="flex flex-col items-center gap-2">
                <button
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  onClick={runExample}
                  disabled={loading || cooldown > 0}
                >
                  {loading ? 'Running evaluation...' : 
                   cooldown > 0 ? `Wait ${cooldown}s` : 'Run evaluation'}
                </button>
                {cooldown > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Rate limit exceeded. Please wait {cooldown} seconds before trying again.
                  </p>
                )}
                {error && (
                  <p className="text-sm text-red-500">
                    {error}
                  </p>
                )}
              </div>

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  <h3 className="text-xl font-semibold mb-4">Evaluation Results:</h3>
                  <Tabs value={selectedFormat} onValueChange={(value: string) => setSelectedFormat(value as ResultFormat)}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="console">Console</TabsTrigger>
                      <TabsTrigger value="json">JSON</TabsTrigger>
                    </TabsList>
                    <TabsContent value="console" className="mt-4">
                      <div className="bg-background/50 p-4 rounded-lg overflow-auto">
                        <ConsoleView result={result} />
                      </div>
                    </TabsContent>
                    <TabsContent value="json" className="mt-4">
                      <div className="bg-background/50 p-4 rounded-lg font-mono text-sm overflow-auto">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
} 