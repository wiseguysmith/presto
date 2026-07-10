// Visual identity for dishes while Phase 1 runs without food photography.
// Keyword-matched emoji + category-tinted gradient tiles keep the menu
// looking designed instead of empty.

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
  starters: 'from-amber-100 to-orange-200',
  bowls: 'from-lime-100 to-emerald-200',
  tacos: 'from-orange-100 to-red-200',
  seafood: 'from-sky-100 to-cyan-200',
  smoothies: 'from-fuchsia-100 to-purple-200',
  coffee: 'from-orange-100 to-amber-300',
}

const DEFAULT_TILE = 'from-pink-100 to-rose-200'

export function emojiForItem(itemName: string, categorySlug?: string): string {
  for (const [pattern, emoji] of EMOJI_RULES) {
    if (pattern.test(itemName)) return emoji
  }
  if (categorySlug && CATEGORY_EMOJI[categorySlug]) return CATEGORY_EMOJI[categorySlug]
  return '🦩'
}

export function tileForCategory(categorySlug?: string): string {
  if (categorySlug && CATEGORY_TILE[categorySlug]) return CATEGORY_TILE[categorySlug]
  return DEFAULT_TILE
}
