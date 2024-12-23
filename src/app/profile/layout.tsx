import AuthenticatedLayout from '@/components/AuthenticatedLayout'

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthenticatedLayout path="/profile">
      {children}
    </AuthenticatedLayout>
  )
}
