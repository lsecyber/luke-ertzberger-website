import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const experiences = [
  {
    role: "AI Solutions Architect",
    company: "NC Department of Information Technology",
    period: "Sept 2025 – Present",
    description: "Design, build, and deploy production GenAI applications for state government — moving from ambiguous agency pain points to prototypes, production systems, and measurable value. Built an AI plate-screening tool saving the NC DMV an estimated 5,000+ staff hours a year, and a conversational analytics app processing 5,000+ survey responses per cycle. Advise 10+ agencies on model selection, evaluation, security, and responsible AI.",
    tags: ["LLMs", "AI Agents", "Vertex AI", "Evaluation", "Responsible AI"],
  },
  {
    role: "Senior AI Engineer",
    company: "Synply",
    period: "Nov 2025 – Present",
    description: "Lead applied AI for a regulated fintech SaaS product — building production RAG pipelines, multi-step agents, chat experiences, and MCP-integrated tooling. Run assistant safety and trust testing, surfacing prompt-injection, scope-boundary, and tool-disclosure risks and translating them into prioritized guardrails.",
    tags: ["Python", "RAG", "Agents", "MCP", "Guardrails"],
  },
  {
    role: "Founder & AI Consultant",
    company: "Triune Creative",
    period: "Sept 2024 – Nov 2025",
    description: "Founded and ran an AI consulting practice serving small businesses, nonprofits, and startups. Designed and deployed RAG-powered chatbots, AI-enabled web experiences, and workflow automations for 10+ organizations — owning discovery, architecture, delivery, and client communication.",
    tags: ["RAG", "Chatbots", "Automation", "Product Strategy"],
  },
  {
    role: "Full-Stack AI Developer",
    company: "Voltera",
    period: "May 2024 – Jul 2024",
    description: "Built AI document-processing for skilled nursing facilities on the MERN stack. Improved extraction accuracy from under 40% to over 90% through prompt engineering, model selection, and workflow tuning — cutting review time by 2+ hours per document.",
    tags: ["React", "Node.js", "MongoDB", "Prompt Engineering"],
  },
  {
    role: "Full-Stack Developer",
    company: "Inonde",
    period: "Jan 2024 – May 2024",
    description: "Built a natural-language-to-SQL capability for a government ERP platform using GPT-4, letting non-technical users query complex datasets conversationally. Delivered full-stack features across government systems with PHP, Angular, and Node.js.",
    tags: ["GPT-4", "PHP", "Angular", "Node.js"],
  },
  {
    role: "Junior Developer",
    company: "Inonde",
    period: "Oct 2021 – Dec 2023",
    description: "Developed and maintained JavaScript and PHP web applications, with some Python backends. Worked directly with clients to ship new features, fix bugs, and modernize existing government software.",
    tags: ["JavaScript", "PHP", "Python"],
  },
  {
    role: "B.S. in Computer Science",
    company: "Regent University",
    period: "Aug 2023 – May 2026",
    description: "Bachelor of Science in Computer Science, 4.0 GPA, summa cum laude. Served on the ACM chapter's student leadership team. Coursework in algorithms, data structures, machine learning, and software engineering.",
    tags: ["4.0 GPA", "Summa Cum Laude", "ACM Leadership"],
  },
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
