import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, GraduationCap, Music, type LucideIcon } from "lucide-react";
import GoogleLogo from "@/components/GoogleLogo";

const highlights: { icon: LucideIcon | "google"; label: string; desc: string }[] = [
  { icon: "google", label: "Field Solutions Architect, GenAI", desc: "Google Public Sector" },
  { icon: Briefcase, label: "Previously", desc: "NC Dept. of IT · Synply" },
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
              enough to use it. That's the problem I work on. As a Field Solutions Architect for GenAI on
              Google Public Sector's Rapid Innovation Team, I build AI prototypes for federal civilian
              agencies that prove the art of the possible — fast, hands-on, and grounded in their real missions.
            </p>
            <p>
              My work spans the full lifecycle — from ambiguous agency pain points to working prototypes, LLM
              and agent integrations, evaluation frameworks, safety guardrails, and a clear path to
              production. The goal is simple: show what AI can actually do for a mission, then make sure it
              holds up once real people depend on it.
            </p>
            <p>
              Before Google, I was an AI Solutions Architect at the North Carolina Department of Information
              Technology's Office of AI &amp; Policy, where I shipped production GenAI systems for the state —
              including an AI plate-screening tool that saves the NC DMV an estimated 5,000+ staff hours a
              year. In parallel, I was a Senior AI Engineer at Synply, building production RAG pipelines,
              multi-step agents, and MCP-integrated tooling for a regulated fintech platform. I also founded
              Triune Creative, shipping AI-enabled solutions for 10+ organizations.
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
            {highlights.map((h) => (
              <motion.div
                key={h.label}
                whileHover={{ scale: 1.03, y: -4 }}
                className="gradient-border rounded-xl p-5 glow-card cursor-default"
              >
                {h.icon === "google" ? (
                  <GoogleLogo size={14} className="mb-3" />
                ) : (
                  <h.icon size={20} className="text-primary mb-3" />
                )}
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
