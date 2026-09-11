import { motion } from 'framer-motion'
import { CHAPTERS, TELEMETRY, type ChapterId } from '@/content'
import { assertNever } from '@/lib/scene-pose'

type ChapterAsideKind = 'telemetry' | 'reuse' | 'none'

type ChapterBlockProps = {
  id: ChapterId
  index: string
  title: string
  body: string
  aside?: ChapterAsideKind
}

function ChapterBlock({ id, index, title, body, aside = 'none' }: ChapterBlockProps) {
  return (
    <section
      id={id}
      className="relative flex min-h-[130svh] items-center px-5 py-24 md:px-10"
    >
      <motion.article
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.45 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glass max-w-lg rounded-3xl p-6 md:p-8"
      >
        <p className="type-kicker">{index}  /  Sequence</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-frost md:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">{body}</p>
        <ChapterAside kind={aside} />
      </motion.article>
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
              <dd className="mt-1 font-display text-sm text-cyan">{row.value}</dd>
            </div>
          ))}
        </dl>
      )
    case 'reuse':
      return (
        <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-amber">
          Landing legs deploy  ·  grid fades in  ·  second-flight budget
        </p>
      )
    case 'none':
      return null
    default:
      return assertNever(kind)
  }
}

export function Chapters() {
  return (
    <>
      {CHAPTERS.map((chapter) => (
        <ChapterBlock
          key={chapter.id}
          id={chapter.id}
          index={chapter.index}
          title={chapter.title}
          body={chapter.body}
          aside={asideFor(chapter.id)}
        />
      ))}
    </>
  )
}

function asideFor(id: ChapterId): ChapterAsideKind {
  switch (id) {
    case 'ascent':
      return 'none'
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
