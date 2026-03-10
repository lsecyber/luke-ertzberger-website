import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Linkedin, Github, Send } from "lucide-react";

export default function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();
    if (!name || !email || !message) return;

    setStatus("sending");

    const formData = new URLSearchParams();
    formData.append("form-name", "contact");
    formData.append("name", name);
    formData.append("email", email);
    formData.append("message", message);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    })
      .then(() => {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 3000);
      })
      .catch(() => {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      });
  };

  return (
    <section id="contact" className="py-32 relative">
      <div className="max-w-3xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="font-mono text-sm text-primary mb-2 tracking-wider">{"// Contact"}</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-muted-foreground mb-12 max-w-md mx-auto">
            I'm always open to discussing AI projects, collaborations, or just chatting about tech.
          </p>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          name="contact"
          method="POST"
          data-netlify="true"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="gradient-border rounded-2xl p-8 glow-card mb-10 space-y-5 relative z-10"
        >
          <input type="hidden" name="form-name" value="contact" />
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1.5">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={255}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-1.5">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              maxLength={1000}
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
              placeholder="What would you like to discuss?"
            />
          </div>
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm text-primary-foreground transition-all duration-300 hover:scale-105 disabled:opacity-50"
            style={{ background: "var(--gradient-primary)" }}
          >
            {status === "sent" ? "Sent!" : status === "error" ? "Error, try again" : status === "sending" ? "Sending…" : "Send Message"}
            <Send size={16} />
          </button>
        </motion.form>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex items-center justify-center gap-4"
        >
          {[
            { icon: Linkedin, href: "https://linkedin.com/in/lukeertzberger", label: "LinkedIn" },
            { icon: Github, href: "https://github.com/lsecyber", label: "GitHub" },
          ].map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-300"
            >
              <s.icon size={18} />
              <span className="text-sm font-medium">{s.label}</span>
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="mt-24 border-t border-border pt-8 text-center">
        <p className="text-xs text-muted-foreground font-mono">
          © {new Date().getFullYear()} Luke Ertzberger. All rights reserved.
        </p>
      </div>
    </section>
  );
}
