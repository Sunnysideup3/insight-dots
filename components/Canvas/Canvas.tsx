'use client'
import { useNotesStore } from '@/lib/store/useNotesStore'
import React, { useRef } from 'react'
import NoteCard from './NoteCard'

export default function Canvas() {
  const { notes, fetchNotes, createNote } = useNotesStore()
  const canvasRef = useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const handleCanvasDoubleClick = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    createNote({
      position_x: e.clientX - rect.left,
      position_y: e.clientY - rect.top,
    })
  }

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-screen bg-gray-50 overflow-auto"
      onDoubleClick={handleCanvasDoubleClick}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      {notes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          Double-click anywhere to create a note
        </div>
      )}
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  )
}