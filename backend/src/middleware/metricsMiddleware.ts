import { Request, Response, NextFunction } from 'express';
import client from 'prom-client';

// Collect default metrics (CPU, memory, loop lag, etc.)
client.collectDefaultMetrics({ prefix: 'techstore_' });

export const httpRequestCounter = new client.Counter({
  name: 'techstore_http_requests_total',
  help: 'Total number of HTTP requests processed',
  labelNames: ['method', 'route', 'status_code']
});

export const httpRequestDurationHistogram = new client.Histogram({
  name: 'techstore_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5]
});

export const ordersCreatedCounter = new client.Counter({
  name: 'techstore_orders_created_total',
  help: 'Total number of successfully completed orders'
});

export const orderErrorsCounter = new client.Counter({
  name: 'techstore_order_errors_total',
  help: 'Total number of failed order creations'
});

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.path === '/metrics') {
    return next();
  }

  const start = process.hrtime();

  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;
    const route = req.route ? req.route.path : req.path;

    httpRequestCounter.inc({
      method: req.method,
      route: route || req.path,
      status_code: res.statusCode.toString()
    });

    httpRequestDurationHistogram.observe(
      {
        method: req.method,
        route: route || req.path,
        status_code: res.statusCode.toString()
      },
      durationInSeconds
    );
  });

  next();
}
