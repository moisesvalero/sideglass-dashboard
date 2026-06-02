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
      try {
        setNotes(JSON.parse(stored))
      } catch {
        /* ignore */
      }
    }
    setMounted(true)
  }, [])

  const saveNotes = (updated: Note[]) => {
    setNotes(updated)
    localStorage.setItem("dashboard-notes", JSON.stringify(updated))
  }

  const addNote = () => {
    saveNotes([{ id: Date.now().toString(36), text: "", createdAt: Date.now() }, ...notes])
  }

  const updateNote = (id: string, text: string) => {
    saveNotes(notes.map((n) => (n.id === id ? { ...n, text } : n)))
  }

  const deleteNote = (id: string) => {
    saveNotes(notes.filter((n) => n.id !== id))
  }

  if (!mounted) return null

  return (
    <div className="glass-tile notes-widget p-5">
      <div className="dashboard-widget-header mb-3">
        <div className="dashboard-widget-title">
          <StickyNote className="h-4 w-4 text-amber-500/90" />
          <span>{t("notes.title")}</span>
          <button
            type="button"
            onClick={addNote}
            className="notes-add-button dashboard-control flex h-7 w-7 items-center justify-center transition-colors hover:bg-muted/70"
            aria-label={t("notes.title")}
          >
            <Plus className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="notes-list custom-scrollbar space-y-2 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="flex min-h-0 flex-1 items-center justify-center py-4 text-center text-sm text-muted-foreground">
            {t("notes.empty")}
          </p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="dashboard-control group flex items-start gap-2 px-3 py-2">
              <textarea
                value={note.text}
                onChange={(e) => updateNote(note.id, e.target.value)}
                placeholder={t("notes.placeholder")}
                rows={1}
                className="min-h-6 flex-1 resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus-visible:ring-0"
                style={{ minHeight: "24px" }}
                onInput={(e) => {
                  const el = e.currentTarget
                  el.style.height = "auto"
                  el.style.height = `${el.scrollHeight}px`
                }}
              />
              <button
                type="button"
                onClick={() => deleteNote(note.id)}
                className="mt-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Eliminar"
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive/70 hover:text-destructive" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
