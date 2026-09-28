import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const deploymentOrigin = process.env.DEPLOYMENT_ORIGIN?.replace(/\/+$/, "");
const displayName = process.env.DEPLOYMENT_DISPLAY_NAME ?? "Foley Works";
const providerName = process.env.PROVIDER_NAME ?? "Foley Works";

if (!deploymentOrigin) {
  throw new Error("DEPLOYMENT_ORIGIN is required to generate Office manifests.");
}

const originUrl = new URL(deploymentOrigin);
if (originUrl.protocol !== "https:") {
  throw new Error("DEPLOYMENT_ORIGIN must use HTTPS for Office manifests.");
}
if (
  originUrl.origin !== deploymentOrigin ||
  originUrl.pathname !== "/" ||
  originUrl.search ||
  originUrl.hash
) {
  throw new Error("DEPLOYMENT_ORIGIN must be an origin without a path, query, or fragment.");
}

function xmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

const manifestTargets = [
  { name: "word", id: process.env.WORD_ADDIN_ID },
  { name: "outlook", id: process.env.OUTLOOK_ADDIN_ID },
];
const outputDirectory = resolve(projectRoot, "dist/manifests");
mkdirSync(outputDirectory, { recursive: true });

for (const { name, id } of manifestTargets) {
  if (!id || !/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(id)) {
    throw new Error(`${name.toUpperCase()}_ADDIN_ID must be a valid GUID.`);
  }

  const template = readFileSync(resolve(projectRoot, `manifests/${name}.xml`), "utf8");
  const values: Record<string, string> = {
    ADDIN_ID: id,
    DEPLOYMENT_ORIGIN: deploymentOrigin,
    DEPLOYMENT_DISPLAY_NAME: displayName,
    PROVIDER_NAME: providerName,
  };
  const manifest = template.replace(/\{\{\s*([A-Z_]+)\s*\}\}/g, (_token, key: string) => {
    const value = values[key];
    if (value === undefined) throw new Error(`No value provided for manifest token ${key}.`);
    return xmlEscape(value);
  });

  if (/\{\{\s*[A-Z_]+\s*\}\}/.test(manifest)) {
    throw new Error(`Unresolved template token in manifests/${name}.xml.`);
  }

  writeFileSync(resolve(outputDirectory, `${name}.xml`), manifest);
}

console.log(`Generated Word and Outlook manifests in ${outputDirectory}`);
