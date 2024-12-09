let audioContext: AudioContext | null = null;

export const playNotificationSound = async () => {
  try {
    // Crear AudioContext solo cuando se necesite (para cumplir con las políticas de autoplay)
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Usar un beep simple generado por código en lugar de un archivo de audio
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Configurar el sonido
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // frecuencia en Hz
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // volumen bajo

    // Programar el sonido
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1); // duración de 100ms

    // Fade out
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    return true;
  } catch (error) {
    console.warn('Error al reproducir el sonido:', error);
    return false;
  }
};
