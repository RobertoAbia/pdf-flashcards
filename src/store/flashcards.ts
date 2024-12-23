import { create } from 'zustand';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Unit, Flashcard } from '@/types/supabase';
import { calculateSM2, difficultyToQuality } from '@/utils/supermemo2';

interface FlashcardStore {
  units: Unit[];
  flashcards: Flashcard[];
  loadUnits: () => Promise<void>;
  loadFlashcards: (unitId: string) => Promise<void>;
  loadAllFlashcards: () => Promise<void>;
  addUnit: (unit: { name: string; description: string | null }) => Promise<string>;
  addFlashcardsToUnit: (unitId: string, newFlashcards: Array<{ front: string; back: string }>) => Promise<void>;
  createFlashcard: (unitId: string, front: string, back: string) => Promise<Flashcard>;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => Promise<Flashcard>;
  deleteFlashcard: (id: string) => Promise<void>;
  getFlashcardsByUnit: (unitId: string) => Flashcard[];
  getUnit: (unitId: string) => Unit | undefined;
  updateUnit: (id: string, updates: Partial<Unit>) => Promise<Unit>;
  deleteUnit: (id: string) => Promise<void>;
  getFlashcardCountsByDifficulty: (unitId: string) => { easy: number; medium: number; hard: number };
  getTotalFlashcards: () => number;
  updateFlashcardDifficulty: (flashcardId: string, difficulty: 'easy' | 'medium' | 'hard') => Promise<Flashcard>;
  markFlashcardReviewed: (flashcardId: string, nextReviewDate: Date) => Promise<any>;
}

export const useFlashcardStore = create<FlashcardStore>()((set, get) => ({
  units: [],
  flashcards: [],
  
  loadUnits: async () => {
    const supabase = createClientComponentClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No user logged in');
      return;
    }

    // Cargar unidades
    const { data: units, error: unitsError } = await supabase
      .from('units')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (unitsError) {
      console.error('Error loading units:', unitsError);
      return;
    }

    // Cargar todas las flashcards de las unidades del usuario
    const { data: flashcards, error: flashcardsError } = await supabase
      .from('flashcards')
      .select('*')
      .in('unit_id', units.map(u => u.id));

    if (flashcardsError) {
      console.error('Error loading flashcards:', flashcardsError);
      return;
    }

    set({ 
      units: units || [], 
      flashcards: flashcards || []
    });
  },

  loadFlashcards: async (unitId: string) => {
    const supabase = createClientComponentClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No user logged in');
      return;
    }

    // Primero verificamos que la unidad pertenece al usuario
    const { data: unit } = await supabase
      .from('units')
      .select('id')
      .eq('id', unitId)
      .eq('user_id', user.id)
      .single();

    if (!unit) {
      console.error('Unit not found or does not belong to user');
      return;
    }

    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('unit_id', unitId);

    if (error) {
      console.error('Error loading flashcards:', error);
      return;
    }

    set({ flashcards: flashcards || [] });
  },
  
  loadAllFlashcards: async () => {
    const supabase = createClientComponentClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No user logged in');
    }

    // Obtener todas las flashcards de las unidades del usuario
    const { data, error } = await supabase
      .from('flashcards')
      .select('*, units!inner(*)')
      .eq('units.user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading flashcards:', error);
      throw error;
    }

    set({ flashcards: data || [] });
  },
  
  addUnit: async (unitData) => {
    const supabase = createClientComponentClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No user logged in');
    }

    const newUnit = {
      user_id: user.id,
      name: unitData.name,
      description: unitData.description,
      easy_cards_count: 0,
      medium_cards_count: 0,
      hard_cards_count: 0,
    };

    const { data, error } = await supabase
      .from('units')
      .insert(newUnit)
      .select()
      .single();

    if (error) {
      console.error('Error creating unit:', error);
      throw error;
    }

    set((state) => ({
      units: [...state.units, data],
    }));
    
    return data.id;
  },
  
  addFlashcardsToUnit: async (unitId, newFlashcards) => {
    const supabase = createClientComponentClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No user logged in');
    }

    const now = new Date().toISOString();
    const flashcardsToInsert = newFlashcards.map((card) => ({
      unit_id: unitId,
      front: card.front,
      back: card.back,
      difficulty: 'medium' as const,
      review_count: 0,
      last_reviewed: null,
      next_review: now,
    }));

    const { data: insertedFlashcards, error } = await supabase
      .from('flashcards')
      .insert(flashcardsToInsert)
      .select();

    if (error) {
      console.error('Error creating flashcards:', error);
      throw error;
    }

    set((state) => ({
      flashcards: [...state.flashcards, ...insertedFlashcards],
    }));
  },

  createFlashcard: async (unitId: string, front: string, back: string) => {
    const supabase = createClientComponentClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No user logged in');
    }

    console.log('Creando flashcard para:', {
      userId: user.id,
      unitId,
      front: front.substring(0, 20) + '...' // Solo para el log
    });

    // Verificar que la unidad pertenece al usuario
    const { data: unit } = await supabase
      .from('units')
      .select('id')
      .eq('id', unitId)
      .eq('user_id', user.id)
      .single();

    if (!unit) {
      throw new Error('Unit not found or does not belong to user');
    }

    console.log('Unidad verificada:', unit.id);

    const now = new Date().toISOString();

    // Usar la función RPC que maneja la transacción completa
    const { data, error } = await supabase.rpc('create_flashcard_and_update_count', {
      p_unit_id: unitId,
      p_front: front,
      p_back: back,
      p_difficulty: 'medium' as const, // Asegurarnos de que TypeScript lo trata como literal
      p_next_review: now,
      p_created_at: now,
      p_user_id: user.id
    });

    if (error) {
      console.error('Error creating flashcard:', error);
      throw error;
    }

    console.log('Flashcard creada exitosamente:', {
      flashcardId: data.id,
      unitId: data.unit_id
    });

    // Actualizar el estado local con la nueva tarjeta
    set((state) => ({
      flashcards: [...state.flashcards, data].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    }));

    return data;
  },
  
  updateFlashcard: async (id: string, updates: Partial<Flashcard>) => {
    const supabase = createClientComponentClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      // Verificar que la flashcard pertenece a una unidad del usuario
      const { data: flashcard } = await supabase
        .from('flashcards')
        .select('*, units!inner(user_id)')
        .eq('id', id)
        .eq('units.user_id', user.id)
        .single();

      if (!flashcard) {
        throw new Error('Flashcard not found or does not belong to user');
      }

      const { data, error } = await supabase
        .from('flashcards')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating flashcard:', error.message);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned after update');
      }

      // Actualizar el estado local
      set((state) => ({
        flashcards: state.flashcards
          .map(f => f.id === id ? { ...f, ...updates } : f)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      }));

      return data;
    } catch (error) {
      console.error('Error in updateFlashcard:', error);
      throw error;
    }
  },
  
  deleteFlashcard: async (id: string) => {
    const supabase = createClientComponentClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No user logged in');
    }

    // Verificar que la flashcard pertenece a una unidad del usuario
    const { data: flashcard } = await supabase
      .from('flashcards')
      .select('*, units!inner(user_id)')
      .eq('id', id)
      .eq('units.user_id', user.id)
      .single();

    if (!flashcard) {
      throw new Error('Flashcard not found or does not belong to user');
    }

    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting flashcard:', error);
      throw error;
    }

    // Actualizar el estado local eliminando la tarjeta
    set((state) => ({
      flashcards: state.flashcards.filter(f => f.id !== id),
    }));
  },
  
  getFlashcardsByUnit: (unitId) => {
    const { flashcards } = get();
    return flashcards.filter((card) => card.unit_id === unitId);
  },
  
  getUnit: (unitId) => {
    const { units } = get();
    return units.find((unit) => unit.id === unitId);
  },
  
  updateUnit: async (id: string, updates: Partial<Unit>) => {
    const supabase = createClientComponentClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No user logged in');
    }

    // Verificar que la unidad pertenece al usuario
    const { data: existingUnit } = await supabase
      .from('units')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existingUnit) {
      throw new Error('Unit not found or does not belong to user');
    }

    const { data, error } = await supabase
      .from('units')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating unit:', error);
      throw error;
    }

    // Actualizar el estado local
    set((state) => ({
      units: state.units
        .map(u => u.id === id ? { ...u, ...data } : u)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }));

    return data;
  },

  deleteUnit: async (id: string) => {
    const supabase = createClientComponentClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No user logged in');
    }

    // Verificar que la unidad pertenece al usuario
    const { data: existingUnit } = await supabase
      .from('units')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existingUnit) {
      throw new Error('Unit not found or does not belong to user');
    }

    // Primero eliminamos todas las tarjetas asociadas a la unidad
    const { error: flashcardsError } = await supabase
      .from('flashcards')
      .delete()
      .eq('unit_id', id);

    if (flashcardsError) {
      console.error('Error deleting unit flashcards:', flashcardsError);
      throw flashcardsError;
    }

    // Luego eliminamos la unidad
    const { error } = await supabase
      .from('units')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting unit:', error);
      throw error;
    }

    // Actualizar el estado local
    set((state) => ({
      units: state.units.filter(u => u.id !== id),
      flashcards: state.flashcards.filter(f => f.unit_id !== id),
    }));
  },
  
  getFlashcardCountsByDifficulty: (unitId: string) => {
    const state = get();
    const unitFlashcards = state.flashcards.filter(f => f.unit_id === unitId);
    return {
      easy: unitFlashcards.filter(f => f.difficulty === 'easy').length,
      medium: unitFlashcards.filter(f => f.difficulty === 'medium').length,
      hard: unitFlashcards.filter(f => f.difficulty === 'hard').length
    };
  },
  
  getTotalFlashcards: () => {
    const state = get();
    return state.flashcards.length;
  },
  
  updateFlashcardDifficulty: async (flashcardId: string, difficulty: 'easy' | 'medium' | 'hard') => {
    const supabase = createClientComponentClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No user logged in');
      throw new Error('No user logged in');
    }

    try {
      // Obtener la tarjeta actual con sus valores SM2
      const { data: flashcard, error: fetchError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('id', flashcardId)
        .single();

      if (fetchError) {
        console.error('Error fetching flashcard:', fetchError);
        throw fetchError;
      }

      if (!flashcard) {
        console.error('Flashcard not found:', flashcardId);
        throw new Error('Flashcard not found');
      }

      console.log('Flashcard before update:', flashcard);

      // Calcular el intervalo actual en días
      const lastReviewed = flashcard.last_reviewed ? new Date(flashcard.last_reviewed) : new Date();
      const nextReview = flashcard.next_review ? new Date(flashcard.next_review) : new Date();
      const currentInterval = Math.ceil((nextReview.getTime() - lastReviewed.getTime()) / (1000 * 60 * 60 * 24));

      // Convertir la dificultad a calidad (0-5) y calcular los nuevos valores SM2
      const quality = difficultyToQuality(difficulty);
      console.log('Calidad calculada:', quality);
      console.log('Valores actuales:', {
        review_count: flashcard.review_count || 0,
        easiness_factor: flashcard.easiness_factor || 2.5,
        currentInterval
      });

      const sm2Result = calculateSM2(
        quality,
        flashcard.review_count || 0,
        flashcard.easiness_factor || 2.5,
        currentInterval
      );

      console.log('SM2 calculation result:', {
        ...sm2Result,
        quality,
        previousEF: flashcard.easiness_factor || 2.5
      });

      // Preparar los datos de actualización
      const updateData = {
        difficulty: difficulty,
        easiness_factor: sm2Result.easinessFactor,
        review_count: sm2Result.repetitions,
        next_review: sm2Result.nextReviewDate.toISOString(),
        last_reviewed: new Date().toISOString()
      };

      console.log('Update data:', updateData);

      // Actualizar la tarjeta con los nuevos valores
      const { data: updatedFlashcard, error: updateError } = await supabase
        .from('flashcards')
        .update(updateData)
        .eq('id', flashcardId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating flashcard:', updateError);
        throw updateError;
      }

      if (!updatedFlashcard) {
        console.error('No flashcard returned after update');
        throw new Error('No flashcard returned after update');
      }

      console.log('Flashcard after update:', updatedFlashcard);

      // Actualizar el estado local
      set(state => ({
        flashcards: state.flashcards.map(f =>
          f.id === flashcardId ? updatedFlashcard : f
        )
      }));

      return updatedFlashcard;
    } catch (error) {
      console.error('Detailed error in updateFlashcardDifficulty:', error);
      throw error;
    }
  },
  
  markFlashcardReviewed: async (flashcardId: string, nextReviewDate: Date) => {
    try {
      const supabase = createClientComponentClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Usuario no autenticado');

      // Convertir la fecha a formato YYYY-MM-DD
      const formattedDate = nextReviewDate.toISOString().split('T')[0];

      const params = {
        p_flashcard_id: flashcardId,
        p_user_id: user.id,
        p_next_review_date: formattedDate
      };

      console.log('Llamando a mark_flashcard_reviewed con parámetros:', params);

      const { data, error, status, statusText } = await supabase
        .rpc('mark_flashcard_reviewed', params);

      // Log detallado del resultado
      console.log('Respuesta completa de mark_flashcard_reviewed:', {
        data,
        error,
        status,
        statusText,
        params
      });

      if (error) {
        console.error('Error detallado en mark_flashcard_reviewed:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      if (!data) {
        console.error('No se recibió respuesta de mark_flashcard_reviewed');
        throw new Error('No se recibió respuesta del servidor');
      }

      // Actualizar el estado local
      set((state) => ({
        flashcards: state.flashcards.map((f) =>
          f.id === flashcardId ? { ...f, next_review: formattedDate } : f
        ),
      }));

      return data;
    } catch (error) {
      console.error('Error al marcar la tarjeta como revisada:', error);
      throw error;
    }
  },
}));
