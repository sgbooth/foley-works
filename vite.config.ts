import { resolve } from "node:path";
import { homedir } from "node:os";
import { existsSync, readFileSync } from "node:fs";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const officeEntryRoutes: Plugin = {
  name: "office-entry-routes",
  enforce: "post",
  generateBundle(_options, bundle) {
    for (const [source, destination] of [
      ["app/wordAddin/index.html", "word/index.html"],
      ["app/outlookAddin/index.html", "outlook/index.html"],
    ]) {
      const page = bundle[source];
      if (page?.type === "asset") {
        this.emitFile({
          type: "asset",
          fileName: destination,
          source: page.source,
        });
      }
    }
  },
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const route = req.url?.split("?")[0].replace(/\/$/, "");
      if (route === "/word") req.url = "/app/wordAddin/index.html";
      if (route === "/outlook") req.url = "/app/outlookAddin/index.html";
      next();
    });
  },
};

export default defineConfig(({ command }) => {
  const certDir = resolve(homedir(), ".office-addin-dev-certs");
  const certPath = resolve(certDir, "localhost.crt");
  const keyPath = resolve(certDir, "localhost.key");
  const hasDevCert = existsSync(certPath) && existsSync(keyPath);

  if (command === "serve" && !hasDevCert) {
    throw new Error(
      "Local Office HTTPS certificates are missing. Run `npx office-addin-dev-certs install` and restart Vite.",
    );
  }

  return {
    plugins: [react(), officeEntryRoutes],
    publicDir: resolve(process.cwd(), "public"),
    server: {
      host: "127.0.0.1",
      port: 5173,
      https: hasDevCert ? { cert: readFileSync(certPath), key: readFileSync(keyPath) } : undefined,
      proxy: { "/trpc": "http://127.0.0.1:8787" },
    },
    build: {
      outDir: "dist/web",
      rolldownOptions: {
        input: {
          index: resolve(process.cwd(), "index.html"),
          "word/index": resolve(process.cwd(), "app/wordAddin/index.html"),
          "outlook/index": resolve(process.cwd(), "app/outlookAddin/index.html"),
        },
      },
    },
  };
});
