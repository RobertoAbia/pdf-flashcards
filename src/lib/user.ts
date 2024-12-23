import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Profile } from '@/types/supabase'

/**
 * Obtiene el perfil del usuario actual
 */
export async function getCurrentProfile() {
  const supabase = createClientComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

/**
 * Crea o actualiza el perfil del usuario
 */
export async function upsertProfile(profile: Partial<Profile>) {
  const supabase = createClientComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No user logged in')

  console.log('Current user:', user)

  const updates = {
    id: user.id,
    email: user.email!,
    ...profile,
    updated_at: new Date().toISOString(),
  }

  console.log('Updating profile with:', updates)

  // Primero intentemos obtener el perfil actual
  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  console.log('Existing profile:', existingProfile, 'Fetch error:', fetchError)

  // Si el perfil existe, hacemos update. Si no, hacemos insert
  const operation = existingProfile ? 
    supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id) :
    supabase
      .from('profiles')
      .insert(updates)

  const { data, error } = await operation.select().single()

  if (error) {
    console.error('Error updating profile:', error)
    throw error
  }

  console.log('Profile updated successfully:', data)
  return data
}

/**
 * Actualiza el streak del usuario si es necesario
 */
export async function updateStudyStreak() {
  const profile = await getCurrentProfile()
  if (!profile) throw new Error('No profile found')

  const today = new Date().toISOString().split('T')[0]
  const lastStudyDate = profile.last_study_date?.split('T')[0]

  let newStreak = profile.study_streak || 0

  if (!lastStudyDate) {
    // Primera vez que estudia
    newStreak = 1
  } else {
    const daysSinceLastStudy = getDaysDifference(lastStudyDate, today)
    
    if (daysSinceLastStudy === 0) {
      // Ya ha estudiado hoy, mantener la racha actual
      newStreak = profile.study_streak
    } else if (daysSinceLastStudy === 1) {
      // Estudió ayer, incrementar la racha
      newStreak += 1
    } else {
      // No ha estudiado en más de un día, reiniciar la racha
      newStreak = 1
    }
  }

  return upsertProfile({
    study_streak: newStreak,
    last_study_date: today,
  })
}

// Función auxiliar para obtener la diferencia en días entre dos fechas
function getDaysDifference(date1: string, date2: string): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  
  // Normalizar las fechas a medianoche UTC para evitar problemas con horario de verano
  d1.setUTCHours(0, 0, 0, 0)
  d2.setUTCHours(0, 0, 0, 0)
  
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

// Función auxiliar para obtener la fecha de ayer
function getPreviousDay(date: string) {
  const d = new Date(date)
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

/**
 * Incrementa el contador de flashcards creadas
 */
export async function incrementFlashcardsCreated(count: number = 1) {
  const profile = await getCurrentProfile()
  if (!profile) throw new Error('No profile found')

  return upsertProfile({
    total_flashcards_created: profile.total_flashcards_created + count,
  })
}

/**
 * Incrementa el contador de pomodoros completados
 */
export async function incrementPomodorosCompleted() {
  const profile = await getCurrentProfile()
  if (!profile) throw new Error('No profile found')

  return upsertProfile({
    total_pomodoros_completed: profile.total_pomodoros_completed + 1,
  })
}
