'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, usePathname } from 'next/navigation'

interface SupabaseContextType {
  user: User | null
  loading: boolean
}

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  loading: true,
})

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Verificar el usuario actual
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error checking user:', error)
      } finally {
        setLoading(false)
      }
    }

    // Suscribirse a cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Solo redirigir a /flashcards si estamos en una página de autenticación
      if (event === 'SIGNED_IN' && (pathname === '/login' || pathname === '/signup' || pathname === '/')) {
        router.push('/flashcards')
      }
      
      // Si el usuario cierra sesión y no está en una página pública, redirigir a login
      if (event === 'SIGNED_OUT' && pathname !== '/login' && pathname !== '/signup') {
        router.push('/login')
      }
    })

    checkUser()

    return () => {
      subscription.unsubscribe()
    }
  }, [router, pathname])

  useEffect(() => {
    const auth = supabase.auth;
    const {
      data: { subscription },
    } = auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <SupabaseContext.Provider value={{ user, loading }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}
