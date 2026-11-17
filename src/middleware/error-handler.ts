import type { NextFunction, Request, Response } from 'express';
import { config } from '../config';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error(err);
  const stack = err instanceof Error ? err.stack : String(err);
  res.status(500).render('pages/error', {
    title: 'Error del servidor',
    withCopyScript: false,
    stack: config.nodeEnv === 'production' ? undefined : stack,
  });
}