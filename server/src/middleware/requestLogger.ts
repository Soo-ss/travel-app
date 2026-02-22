import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

function getRequestIp(req: Request) {
  return req.ip || req.socket.remoteAddress || "unknown";
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const { method, originalUrl } = req;
  const requestIp = getRequestIp(req);

  res.on("finish", () => {
    const durationMs = Date.now() - start;
    logger.info("HTTP request completed", {
      method,
      url: originalUrl,
      statusCode: res.statusCode,
      durationMs,
      ip: requestIp,
    });
  });

  next();
}
