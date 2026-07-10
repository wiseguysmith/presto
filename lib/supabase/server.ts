import { createClient } from '@supabase/supabase-js'

let supabaseServer: ReturnType<typeof createClient> | null = null

export function getSupabaseServerClient() {
  if (supabaseServer) return supabaseServer

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase server credentials not configured')
  }

  supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
    },
  })

  return supabaseServer
}
