import { Router } from 'express';
import { improvements } from '../data/improvements';

export const pagesRouter = Router();

pagesRouter.get('/', (_req, res) => {
  res.render('pages/landing', {
    title: 'PokeRed QoL',
    improvements,
    withCopyScript: false,
  });
});

pagesRouter.get('/implementacion', (_req, res) => {
  res.render('pages/implementacion', {
    title: 'Implementación',
    improvements,
    withCopyScript: true,
  });
});