'use client';

import Link from 'next/link'
import { useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        console.log('No hay sesión, mostrando landing page')
      } else {
        console.log('Sesión detectada, redirigiendo a /dashboard')
        await router.replace('/dashboard')
      }
    }
    checkSession()
  }, [router, supabase])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Aprende más rápido con</span>
                  <span className="block text-indigo-600">PDF Flashcards</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Convierte cualquier PDF en tarjetas de estudio inteligentes. Optimiza tu aprendizaje y mejora tu retención con nuestra tecnología de IA.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link href="/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                      Comenzar gratis
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link href="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                      Iniciar sesión
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Características</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Una mejor manera de estudiar
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Descubre por qué PDF Flashcards es la herramienta perfecta para optimizar tu aprendizaje.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Feature 1 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Conversión Instantánea</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Sube tu PDF y obtén tarjetas de estudio generadas automáticamente con IA en segundos.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Aprendizaje Personalizado</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Sistema de repaso espaciado que se adapta a tu ritmo de aprendizaje.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Organización Inteligente</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Organiza tus tarjetas por temas y dificultad para un estudio más eficiente.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Sincronización Automática</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Accede a tus tarjetas desde cualquier dispositivo y continúa donde lo dejaste.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">¿Listo para empezar?</span>
            <span className="block text-indigo-600">Crea tu cuenta gratuita hoy.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/signup" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Comenzar ahora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
