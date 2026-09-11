export const SITE = {
  builder: 'Acornsoft',
  email: 'hello@acornsoft.ai',
  mailto: 'mailto:hello@acornsoft.ai',
  pagesUrl: 'https://acornsoft.github.io/spacex-capability-showcase/',
  disclaimer:
    'Engineering capability showcase inspired by aerospace craft. Not a SpaceX partnership, contract, or official property.',
} as const

export const NAV_LINKS = [
  { id: 'ascent', label: 'Ascent' },
  { id: 'precision', label: 'Systems' },
  { id: 'reuse', label: 'Reuse' },
  { id: 'craft', label: 'Craft' },
  { id: 'contact', label: 'Contact' },
] as const

export type NavId = (typeof NAV_LINKS)[number]['id']

export const HERO = {
  kicker: 'Capability brief  ·  Acornsoft',
  lineOne: 'Good Design.',
  lineTwo: 'Dangerous Motion.',
  lede: 'A public 3D brief for a SpaceX-audience pitch. What Acornsoft can build when an interface has to feel like flight hardware — not a claim of prior work or partnership.',
  cta: 'Begin the sequence',
  ctaHref: '#ascent',
} as const

export const CHAPTERS = [
  {
    id: 'ascent',
    index: '01',
    title: 'Ascent energy',
    body: 'Ignition is a timing problem dressed as spectacle. We treat motion the same way: energy with a flight plan. Scroll is the throttle. The vehicle is the interface.',
  },
  {
    id: 'precision',
    index: '02',
    title: 'Precision systems',
    body: 'Telemetry is not decoration. Glass overlays, constrained type, and live-feeling readouts show how Acornsoft builds operator UIs — readable at speed, calm under load.',
  },
  {
    id: 'reuse',
    index: '03',
    title: 'Reusability',
    body: 'The impressive part is not leaving. It is coming back intact. We design for the second flight: performance budgets, disposable geometries, and motion that still lands on mid-range hardware.',
  },
] as const

export type ChapterId = (typeof CHAPTERS)[number]['id']

export const CAPABILITIES = [
  {
    id: 'webgl',
    index: '01',
    title: 'Real-time 3D & WebGL',
    body: 'A custom scene, a vehicle built from primitives, and a camera that scrubs with the page — no stock hero reel, no oversized assets.',
  },
  {
    id: 'scroll',
    index: '02',
    title: 'Scroll-driven storytelling',
    body: 'Chapters lock to one cinematic through-line. Depth, not a carousel. The narrative is the motion system.',
  },
  {
    id: 'perf',
    index: '03',
    title: 'Performance-minded React',
    body: 'DPR clamp, limited lights, mobile particle budgets, geometry disposal, and a WebGL fallback that still ships the brief.',
  },
  {
    id: 'design',
    index: '04',
    title: 'Design systems & motion',
    body: 'Dual-tone headline, glass surfaces, and Framer Motion used as punctuation — bold on purpose, never noisy.',
  },
  {
    id: 'ship',
    index: '05',
    title: 'Production shipping',
    body: 'Typed Vite app, static-build friendly, GitHub Pages workflow from main. Craft that can leave the laptop.',
  },
  {
    id: 'integrate',
    index: '06',
    title: 'Integration-ready UIs',
    body: 'HUD patterns that can sit on live telemetry the moment an API exists. This overlay is a dress rehearsal for operations software.',
  },
] as const

export type CapabilityId = (typeof CAPABILITIES)[number]['id']

export const METRICS = [
  { id: 'frame', label: 'Frame budget', value: '16.6', unit: 'ms', anchor: { x: 18, y: 22 } },
  { id: 'draw', label: 'Draw calls', value: '1.2', unit: 'k', anchor: { x: 78, y: 18 } },
  { id: 'dpr', label: 'DPR clamp', value: '1.75', unit: '×', anchor: { x: 82, y: 54 } },
  { id: 'stars', label: 'Star budget', value: '3.2', unit: 'k', anchor: { x: 14, y: 58 } },
  { id: 'reuse', label: 'Reuse cycle', value: '01', unit: '', anchor: { x: 72, y: 78 } },
] as const

export const TELEMETRY = [
  { key: 'ATT', label: 'Attitude lock', value: 'NOMINAL' },
  { key: 'GNC', label: 'Guidance loop', value: '12 ms' },
  { key: 'THL', label: 'Throttle map', value: 'SCRUB' },
  { key: 'BUS', label: 'Render bus', value: 'R3F' },
] as const

export const CONTACT = {
  kicker: 'Close the loop',
  title: 'Built by Acornsoft',
  body: 'If this is the standard you want on an internal tool, a public reveal, or a mission-adjacent interface — start the conversation.',
  cta: 'hello@acornsoft.ai',
} as const
