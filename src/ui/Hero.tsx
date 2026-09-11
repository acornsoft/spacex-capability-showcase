import { motion } from 'framer-motion'
import { HERO, SITE } from '@/content'
import { useDirector } from '@/lib/director'
import { ShimmerButton, SplitText, StatusPill } from '@/ui/craft'
import { MetricChips } from '@/ui/MetricChips'

type HeroProps = {
  isCoarse: boolean
}

export function Hero({ isCoarse }: HeroProps) {
  const { goTo } = useDirector()

  return (
    <section
      id="hero"
      className="relative flex min-h-[115svh] flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:px-10 md:pb-20 md:pt-24"
    >
      <MetricChips isCoarse={isCoarse} />

      <div className="relative z-10 max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="flex flex-wrap items-center gap-2"
        >
          <StatusPill label="Live demo  ·  Illustrative" />
          <p className="type-kicker">{HERO.kicker}</p>
        </motion.div>

        <h1 className="mt-5 font-display text-5xl leading-[0.92] font-semibold tracking-tight md:text-7xl">
          <SplitText text={HERO.lineOne} delay={0.18} colorClass="text-frost" />
          <span className="mt-1 block">
            <SplitText text={HERO.lineTwo} delay={0.42} colorClass="text-cyan" />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.95 }}
          className="mt-6 max-w-md text-base leading-relaxed text-mist md:text-lg"
        >
          {HERO.lede}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <ShimmerButton onClick={() => goTo('ascent')}>{HERO.cta}</ShimmerButton>
          <p className="max-w-xs font-mono text-[0.62rem] leading-relaxed tracking-[0.04em] text-steel">
            {SITE.disclaimer}
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.35, duration: 0.8 }}
        className="pointer-events-none absolute right-6 bottom-8 hidden items-center gap-3 md:flex"
      >
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-steel">
          Scroll to throttle
        </span>
        <span className="h-10 w-px overflow-hidden bg-white/10">
          <span className="block h-full w-full origin-top animate-[shimmer-sweep_1.8s_ease-in-out_infinite] bg-linear-to-b from-cyan to-transparent" />
        </span>
      </motion.div>
    </section>
  )
}
