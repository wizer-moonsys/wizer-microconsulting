import OrgSidebar from '@/components/nav/OrgSidebar'

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <OrgSidebar />
      <main className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
