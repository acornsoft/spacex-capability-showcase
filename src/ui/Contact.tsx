import { motion } from 'framer-motion'
import { CONTACT, SITE } from '@/content'

export function Contact() {
  return (
    <section
      id="contact"
      className="relative flex min-h-[100svh] items-end px-5 pb-16 pt-24 md:items-center md:px-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-void/40" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        className="glass relative z-10 w-full max-w-2xl rounded-3xl p-7 md:p-10"
      >
        <p className="type-kicker">{CONTACT.kicker}</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-frost md:text-5xl">
          {CONTACT.title}
        </h2>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-mist">
          {CONTACT.body}
        </p>
        <a
          href={SITE.mailto}
          className="pointer-events-auto mt-8 inline-flex rounded-full bg-cyan px-5 py-2.5 font-display text-sm font-semibold text-void transition hover:bg-frost"
        >
          {CONTACT.cta}
        </a>
        <p className="mt-8 max-w-md font-mono text-[0.62rem] leading-relaxed tracking-[0.04em] text-steel">
          {SITE.disclaimer}
        </p>
      </motion.div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="relative z-10 flex flex-col gap-2 border-t border-white/8 px-5 py-6 text-steel md:flex-row md:items-center md:justify-between md:px-10">
      <p className="font-display text-sm text-mist">Built by {SITE.builder}</p>
      <a href={SITE.mailto} className="font-mono text-xs text-cyan">
        {SITE.email}
      </a>
      <p className="max-w-sm font-mono text-[0.62rem] leading-relaxed">
        {SITE.disclaimer}
      </p>
    </footer>
  )
}
