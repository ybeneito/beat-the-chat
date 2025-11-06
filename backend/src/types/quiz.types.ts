export interface OpenTDBResponse {
  response_code: number;
  results: OpenTDBQuestion[];
}

export interface OpenTDBQuestion {
  category: string;
  type: 'multiple' | 'boolean';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface Question {
  id: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  allAnswers: string[];
}

export interface GetQuestionsOptions {
  amount: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
}

