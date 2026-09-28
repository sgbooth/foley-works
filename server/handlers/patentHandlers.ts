import type { PatentSearchResult } from "../../app/domain/patentSearch";
import { UsptoService } from "../services/usptoService";

export const patentHandlers = {
  getApplication: (input: PatentSearchResult) => UsptoService.getApplicationData(input),
  getFileHistory: (input: { applicationId: string }) =>
    UsptoService.getFileHistory(input.applicationId),
  getFullText: (input: { applicationId: string }) =>
    UsptoService.getApplicationFullText(input.applicationId),
};
