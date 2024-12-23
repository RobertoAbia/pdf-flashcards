import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = 'https://thflyrczdhktwximxnle.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoZmx5cmN6ZGhrdHd4aW14bmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MDgzNTksImV4cCI6MjA0OTQ4NDM1OX0.AfqP792gOiYRTy8XGZVbu3IdHwLilagsM5s8YRAahlw'

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true
    },
    // Deshabilitamos la verificación de hostname personalizado
    enableHostnameFetch: false
  }
)
