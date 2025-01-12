'use client';

import { Star, GitFork, Eye, Github, Code2, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute -top-1/2 right-0 h-[500px] w-[500px] rounded-full bg-primary/30 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 10,
          }}
          className="absolute -bottom-1/2 left-0 h-[500px] w-[500px] rounded-full bg-accent/30 blur-[120px]"
        />
      </div>
      
      <section className="container relative min-h-screen flex items-center justify-center py-8 md:py-12 lg:py-24 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex max-w-[64rem] flex-col items-center gap-8 text-center relative"
        >
          <div className="space-y-6">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
              The TypeScript{" "}
              <span className="gradient-text">LLM Evaluation Library</span>
            </h1>
            <p className="mx-auto max-w-[42rem] text-center leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Open-source library designed for TypeScript developers to evaluate and
              improve the performance of large language models with confidence.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="container py-8 md:py-12 lg:py-24 mx-auto">
        <div className="mx-auto grid justify-center gap-8 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="feature-card group"
          >
            <div className="flex h-[180px] flex-col justify-between rounded-lg p-6">
              <GitFork className="h-12 w-12 text-primary transition-transform duration-300 group-hover:scale-110" />
              <div className="space-y-2">
                <h3 className="font-bold">Open Source</h3>
                <p className="text-sm text-muted-foreground">
                  Built with transparency in mind. Inspect, contribute, and customize the evaluation metrics to match your needs.
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="feature-card group"
          >
            <div className="flex h-[180px] flex-col justify-between rounded-lg p-6">
              <Star className="h-12 w-12 text-primary transition-transform duration-300 group-hover:scale-110" />
              <div className="space-y-2">
                <h3 className="font-bold">Extensible</h3>
                <p className="text-sm text-muted-foreground">
                  Create custom metrics, add new evaluation criteria, and integrate with your existing workflow.
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="feature-card group"
          >
            <div className="flex h-[180px] flex-col justify-between rounded-lg p-6">
              <Eye className="h-12 w-12 text-primary transition-transform duration-300 group-hover:scale-110" />
              <div className="space-y-2">
                <h3 className="font-bold">Transparent</h3>
                <p className="text-sm text-muted-foreground">
                  Clear evaluation criteria and detailed reports help you understand and improve your LLM&apos;s performance.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container py-8 md:py-12 lg:py-24 mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-[64rem]"
        >
          <div className="mb-12 flex flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Simple to integrate</h2>
            <p className="text-muted-foreground">Start evaluating your LLM in minutes</p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-3xl" />
            <div className="code-block">
              <div className="p-4 font-mono text-[13px] leading-relaxed">
                <div className="grid auto-rows-[1.2em] gap-0">
                  <div>
                    <span className="text-primary">import</span> {"{ "}
                    <span className="text-[#86e1fc]">evaluate</span>, 
                    <span className="text-[#86e1fc]">BiasDetectionMetric</span>, 
                    <span className="text-[#86e1fc]">CoherenceMetric</span>
                    {"} "}<span className="text-primary">from</span> <span className="text-[#a5d6ff]">&apos;@evalkit/core&apos;</span>;
                  </div>
                  <div>&nbsp;</div>
                  <div>{/* Example model output */}</div>
                  <div><span className="text-primary">const</span> result = <span className="text-primary">await</span> evaluate({"{"}</div>
                  <div className="ml-4">{/* The response (output) by the LLM */}</div>
                  <div className="ml-4">output: <span className="text-[#a5d6ff]">&quot;The company prefers to hire young and energetic candidates.&quot;</span>,</div>
                  <div className="ml-4">{/* The metrics to use */}</div>
                  <div>{"}"}, [BiasDetectionMetric, CoherenceMetric]);</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="container py-8 md:py-12 lg:py-24 mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-[64rem] text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl mb-8">Built in the Open</h2>
          <div className="grid sm:grid-cols-3 gap-8 mb-16">
            <div className="glass-effect p-6 rounded-xl">
              <Code2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">MIT Licensed</h3>
              <p className="text-sm text-muted-foreground">
                100% free and open source. Use it in personal or commercial projects.
              </p>
            </div>
            <div className="glass-effect p-6 rounded-xl">
              <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Community Driven</h3>
              <p className="text-sm text-muted-foreground">
                Built with feedback from AI developers. Join our discussions on GitHub.
              </p>
            </div>
            <div className="glass-effect p-6 rounded-xl">
              <Github className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Public Roadmap</h3>
              <p className="text-sm text-muted-foreground">
                Development and decisions made transparently on GitHub.
              </p>
            </div>
          </div>

          <div className="glass-effect p-8 rounded-xl max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-6">
              <Github className="h-16 w-16 text-primary" />
              <div>
                <h3 className="text-2xl font-bold mb-2">Star us on GitHub</h3>
                <p className="text-muted-foreground mb-6">
                  Support the project by starring us on GitHub. It helps us reach more developers!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://github.com/evalkit/evalkit" 
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all"
                >
                  <Github className="h-4 w-4" />
                  Star on GitHub
                </a>
                <a 
                  href="https://github.com/evalkit/evalkit/discussions" 
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-input px-8 py-3 text-sm font-medium hover:bg-muted/50 hover:scale-105 transition-all"
                >
                  <MessageSquare className="h-4 w-4" />
                  Join Discussion
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}

