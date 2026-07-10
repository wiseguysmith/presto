// Visual identity for dishes while the menu is not yet using food photography.
// Keyword-matched emoji and category-tinted tiles keep the menu warm and lively.

const EMOJI_RULES: Array<[RegExp, string]> = [
  [/guac|avocado/i, '🥑'],
  [/shrimp|prawn/i, '🦐'],
  [/mahi|snapper|grilled fish/i, '🐠'],
  [/tuna/i, '🐟'],
  [/taco/i, '🌮'],
  [/mango/i, '🥭'],
  [/coconut/i, '🥥'],
  [/green|detox|spinach/i, '🥬'],
  [/coffee|brew|espresso|latte/i, '☕'],
  [/tropical|pineapple/i, '🍍'],
  [/casado|vegan|salad|veggie/i, '🥗'],
  [/chicken/i, '🍗'],
  [/smoothie|juice/i, '🍹'],
  [/ceviche|seafood/i, '🦞'],
  [/burger/i, '🍔'],
  [/pizza/i, '🍕'],
  [/dessert|cake|flan/i, '🍰'],
]

const CATEGORY_EMOJI: Record<string, string> = {
  starters: '🥑',
  bowls: '🥗',
  tacos: '🌮',
  seafood: '🦐',
  smoothies: '🍹',
  coffee: '☕',
}

const CATEGORY_TILE: Record<string, string> = {
  starters: 'from-[#ffe1ae] to-[#f7b782]',
  bowls: 'from-[#d8efc7] to-[#a9d7bb]',
  tacos: 'from-[#ffd4aa] to-[#f58d79]',
  seafood: 'from-[#cbeee9] to-[#9bcfd0]',
  smoothies: 'from-[#f7c8d6] to-[#f5a8a4]',
  coffee: 'from-[#efd6b5] to-[#d7a675]',
}

const DEFAULT_TILE = 'from-[#ffe0d0] to-[#f4a9a5]'

export function emojiForItem(itemName: string, categorySlug?: string): string {
  for (const [pattern, emoji] of EMOJI_RULES) {
    if (pattern.test(itemName)) return emoji
  }
  if (categorySlug && CATEGORY_EMOJI[categorySlug]) return CATEGORY_EMOJI[categorySlug]
  return '🌴'
}

export function tileForCategory(categorySlug?: string): string {
  if (categorySlug && CATEGORY_TILE[categorySlug]) return CATEGORY_TILE[categorySlug]
  return DEFAULT_TILE
}
