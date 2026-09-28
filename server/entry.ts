import cors from "cors";
import express from "express";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { z } from "zod";
import { createContext } from "./trpc/context";
import { appRouter } from "./trpc/router";
import { UsptoService } from "./services/usptoService";

const app = express();
app.use(cors());
app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/trpc/downloads", async (req, res) => {
  const input = z
    .object({
      applicationId: z.string().regex(/^\d{8}$/),
      documentIdentifier: z.string().min(1).max(200),
      mimeType: z.enum(["PDF", "MS_WORD", "XML", "PNG"]),
    })
    .safeParse(req.query);
  if (!input.success) {
    res.status(400).json({ error: "Invalid document download request." });
    return;
  }

  try {
    const { applicationId, documentIdentifier, mimeType } = input.data;
    const file = await UsptoService.getFileHistoryDocument(
      applicationId,
      documentIdentifier,
      mimeType,
    );
    const extension = { PDF: "pdf", MS_WORD: "docx", XML: "xml", PNG: "png" }[mimeType];
    const safeDate = file.officialDate.replace(/[^a-zA-Z0-9-]/g, "_") || "undated";
    const safeCode = file.documentCode.replace(/[^a-zA-Z0-9-]/g, "_") || "document";
    res.setHeader(
      "Content-Type",
      file.response.headers.get("content-type") ?? "application/octet-stream",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${applicationId}_${safeDate}_${safeCode}.${extension}"`,
    );
    res.setHeader("X-Content-Type-Options", "nosniff");
    if (!file.response.body) {
      res.status(502).json({ error: "USPTO ODP returned an empty document." });
      return;
    }
    await pipeline(Readable.from(file.response.body as unknown as AsyncIterable<Uint8Array>), res);
  } catch (error) {
    if (res.headersSent) {
      res.destroy(error instanceof Error ? error : undefined);
      return;
    }
    res.status(502).json({
      error: error instanceof Error ? error.message : "Unable to download the USPTO document.",
    });
  }
});
app.use("/trpc", createExpressMiddleware({ router: appRouter, createContext }));

const port = Number(process.env.PORT ?? 8787);
app.listen(port, "127.0.0.1", () => {
  console.log(`Foley Works API listening on http://127.0.0.1:${port}`);
});
