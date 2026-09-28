# Foley Works agent instructions

## Styling rule

**Mantine is the styling system for the entire application.** Prefer Mantine components and its style props/API for layout, spacing, sizing, typography, borders, and responsive behavior. Do not add another styling or component system.

**All UI colors come from the Mantine theme.** Use Mantine color props such as `c`, `bg`, and `color`, or Mantine CSS variables such as `var(--mantine-color-...)` and `var(--mantine-primary-color-...)`. Never put hex, RGB/RGBA, HSL, or named CSS color literals in components, inline styles, or stylesheets. If the palette needs a new color, define it in the Mantine theme in `app/main.tsx`, then reference its theme token everywhere.

**Hard rule: `app/styles.css` contains CSS reset rules only.** Do not put application selectors, component classes, layout rules, typography, colors, or responsive styles there. Use local component styling only for behavior Mantine cannot express (for example, a hover animation), and keep its colors theme-based. `app/shared/extra.css` is reserved for Dockview integration overrides; its colors must also use Mantine theme tokens. Preserve a clear visual distinction between Dockview's tab strip and tabs.

## Project structure

- This is one npm project. Keep product code in `app/`, Node/tRPC code in `server/`, Office host adapters in their host folders, and the optional Tauri demo under `desktop/`.
- The web app is a client-rendered React SPA built with Vite. Do not add SSR or SSG.
- Keep Word and Outlook app components separate because their workflows differ. Share generic Dockview primitives and workspace hooks, not host-specific screens or behavior. Shared UI calls feature APIs; only host adapters call Office.js.
- Keep application-specific UI, types, and API wrappers near their feature. Pure domain utilities belong in `app/domain/` and should not import UI, Node, or Office modules.

## App and state

- Use Mantine for UI components, styling, and colors; use Jotai for shared feature state. Avoid adding another component library or styling system.
- Keep atoms feature-local. Keep live handles and Office context objects out of serializable feature state.
- Use separate Jotai stores for web and Office task panes when host state must be isolated.
- Keep route/host entry points thin and put async feature orchestration in feature APIs or action atoms.

## Dockview

- Dockview owns the live drag, resize, tab, and split state after initial placement.
- Apply initial placement only when creating each panel; do not reapply the default layout on every render.
- Keep panel definitions and default placements next to the workspace that uses them. Use a generic panel renderer only to adapt registered panel components and instance props.
- Do not add pinned panels unless the product needs them; if used, remove their close affordance in the tab component as well as preventing close actions.

## API and server

- Normal app/server calls go through the tRPC client in `app/rpc/client.ts`; feature components call feature API wrappers rather than constructing transport calls.
- Validate tRPC input at the server boundary. Compose focused procedure routers in the central server router and keep implementations in `server/handlers/` or focused services.
- Keep credentials and provider SDK calls on the server. USPTO settings come from environment variables; never expose API keys to browser code.
- Use HTTP queries and mutations for now. Do not add a persistent socket or subscriptions until a feature requires them; keep future event handling behind feature APIs.

## Tooling

- Use Biome for formatting and linting. Run `npm run format` to format the project, `npm run format:check` to check formatting, `npm run typecheck` for TypeScript, and the relevant build script for a host.
- Biome does not format XML. Use the recommended Red Hat XML extension and the workspace XML formatter settings for Office manifests.
- Keep the single root package manifest and lockfile in sync when changing dependencies.
- The root `.env` is tracked shared configuration and may contain public values only. Keep secrets and machine-specific overrides in ignored `.env.local` files; never expose them with a `VITE_` prefix. Keep local certificates and signing keys out of version control.
