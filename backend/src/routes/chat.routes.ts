/**
 * Routes pour le chat Twitch
 */

import { Router, type IRouter, Request, Response } from 'express';
import { chatService } from '../services/chat.service.js';

export const chatRouter: IRouter = Router();

/**
 * POST /api/chat/say
 * Envoie un message dans le chat Twitch
 * 
 * Body: { channel: string, message: string }
 */
chatRouter.post('/say', async (req: Request, res: Response) => {
  try {
    const { channel, message } = req.body;

    if (!channel || !message) {
      return res.status(400).json({
        success: false,
        error: 'channel et message sont requis'
      });
    }

    if (!chatService.connected) {
      return res.status(503).json({
        success: false,
        error: 'Chat non connecté'
      });
    }

    await chatService.sendMessage(channel, message);

    res.json({
      success: true,
      message: 'Message envoyé'
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message'
    });
  }
});

