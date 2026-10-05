import express, { Request, Response } from 'express';

export function createApp() {
  const app = express();

  app.get('/ping', (_req: Request, res: Response) => {
    res.json({ status: 'pong' });
  });

  return app;
}
