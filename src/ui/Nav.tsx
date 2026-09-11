import { motion } from 'framer-motion'
import { NAV_LINKS, SITE } from '@/content'
import { useDirector } from '@/lib/director'
import { assertNever, type NarrativeBeat } from '@/lib/scene-pose'

function beatActive(beat: NarrativeBeat, id: string): boolean {
  return id === beat
}

export function Nav() {
  const { beat, goTo } = useDirector()

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 md:px-8"
    >
      <button
        type="button"
        onClick={() => goTo('hero')}
        className="pointer-events-auto glass flex items-center gap-3 rounded-full px-3.5 py-2"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-frost/10 font-display text-[0.7rem] font-semibold text-cyan">
          A
        </span>
        <span className="font-display text-sm tracking-wide text-frost">{SITE.builder}</span>
        <span className="hidden font-mono text-[0.62rem] uppercase tracking-[0.18em] text-steel sm:inline">
          Capability
        </span>
      </button>

      <nav className="pointer-events-auto glass-strong relative hidden items-center gap-1 rounded-full px-1.5 py-1.5 md:flex">
        {NAV_LINKS.map((link) => {
          const active = beatActive(beat, link.id)
          return (
            <button
              key={link.id}
              type="button"
              onClick={() => goTo(link.id)}
              className="relative rounded-full px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-mist/70 transition-colors hover:text-frost"
            >
              {active ? (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-frost/10 ring-1 ring-cyan/30"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              ) : null}
              <span className={`relative z-10 ${active ? 'text-frost' : ''}`}>{link.label}</span>
            </button>
          )
        })}
      </nav>

      <a
        href={SITE.mailto}
        className="pointer-events-auto glass rounded-full px-3.5 py-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-cyan transition-colors hover:text-frost"
      >
        Contact
      </a>
    </motion.header>
  )
}

export function SequenceRail() {
  const { beat, goTo } = useDirector()
  const items = [
    { id: 'hero', label: '01  Standby', match: 'hero' as const },
    { id: 'ascent', label: '02  Ascent', match: 'ascent' as const },
    { id: 'precision', label: '03  Systems', match: 'precision' as const },
    { id: 'reuse', label: '04  Return', match: 'reuse' as const },
    { id: 'craft', label: '05  Craft', match: 'craft' as const },
    { id: 'contact', label: '06  Close', match: 'contact' as const },
  ]

  return (
    <aside className="pointer-events-none fixed top-1/2 right-5 z-30 hidden -translate-y-1/2 lg:block">
      <ol className="flex flex-col gap-2">
        {items.map((item) => {
          const active = item.match === beat
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => goTo(item.id)}
                className={`pointer-events-auto flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.18em] transition-colors ${
                  active ? 'text-cyan' : 'text-steel/70 hover:text-mist'
                }`}
              >
                <span className="relative block h-px w-5 overflow-hidden bg-white/15">
                  {active ? (
                    <motion.span
                      layoutId="rail-fill"
                      className="absolute inset-0 bg-cyan"
                      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                    />
                  ) : null}
                </span>
                {item.label}
              </button>
            </li>
          )
        })}
      </ol>
      {railCaption(beat)}
    </aside>
  )
}

function railCaption(beat: NarrativeBeat) {
  switch (beat) {
    case 'hero':
      return <p className="mt-4 max-w-[7rem] font-mono text-[0.55rem] tracking-[0.14em] text-steel/80">Product frame</p>
    case 'ascent':
      return <p className="mt-4 max-w-[7rem] font-mono text-[0.55rem] tracking-[0.14em] text-steel/80">Throttle map</p>
    case 'precision':
      return <p className="mt-4 max-w-[7rem] font-mono text-[0.55rem] tracking-[0.14em] text-steel/80">Fin close-up</p>
    case 'reuse':
      return <p className="mt-4 max-w-[7rem] font-mono text-[0.55rem] tracking-[0.14em] text-steel/80">Recovery</p>
    case 'craft':
      return <p className="mt-4 max-w-[7rem] font-mono text-[0.55rem] tracking-[0.14em] text-steel/80">Proof</p>
    case 'contact':
      return <p className="mt-4 max-w-[7rem] font-mono text-[0.55rem] tracking-[0.14em] text-steel/80">Signal</p>
    default:
      return assertNever(beat)
  }
}
