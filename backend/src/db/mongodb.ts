import mongoose from 'mongoose';
import { AuditEvent } from '../types';

let isMongoConnected = false;

const auditSchema = new mongoose.Schema({
  event: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: Object, default: {} }
});

const AuditModel = mongoose.model('AuditEvent', auditSchema);

export const getMongoStatus = () => isMongoConnected;

export async function initMongo(): Promise<void> {
  const mongoUri = process.env.MONGO_URI || 'mongodb://root:mongopass@localhost:27017/techstore_audit?authSource=admin';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('MongoDB audit connection established successfully.');
    isMongoConnected = true;
  } catch (err: any) {
    console.warn(`MongoDB connection notice (${err.message}). Audit events will be logged to stdout/memory.`);
    isMongoConnected = false;
  }
}

export async function logAuditEvent(event: 'PRODUCT_VIEWED' | 'ORDER_CREATED' | 'ORDER_FAILED', metadata: Record<string, any>): Promise<void> {
  const logEntry = {
    event,
    timestamp: new Date(),
    metadata
  };

  console.log(`[AUDIT EVENT] [${logEntry.event}]`, JSON.stringify(logEntry.metadata));

  if (isMongoConnected) {
    try {
      await AuditModel.create(logEntry);
    } catch (err) {
      console.error('Failed to persist audit log to MongoDB:', err);
    }
  }
}

export async function getRecentAuditLogs(limit: number = 20) {
  if (isMongoConnected) {
    try {
      return await AuditModel.find().sort({ timestamp: -1 }).limit(limit);
    } catch (err) {
      console.error('Failed to fetch audit logs from MongoDB:', err);
    }
  }
  return [];
}
