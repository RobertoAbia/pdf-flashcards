import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Unit } from '@/types/supabase'

/**
 * Crea una nueva unidad para el usuario actual
 */
export async function createUnit(name: string, description: string | null = null) {
  const supabase = createClientComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No user logged in')

  const newUnit = {
    user_id: user.id,
    name,
    description,
    easy_cards_count: 0,
    medium_cards_count: 0,
    hard_cards_count: 0,
  }

  const { data, error } = await supabase
    .from('units')
    .insert(newUnit)
    .select()
    .single()

  if (error) {
    console.error('Error creating unit:', error)
    throw error
  }

  return data
}

/**
 * Obtiene todas las unidades del usuario actual
 */
export async function getUserUnits() {
  const supabase = createClientComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No user logged in')

  const { data, error } = await supabase
    .from('units')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching units:', error)
    throw error
  }

  return data
}

/**
 * Actualiza una unidad existente
 */
export async function updateUnit(unitId: string, name: string, description: string | null = null) {
  const supabase = createClientComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No user logged in')

  const { data, error } = await supabase
    .from('units')
    .update({ name, description })
    .eq('id', unitId)
    .eq('user_id', user.id) // Asegurarse de que la unidad pertenece al usuario
    .select()
    .single()

  if (error) {
    console.error('Error updating unit:', error)
    throw error
  }

  return data
}

/**
 * Elimina una unidad y todas sus tarjetas
 */
export async function deleteUnit(unitId: string) {
  const supabase = createClientComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No user logged in')

  // Primero eliminamos todas las flashcards de la unidad
  const { error: flashcardsError } = await supabase
    .from('flashcards')
    .delete()
    .eq('unit_id', unitId)

  if (flashcardsError) {
    console.error('Error deleting flashcards:', flashcardsError)
    throw flashcardsError
  }

  // Luego eliminamos la unidad
  const { error: unitError } = await supabase
    .from('units')
    .delete()
    .eq('id', unitId)
    .eq('user_id', user.id) // Asegurarse de que la unidad pertenece al usuario

  if (unitError) {
    console.error('Error deleting unit:', unitError)
    throw unitError
  }
}
