import type { Request, Response } from 'express';

export function notFound(_req: Request, res: Response): void {
  res.status(404).render('pages/not-found', {
    title: 'No encontrado',
    withCopyScript: false,
  });
}