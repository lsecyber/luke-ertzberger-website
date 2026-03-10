import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const experiences = [
  {
    role: "AI Solutions Architect",
    company: "NC Department of Information Technology",
    period: "Sept 2025 – Present",
    description: "Design and prototype advanced AI applications using LLMs, AI agents, and ML frameworks. Guide strategic AI adoption across state agencies and establish governance frameworks.",
    tags: ["Python", "LLMs", "Terraform", "Kubernetes"],
  },
  {
    role: "Senior AI Engineer",
    company: "Synply",
    period: "Nov 2025 – Present",
    description: "Lead AI implementation for internal workflows and the Synply product. Develop cutting-edge AI systems and advise on strategic implementations.",
    tags: ["Python", "FastAPI", "AI/ML", "PostgreSQL"],
  },
  {
    role: "B.S. in Computer Science",
    company: "Regent University",
    period: "Aug 2023 – Aug 2025",
    description: "Graduated with a Bachelor of Science in Computer Science with a 4.0 GPA. Completed coursework in algorithms, data structures, machine learning, and software engineering.",
    tags: ["Computer Science", "Software Development", "AI", "BS Degree"],
  },
  {
    role: "Full-Stack AI Developer",
    company: "Voltera",
    period: "May 2024 – Jul 2024",
    description: "Built healthcare AI solutions for skilled nursing facilities using the MERN stack. Engineered AI-enhanced workflows and optimized ERP systems.",
    tags: ["React", "Node.js", "MongoDB", "AI/ML"],
  },
  {
    role: "Full-Stack Developer",
    company: "Inonde",
    period: "Jan 2024 – Aug 2024",
    description: "Developed government contract solutions with PHP, FastAPI, and Vue.js. Built scalable web applications serving government agencies.",
    tags: ["PHP", "FastAPI", "Vue.js", "PostgreSQL"],
  },
  {
    role: "Junior Developer",
    company: "Inonde",
    period: "Oct 2021 – Sept 2023",
    description: "Contributed to government contract solutions with PHP and Vue.js. Developed web applications for government agencies.",
    tags: ["PHP", "Vue.js", "PostgreSQL"],
  }
];

export default function ExperienceSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="py-32 relative">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="max-w-4xl mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-sm text-primary mb-2 tracking-wider">{"// Experience"}</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-16">
            Where I've <span className="gradient-text">Worked</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.company + exp.role}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.15 * i, duration: 0.5 }}
                className="relative pl-12"
              >
                {/* Dot */}
                <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 border-primary bg-background" />

                <div className="gradient-border rounded-xl p-6 glow-card">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h3 className="font-semibold text-foreground text-lg">{exp.role}</h3>
                    <span className="font-mono text-xs text-muted-foreground">{exp.period}</span>
                  </div>
                  <p className="text-sm text-primary font-medium mb-3">{exp.company}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-primary/10 text-primary border border-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
