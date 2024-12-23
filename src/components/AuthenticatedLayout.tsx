'use client';

import Sidebar from './Sidebar';
import dynamic from 'next/dynamic';

const MiniTimer = dynamic(() => import('./MiniTimer'), {
  ssr: false,
});

interface PageHeader {
  title: string;
  subtitle?: string;
  icon?: string;
}

const pageHeaders: Record<string, PageHeader> = {
  '/units': {
    title: 'Unidades de Estudio',
    subtitle: 'Gestiona y estudia tus tarjetas de memoria',
    icon: '📚'
  },
  '/profile': {
    title: 'Perfil de Usuario',
    subtitle: 'Gestiona tu información personal',
    icon: '👤'
  },
  '/pomodoro': {
    title: 'Temporizador Pomodoro',
    subtitle: 'Gestiona tu tiempo de estudio',
    icon: '⏱️'
  }
};

export default function AuthenticatedLayout({
  children,
  path
}: {
  children: React.ReactNode;
  path: string;
}) {
  const header = pageHeaders[path] || { title: 'PDF Flashcards' };
  const showMiniTimer = path !== '/pomodoro';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="h-20 border-b bg-white flex items-center justify-between px-8">
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              {header.icon && <span className="text-3xl">{header.icon}</span>}
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{header.title}</h1>
                {header.subtitle && (
                  <p className="text-sm text-gray-600">{header.subtitle}</p>
                )}
              </div>
            </div>
          </div>
          {showMiniTimer && (
            <div className="flex items-center gap-4">
              <MiniTimer />
            </div>
          )}
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
