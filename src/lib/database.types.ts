export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string | null
          avatar_url: string | null
          total_flashcards: number
          study_streak: number
          total_study_time: number
          completed_sessions: number
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          total_flashcards?: number
          study_streak?: number
          total_study_time?: number
          completed_sessions?: number
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          total_flashcards?: number
          study_streak?: number
          total_study_time?: number
          completed_sessions?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
