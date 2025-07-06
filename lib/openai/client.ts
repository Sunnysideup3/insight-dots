import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateTags(content: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Generate 3-5 relevant tags for the given content. Return only the tags as a comma-separated list.'
        },
        {
          role: 'user',
          content: content
        }
      ],
      temperature: 0.5,
      max_tokens: 50,
    })

    const tags = response.choices[0]?.message?.content?.split(',').map(tag => tag.trim()) || []
    return tags
  } catch (error) {
    console.error('Error generating tags:', error)
    return []
  }
}