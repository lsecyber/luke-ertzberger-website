import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote, Linkedin } from "lucide-react";

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="endorsement" className="py-24 px-6">
      <div ref={ref} className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="font-mono text-sm text-primary tracking-wider mb-3">
            {"// Kind words"}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold gradient-text">
            Endorsement
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="gradient-border rounded-xl p-8 sm:p-10"
        >
          <Quote size={28} className="text-primary/40 mb-5" />
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 italic">
            "Luke is a rare talent... His coding skills far exceed his years and he delivered clever solutions that helped us ship faster, cleaner code. Luke particularly excels at implementing LLMs into software, including advanced techniques like RAG and fine-tuning."
          </p>
          <div className="border-t border-border pt-5 flex items-center justify-between">
            <div>
              <a
                href="https://www.linkedin.com/in/zacharyjquinn/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
              >
                Zach Quinn
                <Linkedin size={14} className="text-primary/60" />
              </a>
              <p className="text-muted-foreground text-sm">CEO, Glide LTC</p>
              <p className="text-primary/60 text-xs font-mono mt-1">Direct Manager</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
