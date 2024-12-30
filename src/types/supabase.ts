export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  study_streak: number
  last_study_date: string | null
  total_flashcards_created: number
  total_pomodoros_completed: number
  mastery_score: number
  created_at: string
  updated_at: string
  streak_updated_today: boolean
}

export interface Unit {
  id: string
  created_at: string
  name: string
  description: string | null
  user_id: string
  easy_cards_count: number
  medium_cards_count: number
  hard_cards_count: number
  updated_at: string
}

export interface Flashcard {
  id: string
  created_at: string
  unit_id: string
  front: string
  back: string
  difficulty: 'easy' | 'medium' | 'hard'
  easiness_factor: number
  review_count: number
  next_review: string | null
  last_reviewed: string | null
  user_id: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id'>>
      }
      units: {
        Row: Unit
        Insert: Omit<Unit, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Unit, 'id'>>
      }
      flashcards: {
        Row: Flashcard
        Insert: Omit<Flashcard, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Flashcard, 'id'>>
      }
    }
  }
}
