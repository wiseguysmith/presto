'use client'

import { useEffect, useRef } from 'react'
import { MenuCategory } from '@/types'

interface CategoryTabsProps {
  categories: MenuCategory[]
  activeCategory: string | null
  onCategorySelect: (categoryId: string) => void
}

export function CategoryTabs({ categories, activeCategory, onCategorySelect }: CategoryTabsProps) {
  const navRef = useRef<HTMLDivElement>(null)

  // Keep the active pill in view as scroll-spy updates it
  useEffect(() => {
    if (!activeCategory || !navRef.current) return
    const pill = navRef.current.querySelector<HTMLButtonElement>(`[data-category="${activeCategory}"]`)
    pill?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [activeCategory])

  if (categories.length === 0) return null

  return (
    <div
      ref={navRef}
      className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-3 sm:px-6 lg:px-8"
      role="tablist"
      aria-label="Menu categories"
    >
      {categories.map((category) => {
        const isActive = activeCategory === category.id
        return (
          <button
            key={category.id}
            data-category={category.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onCategorySelect(category.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all active:scale-95 ${
              isActive
                ? 'bg-stone-950 text-white shadow-lg shadow-stone-950/20'
                : 'border border-stone-200 bg-white text-stone-600 hover:border-pink-300 hover:text-stone-950'
            }`}
          >
            {category.name}
          </button>
        )
      })}
    </div>
  )
}
