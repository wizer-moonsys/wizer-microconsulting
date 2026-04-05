'use client'

import { useState } from 'react'
import { Users, Pencil, Trash2, Plus, X, Check } from 'lucide-react'

interface Panel {
  id: number
  name: string
  members: number
  description: string
  type: 'our' | 'funded'
}

const INITIAL_PANELS: Panel[] = [
  { id: 1, name: 'Elders & Knowledge Holders', members: 6, description: 'Senior community members and traditional knowledge holders available for culturally sensitive engagements.', type: 'our' },
  { id: 2, name: 'Sydney Metro Community', members: 14, description: 'Panel of First Nations community members with lived experience in the Greater Sydney metropolitan area.', type: 'our' },
  { id: 3, name: 'Remote & Regional', members: 8, description: 'Community voices from rural and remote NSW — providing perspectives beyond major centres.', type: 'our' },
  { id: 4, name: 'Transport Infrastructure Futures', members: 9, description: 'Curated panel for Infrastructure NSW engagement — Transport Infrastructure Futures study.', type: 'funded' },
]

const TABS = ['Our Panels', 'Funded Panels'] as const
type TabType = typeof TABS[number]

export default function OrgPanelsPage() {
  const [panels, setPanels] = useState<Panel[]>(INITIAL_PANELS)
  const [activeTab, setActiveTab] = useState<TabType>('Our Panels')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')

  const filtered = panels.filter(p => activeTab === 'Our Panels' ? p.type === 'our' : p.type === 'funded')

  function startEdit(panel: Panel) {
    setEditingId(panel.id)
    setEditName(panel.name)
  }

  function saveEdit(id: number) {
    if (editName.trim()) {
      setPanels(prev => prev.map(p => p.id === id ? { ...p, name: editName.trim() } : p))
    }
    setEditingId(null)
  }

  function deletePanel(id: number) {
    setPanels(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panels</h1>
          <p className="text-sm text-gray-500 mt-1">Curated panels of community members ready for paid study engagements.</p>
        </div>
        {activeTab === 'Our Panels' && (
          <button
            className="flex items-center gap-1.5 text-xs text-white px-3 py-2 rounded-lg font-medium transition-colors"
            style={{ backgroundColor: '#7b69af' }}
          >
            <Plus className="w-3.5 h-3.5" /> New Panel
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
            {tab === 'Funded Panels' && panels.filter(p => p.type === 'funded').length > 0 && (
              <span className="ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-full bg-wizer-purple-light text-wizer-purple">
                {panels.filter(p => p.type === 'funded').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      {activeTab === 'Funded Panels' && (
        <p className="text-xs text-gray-400 mb-4">Funded panels are created automatically when a client engagement is accepted and a panel is curated.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-3 bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No {activeTab.toLowerCase()} yet.</p>
          </div>
        )}

        {filtered.map(panel => (
          <div key={panel.id} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col hover:shadow-sm transition-shadow">
            {/* Header row */}
            <div className="flex items-start justify-between gap-2 mb-3">
              {editingId === panel.id ? (
                <div className="flex items-center gap-1 flex-1">
                  <input
                    autoFocus
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') saveEdit(panel.id); if (e.key === 'Escape') setEditingId(null) }}
                    className="flex-1 text-sm font-semibold text-gray-900 border border-wizer-purple rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-wizer-purple/20"
                  />
                  <button onClick={() => saveEdit(panel.id)} className="text-green-500 hover:text-green-600 p-0.5">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600 p-0.5">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="font-semibold text-gray-900 text-sm leading-snug flex-1">{panel.name}</p>
              )}

              {editingId !== panel.id && panel.type === 'our' && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(panel)}
                    className="p-1 rounded text-gray-400 hover:text-wizer-purple hover:bg-wizer-purple-light transition-colors"
                    title="Edit panel name"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deletePanel(panel.id)}
                    className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete panel"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {editingId !== panel.id && panel.type === 'funded' && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 shrink-0">Live</span>
              )}
            </div>

            {/* Member count */}
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
              <Users className="w-4 h-4 text-wizer-purple-mid" />
              <span>{panel.members} members</span>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-400 leading-relaxed flex-1 mb-4">{panel.description}</p>

            {/* Action button */}
            {panel.type === 'our' ? (
              <button className="w-full border border-dashed border-gray-300 hover:border-wizer-purple text-gray-500 hover:text-wizer-purple text-xs font-medium py-2 rounded-lg transition-colors">
                + Add Member or Remove Member
              </button>
            ) : (
              <button className="w-full border border-dashed border-gray-300 hover:border-green-400 text-gray-500 hover:text-green-600 text-xs font-medium py-2 rounded-lg transition-colors">
                View responses →
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
