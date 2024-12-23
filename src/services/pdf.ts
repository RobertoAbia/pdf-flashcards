export async function processPdf(file: File): Promise<Array<{ front: string; back: string }>> {
  try {
    console.log('Iniciando procesamiento del PDF...');
    const formData = new FormData();
    formData.append('pdf', file);
    console.log('Archivo adjuntado al FormData');

    console.log('Enviando solicitud a /api/generate-flashcards...');
    const response = await fetch('/api/generate-flashcards', {
      method: 'POST',
      body: formData,
    });

    console.log('Respuesta recibida:', response.status);
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error del servidor:', errorData);
      throw new Error(`Error del servidor: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log('Datos recibidos:', data);
    
    if (!data.flashcards || !Array.isArray(data.flashcards)) {
      console.error('Formato de respuesta inválido:', data);
      throw new Error('Formato de respuesta inválido');
    }

    return data.flashcards;
  } catch (error) {
    console.error('Error detallado al procesar el PDF:', error);
    throw error;
  }
}
