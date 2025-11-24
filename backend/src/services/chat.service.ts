/**
 * Service pour gérer la connexion au chat Twitch
 * Utilise @twurple/chat pour se connecter et écouter les messages
 * 
 * ⚠️ ÉVOLUTION FUTURE (V1+) :
 * Actuellement, ce service gère une seule connexion à la fois (singleton).
 * Pour supporter plusieurs sessions simultanées (multi-streamers), il faudra :
 * 
 * 1. Transformer en Map<channelId, ChatSession> pour gérer plusieurs connexions
 * 2. Créer une classe ChatSession qui encapsule un ChatClient par channel
 * 3. Adapter les routes API pour accepter un channelId en paramètre
 * 4. Gérer l'authentification par session (chaque streamer a son propre token)
 * 
 * Structure future suggérée :
 * - ChatService devient un manager de sessions
 * - ChatSession gère une connexion unique (un channel)
 * - Routes API : POST /api/chat/:channelId/connect, /api/chat/:channelId/say, etc.
 */

import { StaticAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';

const CLIENT_ID = process.env.TWITCH_CLIENT_ID
const ACCESS_TOKEN = process.env.TWITCH_ACCESS_TOKEN

class ChatService {
  private chatClient: ChatClient | null = null;
  private isConnected = false;
  private isConnecting = false;
  private currentChannel: string | null = null;
  
  // TODO V1+ : Remplacer par Map<string, ChatSession>
  // private sessions: Map<string, ChatSession> = new Map();

  /**
   * Connecte au chat Twitch d'un channel
   * @param channel - Nom du channel (ex: "wazz34")
   */
  async connect(channel: string): Promise<void> {
    // Éviter les connexions multiples simultanées
    if (this.isConnected || this.isConnecting) {
      console.log('⚠️ Chat déjà connecté ou en cours de connexion');
      return;
    }

    if (!CLIENT_ID || !ACCESS_TOKEN) {
      throw new Error('TWITCH_CLIENT_ID et TWITCH_ACCESS_TOKEN sont requis');
    }

    // Nettoyer l'ancien client s'il existe
    if (this.chatClient) {
      try {
        await this.chatClient.quit();
      } catch (error) {
        // Ignorer les erreurs de déconnexion
      }
      this.chatClient = null;
    }

    this.isConnecting = true;
    this.currentChannel = channel;

    try {
      // AuthProvider avec clientId et accessToken
      const authProvider = new StaticAuthProvider(CLIENT_ID, ACCESS_TOKEN);

      // Créer le client chat
      this.chatClient = new ChatClient({
        authProvider,
        channels: [channel]
      });

      // Écouter les messages (un seul listener)
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
        this.isConnecting = false;
        
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
        this.isConnecting = false;
        
        // Nettoyer le client
        this.chatClient = null;
        
        // Reconnexion automatique si ce n'est pas une déconnexion manuelle et qu'on a un channel
        if (!manually && this.currentChannel) {
          console.log('🔄 Tentative de reconnexion dans 5 secondes...');
          setTimeout(() => {
            // Vérifier qu'on n'est toujours pas connecté avant de reconnecter
            if (!this.isConnected && !this.isConnecting && this.currentChannel) {
              this.connect(this.currentChannel).catch((error) => {
                console.error('❌ Erreur lors de la reconnexion:', error);
              });
            }
          }, 5000);
        }
      });

      // Connexion
      await this.chatClient.connect();
    } catch (error) {
      this.isConnecting = false;
      this.chatClient = null;
      throw error;
    }
  }

  /**
   * Déconnecte du chat
   */
  async disconnect(): Promise<void> {
    if (this.chatClient) {
      try {
        await this.chatClient.quit();
      } catch (error) {
        // Ignorer les erreurs de déconnexion
      }
      this.chatClient = null;
      this.isConnected = false;
      this.isConnecting = false;
      this.currentChannel = null;
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

