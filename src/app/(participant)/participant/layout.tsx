import ParticipantSidebar from '@/components/nav/ParticipantSidebar'

export default function ParticipantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <ParticipantSidebar />
        <main className="flex-1 bg-gray-50 overflow-y-auto">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
