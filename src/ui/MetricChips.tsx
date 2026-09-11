import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect } from 'react'
import { METRICS } from '@/content'

type MetricChipsProps = {
  isCoarse: boolean
}

export function MetricChips({ isCoarse }: MetricChipsProps) {
  const chips = isCoarse ? METRICS.slice(0, 3) : METRICS
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 80, damping: 20, mass: 0.6 })
  const y = useSpring(my, { stiffness: 80, damping: 20, mass: 0.6 })

  useEffect(() => {
    if (isCoarse) return undefined
    const onMove = (event: PointerEvent) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1
      const ny = (event.clientY / window.innerHeight) * 2 - 1
      mx.set(nx * 16)
      my.set(ny * 10)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [isCoarse, mx, my])

  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block">
      {chips.map((metric, index) => (
        <motion.div
          key={metric.id}
          className="glass absolute min-w-[7.5rem] rounded-2xl px-3.5 py-2.5"
          style={{
            left: `${metric.anchor.x}%`,
            top: `${metric.anchor.y}%`,
            x,
            y,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 + index * 0.08, duration: 0.6 }}
        >
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-steel">
            {metric.label}
          </p>
          <p className="mt-1 font-display text-lg leading-none text-frost">
            {metric.value}
            <span className="ml-1 text-xs text-cyan">{metric.unit}</span>
          </p>
        </motion.div>
      ))}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute right-[12%] bottom-[12%] max-w-[14rem] text-right font-mono text-[0.58rem] uppercase tracking-[0.16em] text-steel/80"
      >
        Illustrative demo metrics — not operational data
      </motion.p>
    </div>
  )
}
