/**
 * Backend Beat The Chat
 * Point d'entrée principal
 */

import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware basique
app.use(express.json());

// Route de santé pour vérifier que le serveur fonctionne
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'Beat The Chat Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Route racine
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: '🎮 Beat The Chat - Backend API',
    version: '0.0.1',
    endpoints: {
      health: '/health'
    }
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log('🎮 Beat The Chat - Backend');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});

// TODO: Setup Twitch auth (plus tard)
// TODO: Setup Twitch chat connection (plus tard)
// TODO: Setup WebSocket server (plus tard)

