import type { PatentRepoKeys } from "./UsptoTypes";

export type PatentSearchResult = { key: PatentRepoKeys; value: string };

export function parsePatentSearch(value: string): PatentSearchResult | null {
  const normalized = value.replace(/[^a-z\d]/gi, "");
  const match = /^([a-z]{0,2})(\d+)([a-z]\w*)?$/i.exec(normalized);
  if (!match) return null;

  const [, prefix, documentNumber, kindCode] = match;
  if (prefix && prefix.toUpperCase() !== "US") return null;

  if (!prefix && !kindCode && documentNumber.length === 8) {
    return { key: "applicationId", value: documentNumber };
  }
  if (
    documentNumber.length === 7 ||
    (documentNumber.length === 8 && (prefix.toUpperCase() === "US" || kindCode !== undefined))
  ) {
    return { key: "patentId", value: documentNumber };
  }
  if (documentNumber.length === 11) {
    return { key: "publicationId", value: documentNumber };
  }
  return null;
}

export function patentSearchLabel(key?: PatentRepoKeys): string {
  switch (key) {
    case "applicationId":
      return "Application number";
    case "patentId":
      return "Patent number";
    case "publicationId":
      return "Publication number";
    default:
      return "Document number";
  }
}
