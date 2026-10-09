import express, { Request, Response } from 'express';
import { collectDefaultMetrics, register } from 'prom-client';

export function createApp() {
  const app = express();

  collectDefaultMetrics()

  app.get('/ping', (_req: Request, res: Response) => {
    res.json({ status: 'pong' });
  });

  app.get('/metrics', async ( req: Request, res: Response) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  })

  return app;
}
