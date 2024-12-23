import AuthenticatedLayout from '@/components/AuthenticatedLayout'

export default function PomodoroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthenticatedLayout path="/pomodoro">
      {children}
    </AuthenticatedLayout>
  )
}
