import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import PDFParser from 'pdf2json';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configuración para máxima cobertura del contenido
const CHUNK_SIZE = 2000;  // Reducido de 4000 a 2000 para procesar chunks más pequeños
const MIN_CARDS_PER_CHUNK = 5;  // Este es solo un mínimo, no un objetivo

export async function POST(request: Request) {
  try {
    console.log('Recibiendo solicitud en /api/generate-flashcards');
    
    const formData = await request.formData();
    const pdfFile = formData.get('pdf') as File;
    
    if (!pdfFile) {
      console.error('No se proporcionó archivo PDF');
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo PDF' },
        { status: 400 }
      );
    }

    console.log('Archivo PDF recibido:', pdfFile.name, 'Tamaño:', pdfFile.size);

    // Convertir el archivo a ArrayBuffer y luego a Buffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extraer texto del PDF usando pdf2json
    const pdfParser = new PDFParser();
    
    const text = await new Promise((resolve, reject) => {
      pdfParser.on('pdfParser_dataReady', () => {
        try {
          const text = pdfParser.getRawTextContent()
            .replace(/\r\n|\r|\n/g, ' ') // Reemplazar saltos de línea con espacios
            .replace(/\s+/g, ' ') // Normalizar espacios
            .trim(); // Eliminar espacios al inicio y final
          resolve(text);
        } catch (e) {
          reject(e);
        }
      });
      
      pdfParser.on('pdfParser_dataError', (error) => {
        reject(error);
      });

      pdfParser.parseBuffer(buffer);
    }) as string;

    console.log('Texto extraído, longitud:', text.length);

    // Dividir el texto en chunks más significativos (por párrafos o secciones)
    const chunks = text.split(/(?<=[.!?])\s+(?=[A-Z])/).reduce((acc: string[], curr: string) => {
      const lastChunk = acc[acc.length - 1];
      if (!lastChunk || lastChunk.length + curr.length > CHUNK_SIZE) {
        acc.push(curr);
      } else {
        acc[acc.length - 1] = lastChunk + ' ' + curr;
      }
      return acc;
    }, []);

    console.log(`Dividiendo texto en ${chunks.length} chunks para procesar`);
    console.log(`Longitud de cada chunk:`);
    chunks.forEach((chunk, index) => {
      console.log(`Chunk ${index + 1}: ${chunk.length} caracteres`);
    });

    // Procesar cada chunk y generar flashcards
    const allFlashcards = [];
    for (let i = 0; i < chunks.length; i++) {
      if (chunks[i].trim().length < 50) {
        console.log(`Saltando chunk ${i + 1} por ser muy pequeño (${chunks[i].trim().length} caracteres)`);
        continue;
      }

      console.log(`Procesando chunk ${i + 1} de ${chunks.length} (${chunks[i].length} caracteres)`);
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        messages: [
          {
            role: "system",
            content: `Eres un experto en crear flashcards educativas extremadamente detalladas. Tu objetivo es MAXIMIZAR el número de flashcards útiles.

            REGLAS OBLIGATORIAS:
            1. DEBES crear una flashcard separada para absolutamente CADA:
               - Palabra técnica o especializada
               - Concepto (por pequeño que sea)
               - Definición
               - Nombre propio
               - Fecha o número importante
               - Hecho o dato
               - Ejemplo
               - Relación entre conceptos
               - Aplicación o uso
               - Característica o propiedad
               - Proceso o paso
               - Causa y efecto
            
            2. DIVISIÓN OBLIGATORIA:
               - Si una oración contiene múltiples conceptos, DEBES crear múltiples flashcards
               - Si un párrafo menciona varios temas, DEBES crear flashcards separadas para cada uno
               - Si hay una lista o enumeración, DEBES crear flashcards individuales para cada elemento
            
            3. MAXIMIZACIÓN:
               - Es mejor crear 20 flashcards específicas que 5 generales
               - No hay límite superior - crea tantas como sea posible
               - Si dudas entre crear una flashcard o no, CRÉALA
               - Busca incluso los detalles más pequeños para crear flashcards
               
            4. FORMATO DE RESPUESTA:
               - Responde SOLO con un JSON que contenga un array llamado "flashcards"
               - Cada flashcard debe tener "front" y "back"
               - No incluyas ningún otro texto o explicación
               - Ejemplo exacto del formato:
                 {"flashcards": [{"front": "pregunta 1", "back": "respuesta 1"}, ...]}`
          },
          {
            role: "user",
            content: `INSTRUCCIÓN: Analiza minuciosamente este texto y crea el MÁXIMO número de flashcards posible.
            Quiero que extraigas cada pequeño detalle y lo conviertas en una flashcard.
            Responde SOLO con el JSON de flashcards, sin ningún otro texto.
            
            TEXTO: ${chunks[i]}`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      });

      try {
        // Asegurarnos de que la respuesta es un JSON válido
        const responseText = response?.choices?.[0]?.message?.content?.trim() ?? '';
        if (!responseText) {
          throw new Error('No se recibió una respuesta válida de OpenAI');
        }
        
        const result = JSON.parse(responseText);
        
        if (result && result.flashcards && Array.isArray(result.flashcards)) {
          console.log(`✓ Chunk ${i + 1}: Generadas ${result.flashcards.length} flashcards`);
          allFlashcards.push(...result.flashcards);
        } else {
          console.error('Formato de respuesta inválido:', responseText);
          throw new Error('Formato de respuesta inválido');
        }
      } catch (error) {
        console.error('Error al procesar la respuesta de OpenAI:', error);
        console.error('Respuesta recibida:', response.choices[0]?.message?.content);
        throw error;
      }

      // Esperar un poco entre llamadas para evitar límites de rate
      if (i < chunks.length - 1) {
        console.log(`Esperando antes de procesar el siguiente chunk...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`=== Resumen ===`);
    console.log(`Total de chunks procesados: ${chunks.length}`);
    console.log(`Total de flashcards generadas: ${allFlashcards.length}`);
    console.log(`Promedio de flashcards por chunk: ${(allFlashcards.length / chunks.length).toFixed(2)}`);
    return NextResponse.json({ flashcards: allFlashcards });

  } catch (error) {
    console.error('Error detallado al generar flashcards:', error);
    return NextResponse.json(
      { error: 'Error al procesar el PDF y generar flashcards', details: error.message },
      { status: 500 }
    );
  }
}
