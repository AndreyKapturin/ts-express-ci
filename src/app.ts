import express, { NextFunction, Request, Response } from 'express';
import { collectDefaultMetrics, Counter, Histogram, register } from 'prom-client';

const httpRequestDuration = new Histogram({
  name: 'http_response_time_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});

const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const metricsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const end = httpRequestDuration.startTimer();

  res.on('finish', () => {
    const route = req.path as string;
    if (route.endsWith('/metrics')) return;

    end({
      method: req.method,
      route,
      status_code: res.statusCode,
    });
    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode,
    });
  });

  next();
};

export function createApp() {
  const app = express();

  collectDefaultMetrics();

  app.use(metricsMiddleware);

  app.get('/ping', (_req: Request, res: Response) => {
    res.json({ status: 'pong' });
  });

  app.get('/metrics', async (req: Request, res: Response) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });

  return app;
}
