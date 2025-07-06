import { createRouteHandlerClient } from '@supabase/ssr'
import { NextApiRequest, NextApiResponse } from 'next'

export function createServerClient(req: NextApiRequest, res: NextApiResponse) {
  return createRouteHandlerClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    cookies: req.cookies,
    headers: req.headers as any, // 필요시
  })
}
