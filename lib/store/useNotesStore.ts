// lib/store/useNotesStore.ts
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
        const { data } = await supabase
            .from('notes')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) set({ notes: data })
    },

    createNote: async (note) => {
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) return

        const newNote = {
            title: 'New Note',
            content: '',
            position_x: Math.random() * 500,
            position_y: Math.random() * 500,
            color: '#ffffff',
            tags: [],
            ...note,
            user_id: userData.user.id,
        }

        const { data, error } = await supabase
            .from('notes')
            .insert([newNote])
            .select()
            .single()

        if (data) {
            set({ notes: [...get().notes, data] })
        }
    },

    updateNote: async (id, updates) => {
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
    },

    deleteNote: async (id) => {
        await supabase.from('notes').delete().eq('id', id)
        set({ notes: get().notes.filter(note => note.id !== id) })
    },

    setSelectedNote: (note) => set({ selectedNote: note }),
}))