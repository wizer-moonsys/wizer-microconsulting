import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Wizer</h1>
          <p className="mt-2 text-gray-500">Microconsulting Platform — Dev Preview</p>
        </div>

        <p className="text-sm text-gray-500 text-center mb-6">View as role:</p>

        <div className="space-y-3">
          <Link href="/admin" className="flex items-center justify-between w-full bg-white border-2 border-purple-200 hover:border-purple-500 rounded-xl p-4 transition-colors group">
            <div>
              <p className="font-semibold text-gray-900">Super Admin</p>
              <p className="text-sm text-gray-500">Wizer staff — manage all engagements</p>
            </div>
            <span className="text-purple-400 group-hover:text-purple-600">→</span>
          </Link>

          <Link href="/org" className="flex items-center justify-between w-full bg-white border-2 border-blue-200 hover:border-blue-500 rounded-xl p-4 transition-colors group">
            <div>
              <p className="font-semibold text-gray-900">Org Admin</p>
              <p className="text-sm text-gray-500">Tranby / partner org — manage panels</p>
            </div>
            <span className="text-blue-400 group-hover:text-blue-600">→</span>
          </Link>

          <Link href="/client" className="flex items-center justify-between w-full bg-white border-2 border-gray-200 hover:border-gray-400 rounded-xl p-4 transition-colors group">
            <div>
              <p className="font-semibold text-gray-900">Client</p>
              <p className="text-sm text-gray-500">Study commissioner — submit & view results</p>
            </div>
            <span className="text-gray-400 group-hover:text-gray-600">→</span>
          </Link>

          <Link href="/participant" className="flex items-center justify-between w-full bg-white border-2 border-teal-200 hover:border-teal-500 rounded-xl p-4 transition-colors group">
            <div>
              <p className="font-semibold text-gray-900">Participant</p>
              <p className="text-sm text-gray-500">Community member — answer & earn</p>
            </div>
            <span className="text-teal-400 group-hover:text-teal-600">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
