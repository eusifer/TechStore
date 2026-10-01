import { Request, Response } from 'express';
import client from 'prom-client';
import { getRecentAuditLogs } from '../db/mongodb';

export async function getMetrics(req: Request, res: Response) {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err: any) {
    res.status(500).end(err.message);
  }
}

export async function getAuditLogs(req: Request, res: Response) {
  try {
    const logs = await getRecentAuditLogs(30);
    res.status(200).json(logs);
  } catch (err: any) {
    res.status(500).json({ error: true, message: err.message });
  }
}
