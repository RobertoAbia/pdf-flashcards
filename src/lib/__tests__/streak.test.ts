import { getDaysDifference } from '../user';

// Función auxiliar para simular diferentes escenarios
function testStreakLogic(lastStudyDate: string | null, currentStreak: number, today: string) {
  let newStreak = currentStreak;

  if (!lastStudyDate) {
    newStreak = 1;
  } else {
    const daysSinceLastStudy = getDaysDifference(lastStudyDate, today);
    
    if (daysSinceLastStudy === 0) {
      newStreak = currentStreak;
    } else if (daysSinceLastStudy === 1) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }
  }

  return newStreak;
}

// Casos de prueba
console.log('Probando lógica de rachas...\n');

// Caso 1: Primera vez que estudia
console.log('Caso 1: Primera vez que estudia');
console.log('Input: lastStudyDate = null, currentStreak = 0');
console.log('Expected: 1');
console.log('Result:', testStreakLogic(null, 0, '2023-12-23'));
console.log('-------------------\n');

// Caso 2: Estudia dos días seguidos
console.log('Caso 2: Estudia dos días seguidos');
console.log('Input: lastStudyDate = 2023-12-22, currentStreak = 1');
console.log('Expected: 2');
console.log('Result:', testStreakLogic('2023-12-22', 1, '2023-12-23'));
console.log('-------------------\n');

// Caso 3: Ya estudió hoy
console.log('Caso 3: Ya estudió hoy');
console.log('Input: lastStudyDate = 2023-12-23, currentStreak = 5');
console.log('Expected: 5 (mantiene la racha)');
console.log('Result:', testStreakLogic('2023-12-23', 5, '2023-12-23'));
console.log('-------------------\n');

// Caso 4: No estudió ayer (perdió la racha)
console.log('Caso 4: No estudió ayer (perdió la racha)');
console.log('Input: lastStudyDate = 2023-12-20, currentStreak = 10');
console.log('Expected: 1 (reinicia la racha)');
console.log('Result:', testStreakLogic('2023-12-20', 10, '2023-12-23'));
console.log('-------------------\n');

// Caso 5: Cambio de mes
console.log('Caso 5: Cambio de mes');
console.log('Input: lastStudyDate = 2023-12-31, currentStreak = 7');
console.log('Expected: 8');
console.log('Result:', testStreakLogic('2023-12-31', 7, '2024-01-01'));
console.log('-------------------\n');

// Caso 6: Cambio de año
console.log('Caso 6: Cambio de año con días perdidos');
console.log('Input: lastStudyDate = 2023-12-30, currentStreak = 15');
console.log('Expected: 1');
console.log('Result:', testStreakLogic('2023-12-30', 15, '2024-01-02'));
console.log('-------------------\n');
