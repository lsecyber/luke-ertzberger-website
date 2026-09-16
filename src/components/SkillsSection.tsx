import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Award, ExternalLink } from "lucide-react";

const categories = [
  {
    name: "Applied AI",
    skills: ["LLMs", "RAG", "AI Agents", "Context Engineering", "Prompt Engineering", "Model Evaluation", "Embeddings", "Vector Search", "Guardrails", "Human-in-the-Loop"],
  },
  {
    name: "AI Tooling",
    skills: ["Claude Code", "Codex", "GitHub Copilot", "Cursor", "MCP", "LangChain", "LangGraph", "OpenAI Agents SDK"],
  },
  {
    name: "Cloud AI",
    skills: ["Vertex AI", "Gemini Enterprise", "AWS Bedrock", "Azure AI Foundry", "ChatGPT Enterprise", "BigQuery"],
  },
  {
    name: "Languages",
    skills: ["Python", "SQL", "TypeScript", "JavaScript", "Java", "PHP", "C++"],
  },
  {
    name: "Engineering",
    skills: ["FastAPI", "React", "Vue.js", "Node.js", "Docker", "Kubernetes", "PostgreSQL", "DynamoDB"],
  },
  {
    name: "Also",
    skills: ["Responsible AI", "UI/UX Design", "Git", "Linux/Bash", "ASL", "100 WPM Typing"],
  },
];

const certifications = [
  {
    name: "Generative AI Leader",
    issuer: "Google Cloud",
    href: "https://www.credly.com/badges/e712e15b-fc7a-4e63-9d60-f1ef29e30ae1/public_url",
  },
  { name: "Generative AI Fundamentals", issuer: "Google Cloud" },
  {
    name: "Responsible AI for Public Sector",
    issuer: "InnovateUS",
    href: "https://www.linkedin.com/in/lukeertzberger/overlay/Certifications/833618222/treasury/?profileId=ACoAAEbXLTABzNjZqA6q0XCDKYISBQwy6Xnv1pM",
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

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-16"
        >
          <div className="flex items-center gap-2 mb-5">
            <Award size={18} className="text-primary" />
            <h3 className="text-sm font-mono text-muted-foreground tracking-wider">
              {"// Certifications"}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {certifications.map((cert) => {
              const content = (
                <>
                  <div>
                    <p className="text-sm font-medium text-foreground">{cert.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{cert.issuer}</p>
                  </div>
                  {cert.href && (
                    <ExternalLink
                      size={14}
                      className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5"
                    />
                  )}
                </>
              );

              return cert.href ? (
                <a
                  key={cert.name}
                  href={cert.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group gradient-border rounded-xl p-4 glow-card flex items-start justify-between gap-3"
                >
                  {content}
                </a>
              ) : (
                <div
                  key={cert.name}
                  className="gradient-border rounded-xl p-4 flex items-start justify-between gap-3"
                >
                  {content}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
