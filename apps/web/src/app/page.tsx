'use client';

import type { SVGProps } from "react";
import { Star, GitFork, Eye } from "lucide-react";
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
          <div className="flex gap-4">
            <a
              href="https://docs.evalkit.ai"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105"
            >
              Get Started
            </a>
            <a
              href="https://github.com/evalkit/evalkit"
              className="glass-effect inline-flex h-12 items-center justify-center rounded-lg px-8 text-sm font-medium transition-all hover:bg-muted/50 hover:scale-105"
            >
              GitHub
            </a>
          </div>
          
          <div className="absolute bottom-[-120px] left-1/2 -translate-x-1/2">
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-6 h-10 rounded-full border-2 border-muted-foreground flex justify-center items-start p-1"
            >
              <motion.div
                animate={{
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-1 h-2 bg-muted-foreground rounded-full"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>
      
      <section className="container py-8 md:py-12 lg:py-24 mx-auto">
        <div className="mx-auto grid justify-center gap-8 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="feature-card group"
            >
              <div className="flex h-[180px] flex-col justify-between rounded-lg p-6">
                <feature.icon className="h-12 w-12 text-primary transition-transform duration-300 group-hover:scale-110" />
                <div className="space-y-2">
                  <h3 className="font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
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
                    <span className="text-[#86e1fc]">BiasMetric</span> 
                    {"} "}<span className="text-primary">from</span> <span className="text-[#a5d6ff]">&apos;@evalkit/core&apos;</span>;
                  </div>
                  <div>&nbsp;</div>
                  <div className="text-muted-foreground">{/* Example model output */}</div>
                  <div>
                    <span className="text-primary">const</span> modelOutput = <span className="text-[#a5d6ff]">&quot;The CEO discussed the strategy with his team.&quot;</span>;
                  </div>
                  <div>&nbsp;</div>
                  <div className="text-muted-foreground">{/* Initialize the evaluator */}</div>
                  <div>
                    <span className="text-primary">const</span> result = <span className="text-primary">await</span> evaluate(
                  </div>
                  <div className="pl-4">modelOutput,</div>
                  <div className="pl-4">[<span className="text-primary">new</span> BiasMetric()]</div>
                  <div>);</div>
                  <div>&nbsp;</div>
                  <div className="text-muted-foreground">{/* Check the results */}</div>
                  <div>console.<span className="text-primary">log</span>(result.metrics);</div>
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
          <h2 className="text-3xl font-bold sm:text-4xl mb-16">Backed by the community</h2>
          <div className="grid grid-cols-3 gap-12 text-center">
            {[
              { icon: Star, label: "GitHub Stars", count: "70+" },
              { icon: GitFork, label: "Forks", count: "10+" },
              { icon: Eye, label: "Watchers", count: "100+" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-effect rounded-xl p-6 flex flex-col items-center gap-4"
              >
                <div className="flex items-center gap-2 text-3xl font-bold">
                  <stat.icon className="h-8 w-8 text-primary" />
                  <span>{stat.count}</span>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  );
}

const features = [
  {
    title: "Bias Detection",
    description: "Identify and mitigate biases in your models to ensure fairness.",
    icon: function BiasIcon(props: SVGProps<SVGSVGElement>) {
      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.21 8.83 18.83 11.21C18.78 11.25 18.65 11.25 18.6 11.21M11.21 18.83 8.83 21.21C8.78 21.25 8.65 21.25 8.6 21.21M11.21 8.83 8.83 11.21C8.78 11.25 8.65 11.25 8.6 11.21M18.83 18.83 21.21 21.21C21.25 21.25 21.25 21.38 21.21 21.43M19.07 4.93A10 10 0 0 0 4.93 19.07" />
        </svg>
      );
    },
  },
  {
    title: "Coherence Metrics",
    description:
      "Evaluate the logical consistency and flow of your model's outputs.",
    icon: function CoherenceIcon(props: SVGProps<SVGSVGElement>) {
      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      );
    },
  },
  {
    title: "Hallucination Detection",
    description:
      "Detect and prevent false or fabricated information in model outputs.",
    icon: function HallucinationIcon(props: SVGProps<SVGSVGElement>) {
      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    },
  },
];
