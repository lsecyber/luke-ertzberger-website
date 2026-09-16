import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "25,000+", label: "Hours saved for organizations" },
  { value: "5+", label: "Years shipping production software" },
  { value: "10+", label: "Organizations & clients served" },
  { value: "3", label: "Sectors: government · fintech · private" },
];

export default function StatsStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative py-12 border-y border-border/40">
      <div className="absolute inset-0 bg-secondary/40" />
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.12 * i, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1.5">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground font-mono leading-snug">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
