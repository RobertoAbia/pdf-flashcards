'use client';

import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  title: string;
  backUrl?: string;
  rightContent?: React.ReactNode;
}

export default function Header({ title, backUrl = '/units', rightContent }: HeaderProps) {
  const pathname = usePathname();
  const isUnitsPage = pathname === '/units';

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center">
        {!isUnitsPage && (
          <Link
            href={backUrl}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors mr-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Volver
          </Link>
        )}
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>
      {rightContent}
    </div>
  );
}
