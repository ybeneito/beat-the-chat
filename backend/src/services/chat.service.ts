/**
 * Service pour gérer la connexion au chat Twitch
 * Utilise @twurple/chat pour se connecter et écouter les messages
 */

import { StaticAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';

const CLIENT_ID = process.env.TWITCH_CLIENT_ID || '0ybd4eav5qo9vs4307jr14eo4npgnj';
const ACCESS_TOKEN = process.env.TWITCH_ACCESS_TOKEN || 'tfuj3jh78n0jmuqnnhp3zsi3kx84d8';

class ChatService {
  private chatClient: ChatClient | null = null;
  private isConnected = false;

  /**
   * Connecte au chat Twitch d'un channel
   * @param channel - Nom du channel (ex: "wazz34")
   */
  async connect(channel: string): Promise<void> {
    if (this.isConnected) {
      console.log('⚠️ Chat déjà connecté');

      return;
    }

    // AuthProvider avec clientId et accessToken
    const authProvider = new StaticAuthProvider(CLIENT_ID, ACCESS_TOKEN);

    // Créer le client chat
    this.chatClient = new ChatClient({
      authProvider,
      channels: [channel]
    });

    // Écouter les messages
    this.chatClient.onMessage((channel, user, message, msg) => {
      const trimmedMessage = message.trim().toUpperCase();
      
      // Détecter les réponses A, B, C, D
      if (['A', 'B', 'C', 'D'].includes(trimmedMessage)) {
        console.log(`✅ ${user} a répondu: ${trimmedMessage}`);
        // TODO: Enregistrer la réponse dans l'état de la partie
      } else {
        console.log(`💬 ${user}: ${message}`);
      }
    });

    // Events de connexion
    this.chatClient.onConnect(async () => {
      console.log(`✅ Connecté au chat Twitch: #${channel}`);
      this.isConnected = true;
      
      // Envoyer un message de bienvenue
      try {
        await this.chatClient!.say(channel, '🎮 Beat The Chat est connecté ! Prêt pour le quiz !');
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message de connexion:', error);
      }
    });

    this.chatClient.onDisconnect((manually, reason) => {
      console.log(`❌ Déconnecté du chat: ${reason || 'manually'}`);
      this.isConnected = false;
      
      // Reconnexion automatique si ce n'est pas une déconnexion manuelle
      if (!manually && this.chatClient) {
        console.log('🔄 Tentative de reconnexion dans 5 secondes...');
        setTimeout(() => {
          if (!this.isConnected) {
            this.connect(channel).catch((error) => {
              console.error('❌ Erreur lors de la reconnexion:', error);
            });
          }
        }, 5000);
      }
    });

    // Connexion
    await this.chatClient.connect();
  }

  /**
   * Déconnecte du chat
   */
  async disconnect(): Promise<void> {
    if (this.chatClient) {
      await this.chatClient.quit();
      this.chatClient = null;
      this.isConnected = false;
      console.log('👋 Déconnecté du chat Twitch');
    }
  }

  /**
   * Envoie un message dans le chat
   * @param channel - Nom du channel (ex: "wazz34")
   * @param message - Message à envoyer
   */
  async sendMessage(channel: string, message: string): Promise<void> {
    if (!this.chatClient || !this.isConnected) {
      throw new Error('Chat non connecté');
    }

    await this.chatClient.say(channel, message);
  }

  /**
   * Vérifie si le service est connecté
   */
  get connected(): boolean {
    return this.isConnected;
  }
}

// Singleton
export const chatService = new ChatService();

