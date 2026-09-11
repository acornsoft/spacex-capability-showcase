# SpaceX Capability Showcase

A public engineering capability demo built by **Acornsoft** for a SpaceX-audience pitch. It is a scroll-driven 3D brief that shows what we can design, animate, and ship — not a partnership, contract, or claim of prior SpaceX work.

Live (once GitHub Pages is enabled on `main`):  
[https://acornsoft.github.io/spacex-capability-showcase/](https://acornsoft.github.io/spacex-capability-showcase/)

## What this proves

The page is the proof. A stylized reusable vehicle (primitives only) sits in a starfield; the camera scrubs with scroll; glass HUD chapters and capability cards stay readable over the scene.

| Capability | How this site demonstrates it |
| --- | --- |
| Real-time 3D & WebGL | Custom R3F scene, primitive-built spacecraft, scroll-scrubbed camera |
| Scroll-driven storytelling | Ascent → systems → reusability → craft cards as one cinematic through-line |
| Performance-minded React | DPR clamp, limited lights, mobile star budget, geometry disposal, WebGL fallback |
| Design systems & motion | Dual-tone headline, glass surfaces, Framer Motion as punctuation |
| Production shipping | Typed Vite static build + GitHub Pages workflow from `main` / `dist` |
| Integration-ready UIs | Telemetry-style overlays that can sit on live data later |

Copy is framed as **“what Acornsoft can build.”** Floating chips are labeled as **illustrative demo metrics**, not operational or SpaceX statistics.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- React Three Fiber + `@react-three/drei`
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

One-time repo settings:

1. **Settings → Pages → Source:** GitHub Actions
2. Merge to `main` (or run the workflow manually)
3. Confirm the site at `https://acornsoft.github.io/spacex-capability-showcase/`

## Design notes

Dark aerospace palette: void blacks, cool whites, restrained cyan and amber. Desktop-first motion; star count and antialiasing step down on coarse pointers. If WebGL is missing, the same brief renders as a static document.
