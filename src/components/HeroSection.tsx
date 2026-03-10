import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import headshotImg from "@/assets/luke-headshot.png";
import ParticleConstellation from "@/components/ParticleConstellation";

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Particle constellation */}
      <ParticleConstellation />

      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-glow-cyan/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-glow-purple/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 pt-20">
        {/* Text */}
        <div className="flex-1 text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-sm text-primary mb-4 tracking-wider"
          >
            {"// Hello, I'm"}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-4"
          >
            <span className="gradient-text">Luke</span>
            <br />
            <span className="text-foreground">Ertzberger</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8"
          >
            AI Solutions Architect & Senior AI Engineer crafting responsible, impactful AI for the public sector.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-4 justify-center lg:justify-start"
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm text-primary-foreground transition-all duration-300 hover:scale-105"
              style={{ background: "var(--gradient-primary)" }}
            >
              View My Work
              <ArrowDown size={16} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm border border-border text-foreground hover:bg-secondary transition-all duration-300"
            >
              Contact Me
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center gap-4 mt-8 justify-center lg:justify-start"
          >
            {[
              { icon: Github, href: "https://github.com/lsecyber", label: "GitHub" },
              { icon: Linkedin, href: "https://linkedin.com/in/lukeertzberger", label: "LinkedIn" },
              { icon: Mail, href: "#contact", label: "Contact" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("#") ? "_self" : "_blank"}
                rel={s.href.startsWith("#") ? undefined : "noopener noreferrer"}
                aria-label={s.label}
                className="p-2.5 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-300"
              >
                <s.icon size={18} />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Headshot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative flex-shrink-0"
        >
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
            {/* Glow behind */}
            <div className="absolute inset-4 rounded-full blur-[60px] opacity-30" style={{ background: "var(--gradient-primary)" }} />
            <img
              src={headshotImg}
              alt="Luke Ertzberger portrait"
              className="relative z-10 w-full h-full object-cover rounded-full animate-float"
            />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-5 h-8 rounded-full border-2 border-muted-foreground/40 flex items-start justify-center p-1"
        >
          <div className="w-1 h-2 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
