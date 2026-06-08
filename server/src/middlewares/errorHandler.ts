import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ success: false, error: err.message });
  }
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; "),
    });
  }
  const message = err instanceof Error ? err.message : "Server error";
  // eslint-disable-next-line no-console
  console.error("[error]", err);
  return res.status(500).json({ success: false, error: message });
}
