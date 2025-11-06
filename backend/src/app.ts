import express, { Express } from 'express';
import { router } from './routes/index.js';

export function createApp(): Express {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api', router);
  app.get('/', (req, res) => {
    res.json({
      message: '🎮 Beat The Chat - Backend API',
      version: '0.0.1',
      endpoints: {
        health: '/health',
        quiz: '/api/quiz'
      }
    });
  });
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      message: 'Beat The Chat Backend is running!',
      timestamp: new Date().toISOString()
    });
  });

  return app;
}

