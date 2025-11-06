/**
 * Backend Beat The Chat
 * Point d'entrée principal
 */

import { createApp } from './app.js';

const PORT = process.env.PORT || 3000;

// Création de l'application Express
const app = createApp();

// Démarrage du serveur
app.listen(PORT, () => {
  console.log('🎮 Beat The Chat - Backend');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
});

// TODO: Setup Twitch auth (plus tard)
// TODO: Setup Twitch chat connection (plus tard)
// TODO: Setup WebSocket server (plus tard)

