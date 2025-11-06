import { Router, Request, Response } from 'express';
import { quizService } from '../services/quiz.service';

export const quizRouter = Router();

/**
 * GET /api/quiz/questions
 * Query params:
 * - amount: nombre de questions (défaut: 10)
 * - difficulty: easy, medium, hard (optionnel)
 * - category: ID de catégorie (optionnel)
 */
quizRouter.get('/questions', async (req: Request, res: Response) => {
  try {
    const amount = parseInt(req.query.amount as string) || 10;
    const difficulty = req.query.difficulty as 'easy' | 'medium' | 'hard' | undefined;
    const category = req.query.category as string | undefined;

    const questions = await quizService.getQuestions({
      amount,
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

