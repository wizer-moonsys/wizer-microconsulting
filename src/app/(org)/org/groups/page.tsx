'use client'

import { useState } from 'react'
import { Users, Pencil, Trash2, Plus, X, Check } from 'lucide-react'

interface Group {
  id: number
  name: string
  members: number
  description: string
}

const INITIAL_GROUPS: Group[] = [
  { id: 1, name: 'Sydney Metro Community', members: 14, description: 'Members based in the Greater Sydney metropolitan area.' },
  { id: 2, name: 'Remote & Regional', members: 8, description: 'Members from rural and remote NSW communities.' },
  { id: 3, name: 'Elders & Knowledge Holders', members: 6, description: 'Senior community members and traditional knowledge holders.' },
  { id: 4, name: 'Youth Voices', members: 5, description: 'Community members aged 18–30 representing younger perspectives.' },
  { id: 5, name: 'Bundjalung Mob', members: 7, description: 'Community members from Bundjalung country (Northern NSW).' },
  { id: 6, name: 'Gamilaraay Network', members: 4, description: 'Community members from Gamilaraay and Yuwaalaraay country.' },
]

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')

  function startEdit(group: Group) {
    setEditingId(group.id)
    setEditName(group.name)
  }

  function saveEdit(id: number) {
    if (editName.trim()) {
      setGroups(prev => prev.map(g => g.id === id ? { ...g, name: editName.trim() } : g))
    }
    setEditingId(null)
  }

  function deleteGroup(id: number) {
    setGroups(prev => prev.filter(g => g.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
          <p className="text-sm text-gray-500 mt-1">Organise your community into groups for easier panel management.</p>
        </div>
        <button
          className="flex items-center gap-1.5 text-xs text-white px-3 py-2 rounded-lg font-medium transition-colors"
          style={{ backgroundColor: '#7b69af' }}
        >
          <Plus className="w-3.5 h-3.5" /> New Group
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map(group => (
          <div key={group.id} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col hover:shadow-sm transition-shadow">
            {/* Header row */}
            <div className="flex items-start justify-between gap-2 mb-3">
              {editingId === group.id ? (
                <div className="flex items-center gap-1 flex-1">
                  <input
                    autoFocus
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') saveEdit(group.id); if (e.key === 'Escape') setEditingId(null) }}
                    className="flex-1 text-sm font-semibold text-gray-900 border border-wizer-purple rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-wizer-purple/20"
                  />
                  <button onClick={() => saveEdit(group.id)} className="text-green-500 hover:text-green-600 p-0.5">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600 p-0.5">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="font-semibold text-gray-900 text-sm leading-snug flex-1">{group.name}</p>
              )}

              {editingId !== group.id && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(group)}
                    className="p-1 rounded text-gray-400 hover:text-wizer-purple hover:bg-wizer-purple-light transition-colors"
                    title="Edit group name"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteGroup(group.id)}
                    className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete group"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Member count */}
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
              <Users className="w-4 h-4 text-wizer-purple-mid" />
              <span>{group.members} members</span>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-400 leading-relaxed flex-1 mb-4">{group.description}</p>

            {/* Add/Remove members */}
            <button className="w-full border border-dashed border-gray-300 hover:border-wizer-purple text-gray-500 hover:text-wizer-purple text-xs font-medium py-2 rounded-lg transition-colors">
              + Add Member or Remove Member
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
