'use server'

import { revalidatePath } from 'next/cache'
import { demoRestaurant, isDemoMode } from '@/lib/demoData'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function createFeedback(formData: FormData) {
  const orderId = String(formData.get('orderId') || '')
  const rating = Number(formData.get('rating') || 0)
  const feedbackText = String(formData.get('feedbackText') || '').trim()
  const wantsFollowUp = formData.get('wantsFollowUp') === 'on'

  if (!orderId || rating < 1 || rating > 5) {
    return
  }

  if (isDemoMode() || orderId.startsWith('DEMO-')) {
    revalidatePath(`/feedback/${orderId}`)
    return
  }

  const supabase = getSupabaseServerClient()
  const { data: order } = await supabase.from('orders').select('restaurant_id').eq('id', orderId).single()
  const restaurantId = (order as { restaurant_id?: string } | null)?.restaurant_id || demoRestaurant.id

  const { error } = await supabase.from('order_feedback').insert([
    {
      order_id: orderId,
      restaurant_id: restaurantId,
      rating,
      feedback_text: feedbackText || null,
      wants_follow_up: wantsFollowUp,
    } as never,
  ])

  if (error) {
    console.error('Error saving feedback:', error)
    return
  }

  revalidatePath(`/feedback/${orderId}`)
}
