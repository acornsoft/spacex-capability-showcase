import { motion } from 'framer-motion'
import { CAPABILITIES } from '@/content'

export function Capabilities() {
  return (
    <section id="craft" className="relative px-5 py-28 md:px-10 md:py-36">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        className="mb-10 max-w-2xl"
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {CAPABILITIES.map((card, index) => (
          <motion.article
            key={card.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, delay: index * 0.05 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="glass pointer-events-auto rounded-3xl p-6"
          >
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-cyan">
              {card.index}
            </p>
            <h3 className="mt-3 font-display text-xl font-semibold text-frost">
              {card.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-mist">{card.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
