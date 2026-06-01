import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, GraduationCap, Music, Heart } from "lucide-react";

const highlights = [
  { icon: Briefcase, label: "AI Solutions Architect", desc: "NC Dept. of IT" },
  { icon: Briefcase, label: "Senior AI Engineer", desc: "Synply" },
  { icon: GraduationCap, label: "B.S. Computer Science", desc: "Regent University" },
  { icon: Music, label: "Musician", desc: "Since age 4" },
];

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-sm text-primary mb-2 tracking-wider">{"// About"}</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            A Bit <span className="gradient-text">About Me</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-4 text-muted-foreground leading-relaxed"
          >
            <p>
              Most AI doesn't fail because the model can't perform — it fails because no one trusts it
              enough to use it. That's the problem I work on. As an AI Solutions Architect at the North
              Carolina Department of Information Technology's Office of AI &amp; Policy, I design, build, and
              ship production GenAI systems in one of the most regulated, high-stakes environments there is.
            </p>
            <p>
              My work spans the full lifecycle — from ambiguous agency pain points to working prototypes, LLM
              and agent integrations, evaluation frameworks, safety guardrails, and production systems that
              deliver measurable value. Recent builds include an AI plate-screening tool that saves the NC DMV
              an estimated 5,000+ staff hours a year and a conversational analytics app that compresses weeks
              of survey review into hours.
            </p>
            <p>
              Alongside the state, I'm a Senior AI Engineer at Synply, building production RAG pipelines,
              multi-step agents, and MCP-integrated tooling for a regulated fintech platform — including
              assistant safety and trust testing against prompt-injection and scope-boundary risks. I
              previously founded Triune Creative, shipping AI-enabled solutions for 10+ organizations.
            </p>
            <p>
              Outside of tech, I'm an active musician — I've played piano since age four and play weddings
              through Sophisticated Sound &amp; Keys. I enjoy reading, photography, and tinkering with the
              latest AI tools in my free time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {highlights.map((h, i) => (
              <motion.div
                key={h.label}
                whileHover={{ scale: 1.03, y: -4 }}
                className="gradient-border rounded-xl p-5 glow-card cursor-default"
              >
                <h.icon size={20} className="text-primary mb-3" />
                <p className="text-sm font-semibold text-foreground">{h.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{h.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
