import { Router, type IRouter } from 'express';
import { quizRouter } from './quiz.routes.js';

export const router: IRouter = Router();

// Routes
router.use('/quiz', quizRouter);

// TODO: Ajouter d'autres routes ici
// router.use('/twitch', twitchRouter);
// router.use('/game', gameRouter);

