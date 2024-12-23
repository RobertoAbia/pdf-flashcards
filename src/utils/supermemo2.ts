interface SM2Result {
  interval: number;
  repetitions: number;
  easinessFactor: number;
  nextReviewDate: Date;
}

/**
 * Convierte la dificultad a una calificación de calidad (0-5)
 * @param difficulty - Dificultad ('easy' | 'medium' | 'hard')
 * @returns Número entre 0 y 5
 */
export function difficultyToQuality(difficulty: 'easy' | 'medium' | 'hard'): number {
  switch (difficulty) {
    case 'easy':
      return 5;    // Perfecta respuesta con facilidad
    case 'medium':
      return 3;    // Respuesta correcta con dificultad
    case 'hard':
      return 0;    // Respuesta incorrecta
    default:
      return 3;
  }
}

/**
 * Calcula los nuevos valores según el algoritmo SuperMemo 2
 * @param quality - Calidad de la respuesta (0-5)
 * @param repetitions - Número de repeticiones consecutivas
 * @param easinessFactor - Factor de facilidad (≥ 1.3)
 * @param previousInterval - Intervalo anterior en días
 * @returns Objeto con los nuevos valores calculados
 */
export function calculateSM2(
  quality: number,
  repetitions: number,
  easinessFactor: number,
  previousInterval: number
): SM2Result {
  // Asegurarse de que la calidad está entre 0 y 5
  quality = Math.min(5, Math.max(0, quality));

  // Calcular el nuevo factor de facilidad independientemente de la calidad
  let newEasinessFactor = easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  // El factor de facilidad no puede ser menor a 1.3
  newEasinessFactor = Math.max(1.3, newEasinessFactor);

  let newRepetitions: number;
  let newInterval: number;

  if (quality < 3) {
    // Si la respuesta fue mala, volvemos a empezar
    newRepetitions = 0;
    newInterval = 1; // 1 día
  } else {
    newRepetitions = repetitions + 1;

    // Calcular el nuevo intervalo según SM-2
    if (newRepetitions === 1) {
      newInterval = 1; // 1 día
    } else if (newRepetitions === 2) {
      newInterval = 6; // 6 días
    } else {
      // Para la tercera repetición y posteriores
      newInterval = Math.round(previousInterval * newEasinessFactor);
    }
  }

  // Calcular la próxima fecha de revisión
  const nextReviewDate = new Date();
  // Asegurarse de que la fecha base sea el inicio del día actual
  nextReviewDate.setHours(0, 0, 0, 0);
  // Añadir los días del intervalo
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);
  // Establecer una hora fija para la revisión (por ejemplo, 9:00 AM)
  nextReviewDate.setHours(9, 0, 0, 0);

  console.log('Calculando próxima revisión:', {
    quality,
    newRepetitions,
    newEasinessFactor,
    newInterval,
    nextReviewDate: nextReviewDate.toISOString()
  });

  return {
    interval: newInterval,
    repetitions: newRepetitions,
    easinessFactor: Number(newEasinessFactor.toFixed(2)),
    nextReviewDate,
  };
}
