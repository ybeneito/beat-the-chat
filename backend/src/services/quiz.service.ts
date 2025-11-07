import { get } from '../utils/http.client.js';
import type {
  Question,
  GetQuestionsOptions,
  QuizzApiResponse,
  QuizzApiQuestion
} from '../types/quiz.types.js';

const OPENTDB_BASE_URL = 'https://quizzapi.jomoreschi.fr/api/v2/quiz';

/**
 * Décode les entités HTML (ex: &quot; → ")
 * Utilise une fonction simple pour les cas courants
 */
function decodeHtml(html: string): string {
  return html
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function formatQuestion(quizzApiQuestion: QuizzApiQuestion): Question {
  const allAnswers = [
    quizzApiQuestion.answer,
    ...quizzApiQuestion.badAnswers
  ];

  return {
    id: quizzApiQuestion.id,
    category: quizzApiQuestion.category,
    difficulty: quizzApiQuestion.difficulty,
    question: decodeHtml(quizzApiQuestion.question),
    correctAnswer: decodeHtml(quizzApiQuestion.answer),
    incorrectAnswers: quizzApiQuestion.badAnswers.map(decodeHtml),
    allAnswers: shuffle(allAnswers).map(decodeHtml)
  };
}


function buildQuizzApiUrl(options: GetQuestionsOptions): string {
  const params = new URLSearchParams({
    limit: options.limit.toString()
  });

  if (options.difficulty) {
    params.append('difficulty', options.difficulty);
  }

  if (options.category) {
    params.append('category', options.category);
  }

  return `${OPENTDB_BASE_URL}?${params.toString()}`;
}

export async function getQuestions(options: GetQuestionsOptions): Promise<Question[]> {
  const url = buildQuizzApiUrl(options);
  const response = await get<QuizzApiResponse>(url);

  if (!response.quizzes || response.quizzes.length === 0) {
    throw new Error('No questions returned from QuizAPI');
  }

  return response.quizzes.map((question) => formatQuestion(question));
}

export const quizService = {
  getQuestions
};

