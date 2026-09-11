import { motion } from 'framer-motion'
import { NAV_LINKS, SITE } from '@/content'

export function Nav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 md:px-8"
    >
      <a
        href="#hero"
        className="pointer-events-auto glass flex items-center gap-3 rounded-full px-3.5 py-2"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-frost/10 font-display text-[0.7rem] font-semibold text-cyan">
          A
        </span>
        <span className="font-display text-sm tracking-wide text-frost">
          {SITE.builder}
        </span>
        <span className="hidden font-mono text-[0.62rem] uppercase tracking-[0.18em] text-steel sm:inline">
          Capability
        </span>
      </a>

      <nav className="pointer-events-auto glass-strong hidden items-center gap-1 rounded-full px-2 py-1.5 md:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className="rounded-full px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-mist/80 transition-colors hover:text-frost"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <a
        href={SITE.mailto}
        className="pointer-events-auto glass rounded-full px-3.5 py-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-cyan"
      >
        Contact
      </a>
    </motion.header>
  )
}
