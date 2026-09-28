import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import type { Context } from "../context";
import { patentHandlers } from "../../handlers/patentHandlers";

const t = initTRPC.context<Context>().create();
const searchInput = z
  .object({
    key: z.enum(["applicationId", "patentId", "publicationId"]),
    value: z.string().regex(/^\d+$/),
  })
  .superRefine(({ key, value }, context) => {
    const validLength =
      key === "applicationId"
        ? value.length === 8
        : key === "patentId"
          ? value.length === 7 || value.length === 8
          : value.length === 11;
    if (!validLength) {
      context.addIssue({
        code: "custom",
        message: `Invalid ${key} number length.`,
        path: ["value"],
      });
    }
  });
export const patentsRouter = t.router({
  getApplication: t.procedure.input(searchInput).query(async ({ input }) => {
    try {
      return await patentHandlers.getApplication(input);
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: error instanceof Error ? error.message : "Unable to load USPTO application.",
      });
    }
  }),
  getFileHistory: t.procedure
    .input(z.object({ applicationId: z.string().regex(/^\d{8}$/) }))
    .query(async ({ input }) => {
      try {
        return await patentHandlers.getFileHistory(input);
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Unable to load USPTO file history.",
        });
      }
    }),
  getFullText: t.procedure
    .input(z.object({ applicationId: z.string().regex(/^\d{8}$/) }))
    .query(async ({ input }) => {
      try {
        return await patentHandlers.getFullText(input);
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Unable to load USPTO document.",
        });
      }
    }),
});
