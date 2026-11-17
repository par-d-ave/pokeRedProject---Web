import path from 'node:path';
import express from 'express';
import { healthRouter } from './routes/health';
import { pagesRouter } from './routes/pages';
import { notFound } from './middleware/not-found';
import { errorHandler } from './middleware/error-handler';

const ROOT = path.resolve(__dirname, '..');

export function createApp() {
  const app = express();
  app.disable('x-powered-by');

  app.set('view engine', 'ejs');
  app.set('views', path.join(ROOT, 'views'));

  app.use(express.static(path.join(ROOT, 'public')));
  app.use(healthRouter);
  app.use(pagesRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}