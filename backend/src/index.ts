import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes';
import { metricsMiddleware } from './middleware/metricsMiddleware';
import { errorHandler } from './middleware/errorHandler';
import { initDb } from './db/postgres';
import { initMongo } from './db/mongodb';
import { getMetrics } from './controllers/metricsController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(helmet({
  contentSecurityPolicy: false
}));

const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Prometheus Metrics Middleware
app.use(metricsMiddleware);

// Direct Prometheus metrics endpoint
app.get('/metrics', getMetrics);

// API Routes
app.use('/api', apiRoutes);

// Centralized Error Handling
app.use(errorHandler);

// Start Server & Connections
async function startServer() {
  await initDb();
  await initMongo();

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 TechStore REST API server running on port ${PORT}`);
    console.log(`📡 Healthcheck: http://localhost:${PORT}/api/health`);
    console.log(`📊 Metrics:     http://localhost:${PORT}/metrics`);
    console.log(`====================================================`);
  });
}

startServer();
