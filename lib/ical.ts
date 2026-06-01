import ICAL from "ical.js"

export interface ParsedCalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
}

export function parseIcalEvents(icalText: string, limit = 8): ParsedCalendarEvent[] {
  const jcal = ICAL.parse(icalText)
  const comp = new ICAL.Component(jcal)
  const vevents = comp.getAllSubcomponents("vevent")
  const now = Date.now()

  const events: ParsedCalendarEvent[] = []

  for (const vevent of vevents) {
    const event = new ICAL.Event(vevent)
    const start = event.startDate?.toJSDate()
    const end = event.endDate?.toJSDate()
    if (!start || !end) continue
    if (end.getTime() <= now) continue

    events.push({
      id: event.uid || `${event.summary}-${start.toISOString()}`,
      title: event.summary || "Evento",
      start,
      end,
    })
  }

  return events.sort((a, b) => a.start.getTime() - b.start.getTime()).slice(0, limit)
}
