'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ShoppingBag, CheckCircle, Tag } from 'lucide-react'

const BALANCE = 145.00

const CATEGORIES = ['All', 'Travel', 'Gift Cards', 'Experiences', 'Wellness']

const PRODUCTS = [
  // Travel
  {
    id: 'p1',
    category: 'Travel',
    partner: 'Qantas Store',
    partnerLogo: 'Q',
    partnerColor: '#E2231A',
    name: '$50 Qantas Store Voucher',
    description: 'Redeem against flights, upgrades, hotels, or Qantas Frequent Flyer Points.',
    price: 50,
    popular: true,
  },
  {
    id: 'p2',
    category: 'Travel',
    partner: 'Qantas Store',
    partnerLogo: 'Q',
    partnerColor: '#E2231A',
    name: '$100 Qantas Store Voucher',
    description: 'Redeem against flights, upgrades, hotels, or Qantas Frequent Flyer Points.',
    price: 100,
    popular: false,
  },
  {
    id: 'p3',
    category: 'Travel',
    partner: 'Airbnb',
    partnerLogo: 'A',
    partnerColor: '#FF5A5F',
    name: '$75 Airbnb Credit',
    description: 'Use towards any Airbnb stay or experience worldwide.',
    price: 75,
    popular: false,
  },
  // Gift Cards
  {
    id: 'p4',
    category: 'Gift Cards',
    partner: 'Woolworths',
    partnerLogo: 'W',
    partnerColor: '#00833e',
    name: '$50 Woolworths Gift Card',
    description: 'Accepted at all Woolworths supermarkets across Australia.',
    price: 50,
    popular: true,
  },
  {
    id: 'p5',
    category: 'Gift Cards',
    partner: 'Coles',
    partnerLogo: 'C',
    partnerColor: '#e2001a',
    name: '$50 Coles Gift Card',
    description: 'Use in-store or online at Coles supermarkets and Coles Express.',
    price: 50,
    popular: false,
  },
  {
    id: 'p6',
    category: 'Gift Cards',
    partner: 'Amazon',
    partnerLogo: 'a',
    partnerColor: '#FF9900',
    name: '$25 Amazon Gift Card',
    description: 'Shop millions of products on Amazon.com.au.',
    price: 25,
    popular: false,
  },
  // Experiences
  {
    id: 'p7',
    category: 'Experiences',
    partner: 'RedBalloon',
    partnerLogo: 'R',
    partnerColor: '#e63238',
    name: '$100 RedBalloon Experience',
    description: 'Choose from thousands of experiences — cooking classes, adventures, spa days and more.',
    price: 100,
    popular: true,
  },
  {
    id: 'p8',
    category: 'Experiences',
    partner: 'Event Cinemas',
    partnerLogo: 'E',
    partnerColor: '#1a1a2e',
    name: 'Cinema Double Pass',
    description: '2 general admission tickets at any Event Cinemas location.',
    price: 40,
    popular: false,
  },
  // Wellness
  {
    id: 'p9',
    category: 'Wellness',
    partner: 'Endota Spa',
    partnerLogo: 'e',
    partnerColor: '#7b8b6f',
    name: '$80 Endota Spa Voucher',
    description: 'Redeem towards any treatment or product at Endota Spa locations.',
    price: 80,
    popular: false,
  },
  {
    id: 'p10',
    category: 'Wellness',
    partner: 'Headspace',
    partnerLogo: 'H',
    partnerColor: '#f47d31',
    name: '1-Year Headspace Plus',
    description: 'Full access to the Headspace meditation and mindfulness app for 12 months.',
    price: 60,
    popular: false,
  },
]

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [confirming, setConfirming] = useState<string | null>(null)
  const [redeemed, setRedeemed] = useState<string[]>([])

  const filtered = activeCategory === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory)

  function handleRedeem(productId: string) {
    setConfirming(productId)
  }

  function confirmRedeem(productId: string) {
    setRedeemed(prev => [...prev, productId])
    setConfirming(null)
  }

  const spentTotal = redeemed.reduce((sum, id) => {
    const p = PRODUCTS.find(p => p.id === id)
    return sum + (p?.price ?? 0)
  }, 0)
  const remaining = BALANCE - spentTotal

  return (
    <div>
      {/* Back link */}
      <Link href="/participant" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5">
        <ChevronLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag className="w-5 h-5 text-wizer-purple" />
            <h1 className="text-xl font-bold text-gray-900">Wizer Rewards Shop</h1>
          </div>
          <p className="text-sm text-gray-500">Spend your Wizer credits with our partner brands.</p>
        </div>
        {/* Balance card */}
        <div className="shrink-0 bg-white border border-gray-200 rounded-xl px-5 py-3 text-right">
          <p className="text-xs text-gray-400 mb-0.5">Available credits</p>
          <p className="text-2xl font-bold text-gray-900">${remaining.toFixed(2)}</p>
          {spentTotal > 0 && (
            <p className="text-xs text-green-600 mt-0.5">${spentTotal.toFixed(2)} redeemed this session</p>
          )}
        </div>
      </div>

      {/* Partner banner */}
      <div className="bg-gradient-to-r from-wizer-purple-light to-white border border-wizer-purple-light rounded-xl px-5 py-3.5 mb-6 flex items-center gap-3">
        <Tag className="w-4 h-4 text-wizer-purple shrink-0" />
        <p className="text-sm text-wizer-purple-dark">
          <strong>Partner integration active</strong> — credits transfer directly to your chosen partner account at checkout. No cash value.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeCategory === cat
                ? 'text-white border-transparent'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
            style={activeCategory === cat ? { backgroundColor: '#7b69af', borderColor: '#7b69af' } : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(product => {
          const isRedeemed = redeemed.includes(product.id)
          const canAfford = product.price <= remaining
          const isConfirming = confirming === product.id

          return (
            <div
              key={product.id}
              className={`bg-white rounded-xl border overflow-hidden flex flex-col transition-shadow hover:shadow-sm ${
                isRedeemed ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}
            >
              {/* Partner header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ backgroundColor: product.partnerColor }}
                >
                  {product.partnerLogo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate">{product.partner}</p>
                  {product.popular && (
                    <span className="text-xs text-wizer-purple font-medium">Popular</span>
                  )}
                </div>
                <p className="text-sm font-bold text-gray-900 shrink-0">${product.price}</p>
              </div>

              {/* Content */}
              <div className="px-4 py-3 flex-1">
                <p className="text-sm font-semibold text-gray-900 mb-1">{product.name}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{product.description}</p>
              </div>

              {/* Action */}
              <div className="px-4 pb-4">
                {isRedeemed ? (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" /> Redeemed — check your email
                  </div>
                ) : isConfirming ? (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600">
                      Spend <strong>${product.price}</strong> credits on <strong>{product.name}</strong>?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => confirmRedeem(product.id)}
                        className="flex-1 text-white text-xs font-medium py-1.5 rounded-lg transition-colors"
                        style={{ backgroundColor: '#7b69af' }}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirming(null)}
                        className="flex-1 text-gray-600 text-xs font-medium py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRedeem(product.id)}
                    disabled={!canAfford}
                    className={`w-full text-sm font-medium py-2 rounded-lg transition-colors ${
                      canAfford
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    style={canAfford ? { backgroundColor: '#7b69af' } : {}}
                  >
                    {canAfford ? `Redeem — $${product.price}` : 'Insufficient credits'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-gray-400 text-center mt-8">
        Wizer Rewards is a simulated integration. In production, voucher codes are delivered via email from each partner.
      </p>
    </div>
  )
}
