'use server'

import { revalidatePath } from 'next/cache'
import { isDemoMode } from '@/lib/demoData'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function updateMenuItemAvailability(formData: FormData) {
  const itemId = String(formData.get('itemId') || '')
  const available = formData.get('available') === 'true'

  if (!itemId) return

  if (isDemoMode()) {
    return
  }

  const supabase = getSupabaseServerClient()
  const { error } = await supabase
    .from('menu_items')
    .update({ available, updated_at: new Date().toISOString() } as never)
    .eq('id', itemId)

  if (error) {
    console.error('Error updating item availability:', error)
    return
  }

  revalidatePath('/admin/menu')
  revalidatePath('/menu/pink-flamingo/table/1')
}
