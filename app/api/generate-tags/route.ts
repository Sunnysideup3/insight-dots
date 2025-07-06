import { NextResponse } from 'next/server'
import { generateTags } from '@/lib/openai/client'

export async function POST(request: Request) {
  const { content } = await request.json()
  const tags = await generateTags(content)
  return NextResponse.json({ tags })
}