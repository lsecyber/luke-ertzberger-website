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
              I'm an AI Developer and Technical Advisor passionate about designing responsible AI solutions
              for the public sector. Currently serving with the North Carolina Department of Information Technology,
              I design and prototype advanced AI applications leveraging large language models, AI agents, and
              machine learning frameworks.
            </p>
            <p>
              Beyond my role with the state, I serve as a Senior AI Engineer at Synply, developing cutting-edge
              AI systems. I also co-founded Triune Creative with my brothers, where we lead web design and
              media projects for nonprofits and small businesses.
            </p>
            <p>
              Outside of tech, I'm an active musician — I've played piano since age four and currently play weddings
              through Sophisticated Sound & Keys. I enjoy reading, photography, and tinkering with the latest AI tools
              in my free time.
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
