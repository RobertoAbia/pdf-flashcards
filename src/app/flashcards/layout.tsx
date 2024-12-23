import AuthenticatedLayout from '@/components/AuthenticatedLayout'

export default function FlashcardsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthenticatedLayout path="/flashcards">
      {children}
    </AuthenticatedLayout>
  )
}
