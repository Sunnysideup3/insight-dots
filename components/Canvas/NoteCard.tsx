'use client'

import React, { useState, useRef } from 'react'
import { useNotesStore } from '@/lib/store/useNotesStore'

interface NoteCardProps {
  note: {
    id: string
    title: string
    content: string
    position_x: number
    position_y: number
    color: string
    tags: string[]
  }
}

export default function NoteCard({ note }: NoteCardProps) {
  const { updateNote, setSelectedNote, deleteNote } = useNotesStore()
  const [isDragging, setIsDragging] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return
    setIsDragging(true)
    setSelectedNote(note)

    const startX = e.clientX - note.position_x
    const startY = e.clientY - note.position_y

    const handleMouseMove = (e: MouseEvent) => {
      updateNote(note.id, {
        position_x: e.clientX - startX,
        position_y: e.clientY - startY,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (content.length > 20) {
      try {
        const response = await fetch('/api/generate-tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: title + ' ' + content }),
        })
        const { tags } = await response.json()
        updateNote(note.id, { title, content, tags })
      } catch (error) {
        console.error(error)
        updateNote(note.id, { title, content })
      }
    } else {
      updateNote(note.id, { title, content })
    }
    setIsEditing(false)
  }

  const handleDelete = () => {
    deleteNote(note.id) // 추가: 삭제 기능 실제 사용 예시
  }

  return (
    <div
      ref={cardRef}
      className={`absolute p-4 bg-white rounded-lg shadow-md w-64 cursor-move
        ${isDragging ? 'shadow-xl z-10' : 'hover:shadow-lg'}
        transition-shadow duration-200`}
      style={{
        left: `${note.position_x}px`,
        top: `${note.position_y}px`,
        backgroundColor: note.color,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-1 border-b"
            placeholder="Title"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-1 border rounded resize-none"
            rows={4}
            placeholder="Content"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-300 rounded text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="font-semibold mb-2">{note.title}</h3>
          <p className="text-sm text-gray-600">{note.content}</p>
          {note.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {note.tags.map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-gray-200 rounded text-xs">{tag}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}