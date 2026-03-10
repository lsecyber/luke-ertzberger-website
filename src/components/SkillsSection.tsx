import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const categories = [
  {
    name: "AI & ML",
    skills: ["LLMs", "AI Agents", "Machine Learning", "Responsible AI", "Synthetic Data", "Digital Twins"],
  },
  {
    name: "Languages",
    skills: ["Python", "JavaScript", "TypeScript", "PHP", "Shell Scripting", "Java"],
  },
  {
    name: "Frameworks",
    skills: ["FastAPI", "Vue.js", "React", "Node.js", "Angular", "Flask"],
  },
  {
    name: "Infrastructure",
    skills: ["Terraform", "Kubernetes", "Docker", "AWS", "PostgreSQL", "DynamoDB"],
  },
  {
    name: "Other",
    skills: ["UI/UX Design", "Git", "Linux/Bash", "Adobe Suite", "ASL", "100 WPM Typing"],
  },
];

export default function SkillsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section id="skills" className="py-32 relative">
      <div className="max-w-5xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-sm text-primary mb-2 tracking-wider">{"// Skills"}</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">
            Tech <span className="gradient-text">Arsenal</span>
          </h2>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {categories.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(i)}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === i
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground bg-secondary"
              }`}
            >
              {activeCategory === i && (
                <motion.span
                  layoutId="skill-tab"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "var(--gradient-primary)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Skills grid */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        >
          {categories[activeCategory].skills.map((skill, i) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="gradient-border rounded-xl p-4 text-center cursor-default glow-card"
            >
              <span className="text-sm font-medium text-foreground">{skill}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
