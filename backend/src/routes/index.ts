import { Router, type IRouter } from 'express';
import { quizRouter } from './quiz.routes.js';
import { chatRouter } from './chat.routes.js';

export const router: IRouter = Router();

// Routes
router.use('/quiz', quizRouter);
router.use('/chat', chatRouter);

// TODO: Ajouter d'autres routes ici
// router.use('/game', gameRouter);

