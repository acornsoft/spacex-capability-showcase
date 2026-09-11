import { motion } from 'framer-motion'
import { HERO, SITE } from '@/content'
import { MetricChips } from '@/ui/MetricChips'

type HeroProps = {
  isCoarse: boolean
}

export function Hero({ isCoarse }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:px-10 md:pb-20 md:pt-24"
    >
      <MetricChips isCoarse={isCoarse} />

      <div className="relative z-10 max-w-xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="type-kicker"
        >
          {HERO.kicker}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 font-display text-5xl leading-[0.92] font-semibold tracking-tight md:text-7xl"
        >
          <span className="block text-frost">{HERO.lineOne}</span>
          <span className="mt-1 block text-cyan">{HERO.lineTwo}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.55 }}
          className="mt-6 max-w-md text-base leading-relaxed text-mist md:text-lg"
        >
          {HERO.lede}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <a
            href={HERO.ctaHref}
            className="pointer-events-auto rounded-full bg-frost px-5 py-2.5 font-display text-sm font-semibold text-void transition hover:bg-cyan"
          >
            {HERO.cta}
          </a>
          <p className="max-w-xs font-mono text-[0.62rem] leading-relaxed tracking-[0.04em] text-steel">
            {SITE.disclaimer}
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="pointer-events-none absolute right-6 bottom-8 hidden items-center gap-3 md:flex"
      >
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-steel">
          Scroll to throttle
        </span>
        <span className="h-10 w-px bg-linear-to-b from-cyan to-transparent" />
      </motion.div>
    </section>
  )
}
