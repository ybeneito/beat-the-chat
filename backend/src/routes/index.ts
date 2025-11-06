import { Router } from 'express';
import { quizRouter } from './quiz.routes';

export const router = Router();

// Routes
router.use('/quiz', quizRouter);

// TODO: Ajouter d'autres routes ici
// router.use('/twitch', twitchRouter);
// router.use('/game', gameRouter);

