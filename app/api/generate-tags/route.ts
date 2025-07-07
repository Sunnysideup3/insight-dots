import { NextResponse } from 'next/server'
import { generateTags } from '@/lib/openai/client'

export async function POST(request: Request) {
  try {
    const { content } = await request.json()
    const tags = await generateTags(content)
    return NextResponse.json({ tags })
  } catch (error) {
    console.error('Generate tags error:', error)
    return NextResponse.json({ tags: [] }, { status: 500 })
  }
}