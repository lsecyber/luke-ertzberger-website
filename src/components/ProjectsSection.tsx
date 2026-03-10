import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import ProjectModal from "./ProjectModal";

const projects = [
  {
    title: "DMV Profanity Validation AI",
    category: "AI / Government",
    description: "Designed and built an AI system for the NC DMV that automatically validates whether personalized plate strings contain profanity, replacing a massive manual review process.",
    tags: ["Python", "LLMs", "AI/ML", "Automation"],
    color: "from-glow-cyan/20 to-glow-blue/20",
    problem: "A team at the NC DMV was manually reviewing over 1,500 personalized license plate requests per week to check for profanity and hidden meanings — consuming hundreds of hours of staff time every month.",
    approach: "Collaborated directly with the DMV team to understand their review criteria and edge cases. Designed and built an AI-powered validation tool that analyzes strings for profanity, slang, and obfuscated language, then presents findings to a human reviewer for final approval.",
    results: "The tool saves an estimated 5,000+ staff hours per year by automating the research and flagging process, letting reviewers focus on edge cases rather than manually checking every submission.",
  },
  {
    title: "Survey Analysis AI Tool",
    category: "AI / Government",
    description: "Built an AI-powered tool that processes 5,000+ survey responses, generates per-row analysis, performs overall sentiment analysis, and features a conversational chat interface.",
    tags: ["Python", "LLMs", "Data Analysis", "NLP"],
    color: "from-glow-blue/20 to-glow-purple/20",
    problem: "A state agency was drowning in survey data — receiving 5,000+ responses per cycle in massive Excel spreadsheets with no efficient way to extract insights, identify trends, or summarize findings.",
    approach: "Designed an AI tool that ingests large spreadsheets, generates analysis and summaries for each individual row, then performs overall sentiment analysis and trend identification across the full dataset. Added a conversational chat interface so analysts can ask follow-up questions about the data naturally.",
    results: "Transformed a process that took weeks of manual reading into an interactive analysis session. Analysts can now digest thousands of responses in hours and surface actionable insights through natural conversation with the data.",
  },
  {
    title: "Allo — Synply's AI Assistant",
    category: "AI / SaaS",
    description: "Leading the design and implementation of Allo, Synply's AI assistant — building on the existing platform to make it AI-native from the ground up.",
    tags: ["AI/ML", "Product Strategy", "Platform Design"],
    link: "https://synply.io/",
    color: "from-glow-pink/20 to-glow-cyan/20",
    problem: "Synply had a powerful platform but users were underutilizing its capabilities. The product needed an intelligent layer that could guide users, automate workflows, and make the platform feel effortlessly smart.",
    approach: "Helping guide the vision and implementation of Allo, Synply's AI assistant, building it on top of the existing UI and leading the effort to make the entire platform AI-native — not just bolting on a chatbot, but deeply integrating intelligence into every workflow.",
    results: "Allo is actively transforming how users interact with Synply, reducing friction and surfacing capabilities users didn't know existed. The platform is evolving from a tool you operate into one that works with you.",
  },
  {
    title: "Spiritual Twist Productions",
    category: "Web Development",
    description: "Redesigned the website and built a custom registration system to manage growing programs, improving accessibility and streamlining administration.",
    tags: ["Vue.js", "PHP", "MySQL", "UI/UX"],
    link: "https://spiritualtwist.com/",
    color: "from-glow-cyan/20 to-glow-purple/20",
    problem: "A growing arts organization was managing registrations through spreadsheets and email, leading to lost sign-ups, double bookings, and frustrated parents.",
    approach: "Redesigned the website with Vue.js for a modern, accessible experience and built a custom PHP/MySQL registration system with automated confirmations, waitlists, and admin dashboards.",
    results: "Registration errors dropped to near-zero. Administrative time was cut by over 70%, and the organization scaled from dozens to hundreds of registrants per season without adding staff.",
  },
  {
    title: "Brandy Morley Music",
    category: "Web Design",
    description: "Designed a responsive website showcasing a debut album with integrated streaming, blog, online store, and newsletter signup.",
    tags: ["Squarespace", "Web Design", "E-Commerce"],
    link: "https://brandymorleymusic.com/",
    color: "from-glow-purple/20 to-glow-blue/20",
    problem: "An independent artist launching a debut album needed a professional online presence that could handle streaming links, merchandise sales, and fan engagement — all in one place.",
    approach: "Designed a responsive, visually rich Squarespace site with integrated streaming embeds, an e-commerce store for merchandise, a blog for updates, and a newsletter signup for fan retention.",
    results: "The site became the central hub for the album launch, driving streaming plays and merchandise sales while growing an engaged email list of fans.",
  },
];

export default function ProjectsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selected, setSelected] = useState<(typeof projects)[number] | null>(null);

  return (
    <section id="projects" className="py-32 relative">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="max-w-6xl mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-sm text-primary mb-2 tracking-wider">{"// Projects"}</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-16">
            Featured <span className="gradient-text">Work</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              whileHover={{ y: -6 }}
              onClick={() => setSelected(project)}
              className="group gradient-border rounded-xl overflow-hidden glow-card cursor-pointer"
            >
              {/* Gradient top bar */}
              <div className={`h-1 bg-gradient-to-r ${project.color}`} />

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-primary">{project.category}</span>
                  <span className="text-muted-foreground group-hover:text-primary transition-colors">
                    <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-300" />
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-xs font-mono bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Click hint */}
                <p className="text-xs text-muted-foreground/50 mt-4 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Click to view case study →
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
