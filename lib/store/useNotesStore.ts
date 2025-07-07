import { create } from 'zustand'
import { supabase } from '@/lib/supabase/client'

interface Note {
  id: string
  title: string
  content: string
  position_x: number
  position_y: number
  color: string
  tags: string[]
}

interface NotesStore {
  notes: Note[]
  selectedNote: Note | null
  fetchNotes: () => Promise<void>
  createNote: (note: Partial<Note>) => Promise<void>
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  setSelectedNote: (note: Note | null) => void
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: [],
  selectedNote: null,

  fetchNotes: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        set({ notes: data })
      }
    } catch (error) {
      console.error('Fetch notes error:', error)
    }
  },

  createNote: async (note) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const newNote = {
        title: 'New Note',
        content: '',
        position_x: Math.random() * 500,
        position_y: Math.random() * 500,
        color: '#ffffff',
        tags: [],
        ...note,
        user_id: user.id,
      }

      const { data, error } = await supabase
        .from('notes')
        .insert([newNote])
        .select()
        .single()

      if (!error && data) {
        set({ notes: [...get().notes, data] })
      }
    } catch (error) {
      console.error('Create note error:', error)
    }
  },

  updateNote: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id)

      if (!error) {
        set({
          notes: get().notes.map(note =>
            note.id === id ? { ...note, ...updates } : note
          )
        })
      }
    } catch (error) {
      console.error('Update note error:', error)
    }
  },

  deleteNote: async (id) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)

      if (!error) {
        set({ notes: get().notes.filter(note => note.id !== id) })
      }
    } catch (error) {
      console.error('Delete note error:', error)
    }
  },

  setSelectedNote: (note) => set({ selectedNote: note }),
}))