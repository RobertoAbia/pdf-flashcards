'use client'

import { useSupabase } from "@/components/providers/SupabaseProvider"
import { AuthForm } from "./AuthForm"
import Sidebar from "../Sidebar"
import { HeaderTitle } from "../HeaderTitle"
import { TimerWrapper } from "../TimerWrapper"

export default function AuthContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSupabase()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64">
        <header className="h-20 border-b bg-white flex items-center justify-between px-4 pt-2">
          <HeaderTitle />
          <TimerWrapper />
        </header>
        {children}
      </main>
    </div>
  )
}
