import OpenAI from 'openai';
import { createParser } from 'eventsource-parser';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateFlashcards(text: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Eres un asistente especializado en crear flashcards educativas. 
          Analiza el texto proporcionado y genera 5 flashcards con preguntas y respuestas.
          Las preguntas deben ser claras y específicas, y las respuestas deben ser concisas pero informativas.`
        },
        {
          role: "user",
          content: `Genera 5 flashcards del siguiente texto. Devuelve el resultado en formato JSON como un array de objetos,
          donde cada objeto tiene las propiedades "front" (pregunta) y "back" (respuesta): ${text}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{"flashcards": []}');
    return result.flashcards;
  } catch (error) {
    console.error('Error al generar flashcards:', error);
    throw error;
  }
}
