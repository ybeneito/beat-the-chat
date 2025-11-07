export interface QuizzApiResponse {
  count: number;
  quizzes: QuizzApiQuestion[];
}

export interface QuizzApiQuestion {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  category: string;
  difficulty: 'facile' | 'normal' | 'difficile';
  badAnswers: string[];
}

export interface Question {
  id: string;
  category: string;
  difficulty: 'facile' | 'normal' | 'difficile';
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  allAnswers: string[];
}

export interface GetQuestionsOptions {
  limit: number;
  difficulty?: 'facile' | 'normal' | 'difficile';
  category?: string;
}

