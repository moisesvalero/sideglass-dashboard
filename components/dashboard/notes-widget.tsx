"use client"

import { useEffect, useState } from "react"
import { StickyNote, Plus, Trash2 } from "lucide-react"
import { useI18n } from "@/lib/i18n"

interface Note {
  id: string
  text: string
  createdAt: number
}

export function NotesWidget() {
  const [notes, setNotes] = useState<Note[]>([])
  const [mounted, setMounted] = useState(false)
  const { t } = useI18n()

  useEffect(() => {
    const stored = localStorage.getItem("dashboard-notes")
    if (stored) {
      try { setNotes(JSON.parse(stored)) } catch { /* ignore */ }
    }
    setMounted(true)
  }, [])

  const saveNotes = (updated: Note[]) => {
    setNotes(updated)
    localStorage.setItem("dashboard-notes", JSON.stringify(updated))
  }

  const addNote = () => {
    const note: Note = {
      id: Date.now().toString(36),
      text: "",
      createdAt: Date.now(),
    }
    saveNotes([note, ...notes])
  }

  const updateNote = (id: string, text: string) => {
    saveNotes(notes.map((n) => (n.id === id ? { ...n, text } : n)))
  }

  const deleteNote = (id: string) => {
    saveNotes(notes.filter((n) => n.id !== id))
  }

  if (!mounted) return null

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-white/60" />
          <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">
            {t("notes.title")}
          </h2>
        </div>
        <button
          onClick={addNote}
          className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-white/60" />
        </button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
        {notes.length === 0 ? (
          <p className="text-white/30 text-xs text-center py-4">
            {t("notes.empty")}
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="group flex gap-2 items-start bg-white/5 rounded-xl px-3 py-2"
            >
              <textarea
                value={note.text}
                onChange={(e) => updateNote(note.id, e.target.value)}
                placeholder={t("notes.placeholder")}
                rows={1}
                className="flex-1 bg-transparent text-white/80 text-sm resize-none outline-none placeholder:text-white/30"
                style={{ minHeight: "24px" }}
                onInput={(e) => {
                  const el = e.currentTarget
                  el.style.height = "auto"
                  el.style.height = `${el.scrollHeight}px`
                }}
              />
              <button
                onClick={() => deleteNote(note.id)}
                className="opacity-0 group-hover:opacity-100 mt-0.5 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400/60 hover:text-red-400" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
