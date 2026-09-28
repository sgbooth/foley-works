import type {
  FileHistoryBag,
  FileHistoryEvent,
  OdpMimeType,
  PatentApplicationData,
  PatentFileWrapperResponse,
} from "../../app/domain/UsptoTypes";
import type { PatentSearchResult } from "../../app/domain/patentSearch";

const defaultApplicationsUrl = "https://api.uspto.gov/api/v1/patent/applications";
const retryableStatuses = new Set([429, 500, 502, 503, 504]);

function settings() {
  const applicationsUrl = (process.env.USPTO_ODP_URL || defaultApplicationsUrl).replace(/\/+$/, "");
  const apiKey = process.env.USPTO_ODP_KEY;

  if (!apiKey) {
    throw new Error("Set USPTO_ODP_KEY in .env.local to enable USPTO lookups.");
  }

  return { applicationsUrl, apiKey };
}

function headers(apiKey: string): HeadersInit {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-API-KEY": apiKey,
  };
}

const sleep = (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds));

async function request(url: string, init: RequestInit): Promise<Response> {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    let response: Response;
    try {
      response = await fetch(url, { ...init, signal: AbortSignal.timeout(30_000) });
    } catch (error) {
      if (attempt === 3) {
        throw new Error(
          `Unable to reach USPTO ODP: ${error instanceof Error ? error.message : "network error"}`,
        );
      }
      await sleep(300 * 2 ** attempt);
      continue;
    }

    if (response.ok) return response;
    if (retryableStatuses.has(response.status) && attempt < 3) {
      const retryAfter = Number(response.headers.get("retry-after"));
      await response.body?.cancel();
      await sleep(
        Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 300 * 2 ** attempt,
      );
      continue;
    }

    const detail = (await response.text()).trim().slice(0, 240);
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        `USPTO ODP rejected the request (${response.status}). ` +
          `Verify USPTO_ODP_KEY is current and has access through a registered USPTO.gov account${detail ? `: ${detail}` : "."}`,
      );
    }
    throw new Error(`USPTO ODP returned ${response.status}${detail ? `: ${detail}` : ""}.`);
  }

  throw new Error("USPTO ODP request failed after multiple attempts.");
}

async function requestJson<T>(url: string, init: RequestInit): Promise<T> {
  const response = await request(url, init);
  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("USPTO ODP returned an invalid JSON response.");
  }
}

function isExpectedNumberLength(key: PatentSearchResult["key"], length: number): boolean {
  if (key === "applicationId") return length === 8;
  if (key === "patentId") return length === 7 || length === 8;
  return length === 11;
}

async function findApplicationNumber(search: PatentSearchResult, apiKey: string): Promise<string> {
  const digits = search.value.replace(/\D/g, "");
  if (!isExpectedNumberLength(search.key, digits.length)) {
    throw new Error(`Invalid ${search.key} number.`);
  }
  if (search.key === "applicationId") return digits;

  const query =
    search.key === "patentId"
      ? `applicationMetaData.patentNumber:${digits}`
      : `applicationMetaData.earliestPublicationNumber:*${digits}*`;
  const result = await requestJson<PatentFileWrapperResponse>(
    `${settings().applicationsUrl}/search`,
    {
      method: "POST",
      headers: headers(apiKey),
      body: JSON.stringify({
        q: query,
        fields: ["applicationNumberText"],
      }),
    },
  );
  const applicationNumber = result.patentFileWrapperDataBag?.[0]?.applicationNumberText;
  if (!applicationNumber) {
    throw new Error(
      `No USPTO application matched that ${search.key.replace("Id", " number").trim()}.`,
    );
  }
  return applicationNumber.replace(/\D/g, "");
}

export class UsptoService {
  static async getApplicationData(search: PatentSearchResult): Promise<PatentApplicationData> {
    const { applicationsUrl, apiKey } = settings();
    const applicationNumber = await findApplicationNumber(search, apiKey);
    const response = await requestJson<PatentFileWrapperResponse>(
      `${applicationsUrl}/${encodeURIComponent(applicationNumber)}`,
      { headers: headers(apiKey) },
    );
    const record = response.patentFileWrapperDataBag?.[0];
    if (!record) throw new Error("USPTO ODP returned no application data for that number.");
    return { ...record, applicationNumberText: record.applicationNumberText || applicationNumber };
  }

  static async getFileHistory(applicationId: string): Promise<FileHistoryEvent[]> {
    const { applicationsUrl, apiKey } = settings();
    const digits = applicationId.replace(/\D/g, "");
    if (digits.length !== 8) throw new Error("Invalid application number.");

    const result = await requestJson<FileHistoryBag>(
      `${applicationsUrl}/${encodeURIComponent(digits)}/documents`,
      { headers: headers(apiKey) },
    );
    if (!Array.isArray(result.documentBag)) {
      throw new Error("USPTO ODP returned an unexpected file history response.");
    }
    return (result.documentBag ?? [])
      .map(event => ({ ...event, officialDate: event.officialDate?.slice(0, 10) ?? "" }))
      .sort((left, right) => right.officialDate.localeCompare(left.officialDate));
  }

  static async getFileHistoryDocument(
    applicationId: string,
    documentIdentifier: string,
    mimeType: OdpMimeType,
  ): Promise<{ response: Response; officialDate: string; documentCode: string }> {
    const digits = applicationId.replace(/\D/g, "");
    if (digits.length !== 8) throw new Error("Invalid application number.");

    const { applicationsUrl, apiKey } = settings();
    const events = await this.getFileHistory(digits);
    const event = events.find(item => item.documentIdentifier === documentIdentifier);
    const option = event?.downloadOptionBag.find(item => item.mimeTypeIdentifier === mimeType);
    if (!option?.downloadUrl) throw new Error("USPTO ODP did not return that document download.");

    const downloadUrl = new URL(option.downloadUrl, `${applicationsUrl}/`);
    const apiHost = new URL(applicationsUrl).hostname;
    if (
      downloadUrl.protocol !== "https:" ||
      (downloadUrl.hostname !== apiHost && downloadUrl.hostname !== "api.uspto.gov")
    ) {
      throw new Error("USPTO ODP returned an untrusted document URL.");
    }

    return {
      response: await request(downloadUrl.href, {
        headers: { Accept: "*/*", "X-API-KEY": apiKey },
      }),
      officialDate: event?.officialDate ?? "",
      documentCode: event?.documentCode ?? "",
    };
  }

  static async getApplicationFullText(applicationId: string): Promise<{
    content: string;
    source: "publication" | "grant";
    filename?: string;
  }> {
    const { applicationsUrl, apiKey } = settings();
    const digits = applicationId.replace(/\D/g, "");
    if (digits.length !== 8) throw new Error("Invalid application number.");

    const record = await this.getApplicationData({ key: "applicationId", value: digits });
    const document = record.pgpubDocumentMetaData?.fileLocationURI
      ? {
          url: record.pgpubDocumentMetaData.fileLocationURI,
          source: "publication" as const,
          metadata: record.pgpubDocumentMetaData,
        }
      : record.grantDocumentMetaData?.fileLocationURI
        ? {
            url: record.grantDocumentMetaData.fileLocationURI,
            source: "grant" as const,
            metadata: record.grantDocumentMetaData,
          }
        : undefined;
    if (!document) {
      throw new Error(
        "USPTO ODP did not provide a publication or grant document for this application.",
      );
    }

    const response = await request(document.url, { headers: headers(apiKey) });
    return {
      content: await response.text(),
      source: document.source,
      filename: document.metadata.xmlFileName,
    };
  }
}
