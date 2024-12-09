'use client';

import { usePathname } from 'next/navigation';

export const HeaderTitle = () => {
  const pathname = usePathname();

  const getTitleContent = () => {
    switch (pathname) {
      case '/':
        return {
          title: '¡Bienvenido!',
          subtitle: 'Comienza tu sesión de estudio'
        };
      case '/flashcards':
        return {
          title: 'Unidades de Estudio',
          subtitle: 'Gestiona tus unidades de estudio'
        };
      case '/pomodoro':
        return {
          title: 'Temporizador Pomodoro',
          subtitle: 'Gestiona tu tiempo de estudio'
        };
      case '/profile':
        return {
          title: 'Mi Perfil',
          subtitle: 'Gestiona tu información personal'
        };
      default:
        return null;
    }
  };

  const content = getTitleContent();
  
  if (!content) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold">{content.title}</h1>
      <p className="text-gray-600">{content.subtitle}</p>
    </div>
  );
};
