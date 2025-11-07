import { Router, type IRouter, Request, Response } from 'express';
import { quizService } from '../services/quiz.service.js';

export const quizRouter: IRouter = Router();

/**
 * GET /api/quiz/questions
 * Query params:
 * - limit: nombre de questions (défaut: 10)
 * - difficulty: facile, normal, difficile (optionnel)
 * - category: slug de catégorie (ex: culture_generale, histoire) (optionnel)
 */
quizRouter.get('/questions', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const difficulty = req.query.difficulty as 'facile' | 'normal' | 'difficile' | undefined;
    const category = req.query.category as string | undefined;

    const questions = await quizService.getQuestions({
      limit,
      difficulty,
      category
    });

    res.json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch questions'
    });
  }
});

