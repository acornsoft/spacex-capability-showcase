import { motion } from 'framer-motion'
import { CHAPTERS, TELEMETRY, type ChapterId } from '@/content'
import { useDirector } from '@/lib/director'
import { chapterPart, assertNever } from '@/lib/scene-pose'
import { Sparkline, SplitText, SpotlightCard } from '@/ui/craft'

type ChapterAsideKind = 'telemetry' | 'reuse' | 'engines'

type ChapterBlockProps = {
  id: ChapterId
  index: string
  title: string
  body: string
  aside?: ChapterAsideKind
}

function ChapterBlock({ id, index, title, body, aside = 'engines' }: ChapterBlockProps) {
  const { setChapterFocus, goTo } = useDirector()
  const part = chapterPart(id)

  return (
    <section
      id={id}
      className="relative flex min-h-[145svh] items-center px-5 py-24 md:px-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.45 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto max-w-lg"
      >
        <SpotlightCard
          beam
          tilt
          className="cursor-pointer rounded-3xl p-6 md:p-8"
          onMouseEnter={() => setChapterFocus(part)}
          onMouseLeave={() => setChapterFocus(null)}
          onClick={() => goTo(id)}
        >
          <p className="type-kicker">{index}  /  Sequence</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-frost md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-mist">{body}</p>
          <ChapterAside kind={aside} />
        </SpotlightCard>
      </motion.div>
    </section>
  )
}

function ChapterAside({ kind }: { kind: ChapterAsideKind }) {
  switch (kind) {
    case 'telemetry':
      return (
        <dl className="mt-6 grid grid-cols-2 gap-2">
          {TELEMETRY.map((row) => (
            <div key={row.key} className="glass-strong rounded-2xl px-3 py-2.5">
              <dt className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-steel">
                {row.key} · {row.label}
              </dt>
              <dd className="mt-1 flex items-end justify-between gap-2">
                <span className="font-display text-sm text-cyan">{row.value}</span>
                <span className="w-14 text-cyan">
                  <Sparkline values={row.spark} />
                </span>
              </dd>
            </div>
          ))}
        </dl>
      )
    case 'reuse':
      return (
        <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-amber">
          Hover to isolate legs  ·  click to hold this shot
        </p>
      )
    case 'engines':
      return (
        <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-cyan">
          Hover to isolate the engine bay
        </p>
      )
    default:
      return assertNever(kind)
  }
}

export function Chapters() {
  return (
    <>
      <Interstitial
        kicker="Gate"
        title="Energy"
        line="A hold, then a push. The camera is the flight plan."
      />
      <ChapterBlock
        id="ascent"
        index="01"
        title={CHAPTERS[0].title}
        body={CHAPTERS[0].body}
        aside={asideFor('ascent')}
      />
      <Interstitial
        kicker="Coast"
        title="Guidance lock"
        line="Orbit is a close-up: fins, raceway, the parts that make reuse possible."
      />
      <ChapterBlock
        id="precision"
        index="02"
        title={CHAPTERS[1].title}
        body={CHAPTERS[1].body}
        aside={asideFor('precision')}
      />
      <Interstitial
        kicker="Return"
        title="Second flight"
        line="The vehicle comes back into frame. Legs, grid, horizon."
      />
      <ChapterBlock
        id="reuse"
        index="03"
        title={CHAPTERS[2].title}
        body={CHAPTERS[2].body}
        aside={asideFor('reuse')}
      />
    </>
  )
}

function Interstitial({
  kicker,
  title,
  line,
}: {
  kicker: string
  title: string
  line: string
}) {
  return (
    <section className="relative flex min-h-[58svh] items-end px-5 py-16 md:px-10">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        className="max-w-xl"
      >
        <p className="type-kicker">{kicker}</p>
        <h2 className="mt-3 font-display text-5xl font-semibold tracking-tight md:text-7xl">
          <SplitText text={title} inView colorClass="text-frost/90" />
        </h2>
        <p className="mt-4 max-w-md text-sm text-steel">{line}</p>
      </motion.div>
    </section>
  )
}

function asideFor(id: ChapterId): ChapterAsideKind {
  switch (id) {
    case 'ascent':
      return 'engines'
    case 'precision':
      return 'telemetry'
    case 'reuse':
      return 'reuse'
    default: {
      const _exhaustive: never = id
      return assertNever(_exhaustive)
    }
  }
}
