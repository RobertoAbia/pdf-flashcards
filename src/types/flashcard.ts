export interface Flashcard {
  id: string;
  created_at: string;
  unit_id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  easiness_factor: number;
  review_count: number;
  next_review: string | null;
  last_reviewed: string | null;
  user_id: string;
  updated_at: string;
}
