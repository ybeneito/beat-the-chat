/**
 * Backend Beat The Chat
 * Point d'entrée principal
 */

// Charger les variables d'environnement depuis .env
import 'dotenv/config';

import { createApp } from './app.js';
import { chatService } from './services/chat.service.js';

const PORT = process.env.PORT || 3000;
const TWITCH_CHANNEL = process.env.TWITCH_CHANNEL || 'wazz34';

// Création de l'application Express
const app = createApp();

// Démarrage du serveur
app.listen(PORT, async () => {
  console.log('🎮 Beat The Chat - Backend');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  
  // Connexion au chat Twitch (non-bloquant pour le démarrage du serveur)
  // Le serveur démarre même si le chat échoue (important pour Render health check)
  if (process.env.TWITCH_ACCESS_TOKEN && process.env.TWITCH_CLIENT_ID) {
    chatService.connect(TWITCH_CHANNEL).catch((error) => {
      console.error('❌ Erreur lors de la connexion au chat:', error);
      console.log('⚠️ Le serveur continue de fonctionner sans connexion chat');
    });
  } else {
    console.log('⚠️ Variables Twitch non configurées, connexion chat désactivée');
  }
});

// Gestion propre de la déconnexion
process.on('SIGINT', async () => {
  console.log('🛑 Arrêt du serveur...');
  await chatService.disconnect();
  process.exit(0);
});

