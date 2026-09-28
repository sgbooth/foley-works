# Foley Works

A lightweight starting point for patent application work, with a customizable welcome page and patent identifier search.

## Run

```sh
npm install
npx office-addin-dev-certs install
npm run manifests:generate
npm run dev
```

The tracked root `.env` contains shared, non-secret configuration. Put private credentials and machine-specific overrides in ignored local env files; the API server loads `.env.local` plus development-mode env files, while the manifest generator loads `.env.local`. Run `npm run dev` to start both the API and Vite development servers. The Vite app serves the web workspace at `https://localhost:5173`, the Word task pane at `/word`, and the Outlook task pane at `/outlook`. The Office dev certificate command installs a trusted localhost certificate required by Office. The typed tRPC API runs at `http://127.0.0.1:8787` behind Vite's `/trpc` proxy. `npm run build` creates one app bundle from the shared Vite config. The web app is a Dockview workspace with a Welcome panel and a global search button in the upper-left panel header. A search opens an `ApplicationDataPanel` tab with USPTO metadata and file history. `USPTO_ODP_URL` is set to the public ODP endpoint in `.env`; put `USPTO_ODP_KEY` in `.env.local` or `.env.development.local` to enable live lookups.

## Build targets

- `npm run build` — typecheck and build the web, Word (`/word`), and Outlook (`/outlook`) pages with the shared Vite config.
- `npm run manifests:generate` — substitute the manifest template tokens from `.env` and `.env.local` and write sideloadable manifests to `dist/manifests/`. This creates the files; it does not install them in Office.
- `npm run sideload:word` — generate and sideload the Word manifest into desktop Word on macOS or Windows. Keep the Vite server running; this command opens Word and registers the add-in.
- `npm run unsideload:word` — remove the Word development registration when you are done.
- `npm run sideload:outlook` — generate and sideload the Outlook manifest into desktop Outlook on macOS or Windows. Keep the Vite server running; Outlook add-ins are registered to the signed-in mailbox.
- `npm run unsideload:outlook` — remove the Outlook development registration when you are done.
- `npm run tauri:dev` — optional Tauri demo; its `beforeDevCommand` starts Vite at port 5173.

The single manifest templates live at `manifests/word.xml` and `manifests/outlook.xml`. Each adds an Office ribbon button that opens its task pane. Set `DEPLOYMENT_ORIGIN`, `WORD_ADDIN_ID`, and `OUTLOOK_ADDIN_ID` for each environment before generation. The `VITE_APP_NAME` and `VITE_API_URL` variables are exposed to the browser bundle; only put public values in `VITE_` variables. Vite serves files from `public/` at the site root in development and copies them into the build output, including the ribbon icons and Office command page. The Office adapters live under `app/wordAddin` and `app/outlookAddin`.

### Sideload Word for development

1. Run `npm run dev` and leave it running. The generated Word manifest points to `https://localhost:5173/word`.
2. Run `npm run sideload:word`. It generates the manifest and registers it with desktop Word using Microsoft's Office add-in debugging tool. Windows registration uses the Office development registration; macOS registration uses Word's sideload folder.
3. If Word was already open, restart it. Open a document and find Foley Works under **Home → Add-ins** or in the Home ribbon's Foley Works group.
4. When finished, run `npm run unsideload:word` to remove the development registration.

### Sideload Outlook for development

1. Run `npm run dev` and leave it running. The generated Outlook manifest points to `https://localhost:5173/outlook`.
2. Run `npm run sideload:outlook`. It generates the manifest and registers it with desktop Outlook on macOS or Windows using Microsoft's Office add-in debugging tool.
3. If Outlook was already open, restart it. The add-in is associated with the signed-in mailbox; availability in other supported Outlook clients follows that mailbox registration.
4. When finished, run `npm run unsideload:outlook` to remove the development registration.

## Architecture

Shared UI, USPTO data types, and pure identifier parsing live in `app/`. Feature APIs own application calls; `app/rpc/client.ts` is the only transport setup. Server input validation is in `server/trpc/procedures/`, with focused implementations in `server/handlers/` and the USPTO ODP adapter in `server/services/usptoService.ts`.

Jotai state is feature-local. `app/shared/store.ts` provides independent web and Office stores. Dockview owns the live panel layout after initial placement; panel definitions and instances are kept beside the workspace feature.

Normal app requests use tRPC queries and mutations over HTTP. No persistent connection is opened. When event-driven collaboration is needed, put subscription handling behind feature APIs and evaluate tRPC subscriptions over WebSocket or SSE; do not make components depend on transport details.

## Styling and theme

Mantine provides all application components, styling, and colors. The theme is configured in `app/main.tsx`; use Mantine props or theme CSS variables for every UI color. Do not add literal color values to components or stylesheets. `app/styles.css` is reserved for the CSS reset. `app/shared/extra.css` contains Dockview-specific overrides and uses Mantine theme variables to retain the contrasting tab strip and tab surfaces.
