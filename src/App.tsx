import { useScroll } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { useCoarsePointer, useReducedMotion, useWebGLSupport } from '@/hooks/useRuntimeFlags'
import { DirectorProvider } from '@/lib/director'
import { starBudget } from '@/lib/runtime'
import { Capabilities } from '@/ui/Capabilities'
import { Chapters } from '@/ui/Chapters'
import { Contact, Footer } from '@/ui/Contact'
import { Fallback } from '@/ui/Fallback'
import { Hero } from '@/ui/Hero'
import { Nav, SequenceRail } from '@/ui/Nav'
import { PartCallouts } from '@/ui/PartCallouts'

const Experience = lazy(() => import('@/scene/Experience'))

export default function App() {
  const { scrollYProgress } = useScroll()
  const isCoarse = useCoarsePointer()
  const reducedMotion = useReducedMotion()
  const hasWebGL = useWebGLSupport()

  if (!hasWebGL) {
    return <Fallback />
  }

  return (
    <DirectorProvider progress={scrollYProgress}>
      <div className="relative bg-void text-frost">
        <a
          href="#hero"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-frost focus:px-3 focus:py-2 focus:text-void"
        >
          Skip to content
        </a>

        <div className="fixed inset-0 z-0">
          <Suspense fallback={null}>
            <Experience
              progress={scrollYProgress}
              starCount={starBudget(isCoarse)}
              isCoarse={isCoarse}
              reducedMotion={reducedMotion}
            />
          </Suspense>
          <div className="vignette pointer-events-none absolute inset-0" />
        </div>

        <PartCallouts />
        <SequenceRail />

        <div className="pointer-events-none relative z-10">
          <Nav />
          <main>
            <Hero isCoarse={isCoarse} />
            <Chapters />
            <Capabilities />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
    </DirectorProvider>
  )
}
