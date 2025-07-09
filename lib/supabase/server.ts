import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStorePromise = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name: string) => {
          const cookieStore = await cookieStorePromise
          return cookieStore.get(name)?.value
        },
        set: async (name: string, value: string, options: any) => {
          const cookieStore = await cookieStorePromise
          cookieStore.set({ name, value, ...options })
        },
        remove: async (name: string, options: any) => {
          const cookieStore = await cookieStorePromise
          cookieStore.delete({ name, ...options })
        },
      },
    }
  )
}