import { MenuCategory } from '@/types'

interface CategoryTabsProps {
  categories: MenuCategory[]
  activeCategory: string | null
  onCategoryChange: (categoryId: string) => void
}

export function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  if (categories.length === 0) {
    return null
  }

  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-4 bg-white border-b sticky top-0 z-10">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
            activeCategory === category.id
              ? 'bg-pink-500 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
