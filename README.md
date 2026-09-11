# SpaceX Capability Showcase

A public engineering capability demo built by **Acornsoft** for a SpaceX-audience pitch. It is a scroll-driven 3D brief that shows what we can design, animate, and ship — not a partnership, contract, or claim of prior SpaceX work.

Live: [https://acornsoft.github.io/spacex-capability-showcase/](https://acornsoft.github.io/spacex-capability-showcase/)

## v2 craft

v1 proved the stack. v2 is a cinematic 3D pass **plus** UI craft aimed at the refs David locked with Kyle — not a generic Apple/Linear/Stripe clone.

**3D:** authored shots, PBR vehicle, adaptive bloom (unchanged direction).

**UI / motion (this pass):** expensive glass, micro-interactions, dense shippable blocks.

| Ref | What we took |
| --- | --- |
| [Spectrum UI](https://ui.spectrumhq.in) | Spotlight + 3D tilt cards, number tickers, live status pill, beam-border cards |
| [React Bits](https://reactbits.dev) | Split-text blur-in, magnetic metric chips, hover glare |
| [21st.dev](https://21st.dev) | Shimmer CTAs, morphing nav pill |
| [shadcnblocks](https://www.shadcnblocks.com) | Dense capability blocks, announcement pill, shippable card density |
| [evilcharts](https://evilcharts.com) | Animated telemetry sparklines on the systems beat |
| [ui.shadcn.com](https://ui.shadcn.com) / Layers / DesignMD | Tokenized glass, calm layout under risky motion |

Skipped: retro 8-bit, cute video aesthetics. Dual-tone **Good Design. Dangerous Motion.** stays the hook.

## What this proves

| Capability | How this site demonstrates it |
| --- | --- |
| Real-time 3D & WebGL | Custom R3F scene, primitive-built spacecraft, postprocessed PBR |
| Scroll-driven storytelling | Authored camera beats with interstitial atmosphere, not a card stack |
| Performance-minded React | Adaptive quality, mobile star budget, bloom budget, WebGL fallback |
| Design systems & motion | Dual-tone headline, glass HUD, magnetic chips, part callouts |
| Production shipping | Typed Vite static build + GitHub Pages workflow from `main` / `dist` |
| Integration-ready UIs | Telemetry overlays and focus states that can sit on live data later |

Copy is framed as **“what Acornsoft can build.”** Floating chips are **illustrative demo metrics**, not operational or SpaceX statistics.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- React Three Fiber + `@react-three/drei` + `@react-three/postprocessing`
- Framer Motion
- Static `base` set to `/spacex-capability-showcase/` for GitHub Pages

## Run locally

```bash
npm install
npm run dev
```

Open the printed local URL (Vite defaults to `http://localhost:5173/spacex-capability-showcase/`).

```bash
npm run build
npm run preview
```

`npm run build` typechecks (`tsc -b`) then emits `dist/`.

## GitHub Pages

A workflow at `.github/workflows/deploy-pages.yml` builds on every push to `main` and deploys the `dist` artifact with `actions/deploy-pages`.

After merge to `main`, the live site refreshes at `https://acornsoft.github.io/spacex-capability-showcase/`.

## Design notes

Dark aerospace palette: void blacks, cool whites, restrained cyan and amber. Desktop-first motion; star count, antialiasing, and bloom step down on coarse pointers or when the frame budget slips. If WebGL is missing, the same brief renders as a static document.
