import AuthenticatedLayout from '@/components/AuthenticatedLayout'

export default function UnitsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthenticatedLayout path="/units">
      {children}
    </AuthenticatedLayout>
  )
}
