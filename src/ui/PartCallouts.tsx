import { useDirector } from '@/lib/director'
import { useScreenMarks } from '@/lib/marks'

export function PartCallouts() {
  const marks = useScreenMarks()
  const { effectiveFocus } = useDirector()

  return (
    <div className="pointer-events-none fixed inset-0 z-20 hidden md:block">
      {marks.map((mark) => {
        const active = mark.visible && mark.id === effectiveFocus
        return (
          <div
            key={mark.id}
            className="absolute -translate-y-1/2"
            style={{
              left: mark.x + 18,
              top: mark.y,
              opacity: active ? 1 : 0,
              transform: `translateY(-50%) translateX(${active ? 0 : 8}px)`,
              transition: 'opacity 220ms ease, transform 220ms ease',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-cyan" />
              <span className="glass rounded-full px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-cyan ring-1 ring-cyan/30">
                {mark.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
