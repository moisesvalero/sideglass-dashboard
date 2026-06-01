declare module "ical.js" {
  export function parse(input: string): unknown

  export class Component {
    constructor(jcal: unknown)
    getAllSubcomponents(name: string): Component[]
  }

  export class Event {
    constructor(component: Component)
    uid: string
    summary: string
    startDate: { toJSDate(): Date } | null
    endDate: { toJSDate(): Date } | null
  }
}
