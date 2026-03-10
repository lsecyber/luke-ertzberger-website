import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Lightbulb, Wrench, TrendingUp } from "lucide-react";
import { useEffect } from "react";

interface ProjectDetail {
  title: string;
  category: string;
  description: string;
  tags: string[];
  color: string;
  link?: string;
  problem: string;
  approach: string;
  results: string;
}

interface ProjectModalProps {
  project: ProjectDetail | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const sections = project
    ? [
        { icon: Lightbulb, label: "Problem", content: project.problem, accent: "text-[hsl(var(--glow-cyan))]" },
        { icon: Wrench, label: "Approach", content: project.approach, accent: "text-[hsl(var(--glow-purple))]" },
        { icon: TrendingUp, label: "Results", content: project.results, accent: "text-[hsl(var(--glow-pink))]" },
      ]
    : [];

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            style={{ boxShadow: "var(--shadow-glow-lg)" }}
          >
            {/* Gradient top bar */}
            <div className={`h-1.5 bg-gradient-to-r ${project.color} rounded-t-2xl`} />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all z-10"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="p-8 pt-6">
              {/* Header */}
              <span className="font-mono text-xs text-primary tracking-wider">{project.category}</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mt-1 mb-2 pr-10">
                {project.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {project.description}
              </p>

              {/* Case study sections */}
              <div className="space-y-6">
                {sections.map((section, i) => (
                  <motion.div
                    key={section.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                    className="flex gap-4"
                  >
                    <div className={`flex-shrink-0 mt-1 ${section.accent}`}>
                      <section.icon size={20} />
                    </div>
                    <div>
                      <h4 className={`text-sm font-semibold uppercase tracking-wider mb-1.5 ${section.accent}`}>
                        {section.label}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg text-xs font-mono bg-secondary text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Link */}
              {project.link && (
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-lg font-medium text-sm text-primary-foreground transition-all duration-300 hover:scale-105"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  View Project
                  <ExternalLink size={14} />
                </motion.a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
