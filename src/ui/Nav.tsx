import { motion } from 'framer-motion'
import { NAV_LINKS, SITE } from '@/content'
import { useDirector } from '@/lib/director'
import { assertNever, type NarrativeBeat } from '@/lib/scene-pose'

const BEAT_HREF: Record<string, NarrativeBeat | 'hero'> = {
  ascent: 'ascent',
  precision: 'precision',
  reuse: 'reuse',
  craft: 'craft',
  contact: 'contact',
}

function beatActive(beat: NarrativeBeat, id: string): boolean {
  const mapped = BEAT_HREF[id]
  return mapped === beat
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

      <nav className="pointer-events-auto glass-strong hidden items-center gap-1 rounded-full px-1.5 py-1.5 md:flex">
        {NAV_LINKS.map((link) => (
          <button
            key={link.id}
            type="button"
            onClick={() => goTo(link.id)}
            className={`rounded-full px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.16em] transition-colors ${
              beatActive(beat, link.id)
                ? 'bg-frost/10 text-frost'
                : 'text-mist/70 hover:text-frost'
            }`}
          >
            {link.label}
          </button>
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
                <span
                  className={`block h-px w-4 ${active ? 'bg-cyan' : 'bg-white/20'}`}
                />
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
