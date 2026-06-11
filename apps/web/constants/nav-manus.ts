export interface NavLink {
  id: number
  key: string
  href: string
}

export const navLinks: NavLink[] = [
  { id: 1, key: "home", href: "/" },
  { id: 2, key: "about", href: "/about" },
  { id: 3, key: "membership", href: "/membership" },
  { id: 4, key: "sponsor", href: "/sponsor" },
  { id: 5, key: "news", href: "/news" },
  { id: 6, key: "events", href: "/events" },
  { id: 7, key: "webinars", href: "/webinars" },
]
