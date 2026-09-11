import { motion, useMotionValue, useMotionValueEvent, useSpring } from 'framer-motion'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { useReducedMotion } from '@/hooks/useRuntimeFlags'

type SplitTextProps = {
  text: string
  className?: string
  delay?: number
  colorClass?: string
  inView?: boolean
}

export function SplitText({ text, className, delay = 0, colorClass, inView = false }: SplitTextProps) {
  const reduced = useReducedMotion()
  if (reduced) {
    return <span className={`${colorClass ?? ''} ${className ?? ''}`.trim()}>{text}</span>
  }

  return (
    <span className={className}>
      {Array.from(text).map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className={`inline-block will-change-transform ${colorClass ?? ''}`}
          initial={{ y: '0.7em', opacity: 0, filter: 'blur(10px)' }}
          animate={inView ? undefined : { y: 0, opacity: 1, filter: 'blur(0px)' }}
          whileInView={inView ? { y: 0, opacity: 1, filter: 'blur(0px)' } : undefined}
          viewport={inView ? { once: true, amount: 0.7 } : undefined}
          transition={{
            delay: delay + index * 0.032,
            duration: 0.62,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

type SpotlightCardProps = {
  children: ReactNode
  className?: string
  beam?: boolean
  tilt?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onClick?: () => void
}

export function SpotlightCard({
  children,
  className = '',
  beam = false,
  tilt = false,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: SpotlightCardProps) {
  const reduced = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const [spot, setSpot] = useState({ x: 48, y: 28 })
  const [tiltVal, setTiltVal] = useState({ x: 0, y: 0 })

  const onMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const node = root.current
      if (!node) return
      const box = node.getBoundingClientRect()
      const x = ((event.clientX - box.left) / box.width) * 100
      const y = ((event.clientY - box.top) / box.height) * 100
      setSpot({ x, y })
      if (tilt && !reduced) {
        setTiltVal({
          x: ((y / 100) - 0.5) * -7,
          y: ((x / 100) - 0.5) * 7,
        })
      }
    },
    [reduced, tilt],
  )

  const onLeave = useCallback(() => {
    setTiltVal({ x: 0, y: 0 })
    onMouseLeave?.()
  }, [onMouseLeave])

  const style: CSSProperties = {
    ['--spot-x' as string]: `${spot.x}%`,
    ['--spot-y' as string]: `${spot.y}%`,
    transform: tilt && !reduced ? `perspective(900px) rotateX(${tiltVal.x}deg) rotateY(${tiltVal.y}deg)` : undefined,
    transition: 'transform 180ms ease',
  }

  return (
    <div
      ref={root}
      className={`spotlight-card glass relative overflow-hidden ${beam ? 'border-beam' : ''} ${className}`}
      style={style}
      onMouseMove={onMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

type ShimmerButtonProps = {
  children: ReactNode
  onClick?: () => void
  href?: string
  className?: string
  tone?: 'frost' | 'cyan'
}

export function ShimmerButton({
  children,
  onClick,
  href,
  className = '',
  tone = 'frost',
}: ShimmerButtonProps) {
  const classes = `shimmer-btn pointer-events-auto relative inline-flex items-center justify-center overflow-hidden rounded-full px-5 py-2.5 font-display text-sm font-semibold text-void ${tone === 'cyan' ? 'is-cyan' : ''} ${className}`

  if (href) {
    return (
      <a href={href} className={classes}>
        <span className="relative z-10">{children}</span>
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      <span className="relative z-10">{children}</span>
    </button>
  )
}

type CountTickerProps = {
  value: number
  decimals?: number
  className?: string
}

export function CountTicker({ value, decimals = 1, className }: CountTickerProps) {
  const reduced = useReducedMotion()
  const source = useMotionValue(reduced ? value : 0)
  const spring = useSpring(source, { stiffness: 55, damping: 18, mass: 0.7 })
  const [display, setDisplay] = useState(reduced ? value.toFixed(decimals) : (0).toFixed(decimals))

  useEffect(() => {
    source.set(value)
  }, [source, value])

  useMotionValueEvent(spring, 'change', (next) => {
    setDisplay(next.toFixed(decimals))
  })

  return <span className={className}>{display}</span>
}

type SparklineProps = {
  values: readonly number[]
  className?: string
}

export function Sparkline({ values, className = '' }: SparklineProps) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = max - min || 1
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100
      const y = 18 - ((value - min) / span) * 16
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg viewBox="0 0 100 20" className={`h-5 w-full overflow-visible ${className}`} aria-hidden>
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="spark-stroke"
      />
    </svg>
  )
}

type StatusPillProps = {
  label: string
}

export function StatusPill({ label }: StatusPillProps) {
  return (
    <span className="glass pointer-events-auto inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-mist">
      <span className="status-dot" />
      {label}
    </span>
  )
}
