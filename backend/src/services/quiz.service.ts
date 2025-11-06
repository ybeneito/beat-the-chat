import { get } from '../utils/http.client.js';
import type {
  OpenTDBResponse,
  Question,
  GetQuestionsOptions
} from '../types/quiz.types.js';

const OPENTDB_BASE_URL = 'https://opentdb.com/api.php';

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

function formatQuestion(openTDBQuestion: OpenTDBResponse['results'][0], index: number): Question {
  const allAnswers = [
    openTDBQuestion.correct_answer,
    ...openTDBQuestion.incorrect_answers
  ];

  return {
    id: `question-${index}`,
    category: decodeHtml(openTDBQuestion.category),
    difficulty: openTDBQuestion.difficulty,
    question: decodeHtml(openTDBQuestion.question),
    correctAnswer: decodeHtml(openTDBQuestion.correct_answer),
    incorrectAnswers: openTDBQuestion.incorrect_answers.map(decodeHtml),
    allAnswers: shuffle(allAnswers).map(decodeHtml)
  };
}


function buildOpenTDBUrl(options: GetQuestionsOptions): string {
  const params = new URLSearchParams({
    amount: options.amount.toString()
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
  const url = buildOpenTDBUrl(options);
  const response = await get<OpenTDBResponse>(url);

  if (response.response_code !== 0) {
    throw new Error(`OpenTDB API error: response_code ${response.response_code}`);
  }

  return response.results.map((question, index) => formatQuestion(question, index));
}

export const quizService = {
  getQuestions
};

