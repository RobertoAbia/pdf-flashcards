"use client";

import { HomeIcon, ClockIcon, BookOpenIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Inicio',
      icon: HomeIcon,
      href: '/',
    },
    {
      name: 'Unidades',
      icon: BookOpenIcon,
      href: '/flashcards',
    },
    {
      name: 'Pomodoro',
      icon: ClockIcon,
      href: '/pomodoro',
    },
    {
      name: 'Perfil',
      icon: UserCircleIcon,
      href: '/profile',
    },
  ];

  return (
    <div className="w-64 bg-white h-screen shadow-sm fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">PDF Flashcards</h1>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
