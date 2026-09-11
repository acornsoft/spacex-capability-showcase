import { CAPABILITIES, CHAPTERS, CONTACT, HERO, SITE } from '@/content'

export function Fallback() {
  return (
    <div className="relative min-h-svh bg-void text-frost">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#16343a_0%,transparent_42%),radial-gradient(circle_at_20%_80%,#1a2a18_0%,transparent_36%)]" />
      <main className="relative mx-auto max-w-3xl px-5 py-20">
        <p className="type-kicker">{HERO.kicker}</p>
        <h1 className="mt-4 font-display text-5xl font-semibold">
          <span className="block">{HERO.lineOne}</span>
          <span className="mt-1 block text-cyan">{HERO.lineTwo}</span>
        </h1>
        <p className="mt-6 text-lg text-mist">{HERO.lede}</p>
        <p className="mt-4 font-mono text-xs text-amber">
          WebGL is unavailable in this browser. The 3D sequence is skipped; the
          brief still stands.
        </p>

        {CHAPTERS.map((chapter) => (
          <section key={chapter.id} className="glass mt-10 rounded-3xl p-6">
            <p className="type-kicker">{chapter.index}</p>
            <h2 className="mt-2 font-display text-2xl">{chapter.title}</h2>
            <p className="mt-3 text-mist">{chapter.body}</p>
          </section>
        ))}

        <section className="mt-12 grid gap-4">
          {CAPABILITIES.map((card) => (
            <article key={card.id} className="glass rounded-3xl p-6">
              <p className="font-mono text-[0.62rem] text-cyan">{card.index}</p>
              <h3 className="mt-2 font-display text-xl">{card.title}</h3>
              <p className="mt-2 text-sm text-mist">{card.body}</p>
            </article>
          ))}
        </section>

        <section className="glass mt-12 rounded-3xl p-8">
          <h2 className="font-display text-3xl">{CONTACT.title}</h2>
          <p className="mt-3 text-mist">{CONTACT.body}</p>
          <a href={SITE.mailto} className="mt-6 inline-block text-cyan">
            {SITE.email}
          </a>
          <p className="mt-6 font-mono text-[0.62rem] text-steel">{SITE.disclaimer}</p>
        </section>
      </main>
    </div>
  )
}
