-- Función para actualizar la racha de estudio
CREATE OR REPLACE FUNCTION public.update_study_streak(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    pending_cards INTEGER;
    current_date DATE;
BEGIN
    -- Obtener la fecha actual
    current_date := CURRENT_DATE;
    
    -- Contar tarjetas pendientes para hoy o antes
    SELECT COUNT(*)
    INTO pending_cards
    FROM flashcards f
    JOIN units u ON f.unit_id = u.id
    WHERE u.user_id = p_user_id
    AND (
        f.next_review IS NULL 
        OR DATE(f.next_review) <= current_date
    );
    
    -- Actualizar la racha
    IF pending_cards = 0 THEN
        -- Si no hay tarjetas pendientes, incrementar la racha
        UPDATE profiles
        SET study_streak = study_streak + 1,
            updated_at = NOW()
        WHERE id = p_user_id;
    ELSE
        -- Si hay tarjetas pendientes, reiniciar la racha a 0
        UPDATE profiles
        SET study_streak = 0,
            updated_at = NOW()
        WHERE id = p_user_id;
    END IF;
END;
$$;

-- Modificar la función mark_flashcard_reviewed para que actualice la racha
CREATE OR REPLACE FUNCTION public.mark_flashcard_reviewed(
    p_flashcard_id UUID,
    p_user_id UUID,
    p_next_review_date DATE
)
RETURNS SETOF flashcards
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Marcar la tarjeta como revisada
    UPDATE flashcards
    SET last_reviewed = CURRENT_TIMESTAMP,
        next_review = p_next_review_date
    WHERE id = p_flashcard_id
    AND EXISTS (
        SELECT 1
        FROM units
        WHERE units.id = flashcards.unit_id
        AND units.user_id = p_user_id
    );

    -- Actualizar la racha de estudio
    PERFORM update_study_streak(p_user_id);

    -- Devolver la tarjeta actualizada
    RETURN QUERY
    SELECT *
    FROM flashcards
    WHERE id = p_flashcard_id;
END;
$$;
