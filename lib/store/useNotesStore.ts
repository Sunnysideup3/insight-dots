// lib/store/useNotesStore.ts
import { create } from 'zustand';

export interface Note {
  id: string;
  title: string;
  content: string;
  position_x: number;
  position_y: number;
  color: string;
  tags: string[];
}

interface NotesStore {
  notes: Note[];
  fetchNotes: () => Promise<void>;
  createNote: (partial: Partial<Note>) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: [],

  fetchNotes: async () => {
    const res = await fetch('/api/notes');
    const data: Note[] = await res.json();
    set({ notes: data });
  },

  createNote: async (partial) => {
    const noteToInsert: Partial<Note> = {
      title: 'New Note',
      content: '',
      position_x: Math.random() * 500,
      position_y: Math.random() * 500,
      color: '#ffffff',
      tags: [],
      ...partial,
    };
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteToInsert),
    });
    const newNote: Note = await res.json();
    set({ notes: [...get().notes, newNote] });
  },

  updateNote: async (id, updates) => {
    await fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    set({
      notes: get().notes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    });
  },

  deleteNote: async (id) => {
    await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    set({ notes: get().notes.filter((n) => n.id !== id) });
  },
}));
