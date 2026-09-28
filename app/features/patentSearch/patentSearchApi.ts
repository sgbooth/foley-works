import { trpcClient } from "../../rpc/client";
import type { FileHistoryEvent, PatentApplicationData } from "../../domain/UsptoTypes";
import type { PatentSearchResult } from "../../domain/patentSearch";

export async function getPatentApplication(
  search: PatentSearchResult,
): Promise<PatentApplicationData> {
  return trpcClient.patents.getApplication.query(search);
}

export async function getPatentFileHistory(applicationId: string): Promise<FileHistoryEvent[]> {
  return trpcClient.patents.getFileHistory.query({ applicationId });
}

export async function getPatentFullText(applicationId: string) {
  return trpcClient.patents.getFullText.query({ applicationId });
}
