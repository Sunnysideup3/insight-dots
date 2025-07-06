'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function TestSupabase() {
  const [connected, setConnected] = useState<boolean | null>(null)
  
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('notes').select('count')
        if (error && error.code !== 'PGRST116') {
          // PGRST116는 테이블이 비어있을 때 나는 에러
          throw error
        }
        setConnected(true)
      } catch (error) {
        console.error('Supabase connection error:', error)
        setConnected(false)
      }
    }
    
    checkConnection()
  }, [])
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      {connected === null && <p>Checking connection...</p>}
      {connected === true && (
        <p className="text-green-600">✅ Successfully connected to Supabase!</p>
      )}
      {connected === false && (
        <p className="text-red-600">❌ Failed to connect. Check your environment variables.</p>
      )}
    </div>
  )
}