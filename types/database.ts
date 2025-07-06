export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  position_x: number
  position_y: number
  color: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Connection {
  id: string
  user_id: string
  source_note_id: string
  target_note_id: string
  strength: number
  created_at: string
}

export interface User {
  id: string
  email: string
  created_at: string
}