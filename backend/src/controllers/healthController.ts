import { Request, Response } from 'express';
import { getPgStatus } from '../db/postgres';
import { getMongoStatus } from '../db/mongodb';

export function getHealth(req: Request, res: Response) {
  res.status(200).json({
    status: 'ok',
    service: 'techstore-api',
    postgres: getPgStatus() ? 'connected' : 'memory-fallback',
    mongodb: getMongoStatus() ? 'connected' : 'memory-fallback',
    timestamp: new Date().toISOString()
  });
}
