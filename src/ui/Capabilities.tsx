import { motion } from 'framer-motion'
import { CAPABILITIES } from '@/content'
import { useDirector } from '@/lib/director'
import { SpotlightCard } from '@/ui/craft'

export function Capabilities() {
  const { setChapterFocus } = useDirector()

  return (
    <section id="craft" className="relative px-5 py-28 md:px-10 md:py-36">
      <div className="pointer-events-none absolute inset-0 bg-void/55" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        className="relative z-10 mb-10 max-w-2xl"
      >
        <p className="type-kicker">04  /  Proven here</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-frost md:text-5xl">
          What this site proves
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-mist">
          Six Acornsoft strengths, demonstrated by the page you are on — not
          slideware, and not a claim of flight heritage.
        </p>
      </motion.div>

      <div className="relative z-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {CAPABILITIES.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, delay: index * 0.05 }}
            className={index === 0 ? 'md:col-span-2 xl:col-span-1' : ''}
          >
            <SpotlightCard
              beam={index < 2}
              className="pointer-events-auto group h-full rounded-3xl bg-ink/40 p-6"
              onMouseEnter={() => setChapterFocus('hull')}
              onMouseLeave={() => setChapterFocus(null)}
            >
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-cyan">
                {card.index}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold text-frost">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">{card.body}</p>
              <p className="mt-4 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-steel transition-transform group-hover:translate-x-1 group-hover:text-cyan">
                Inspect the craft →
              </p>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
