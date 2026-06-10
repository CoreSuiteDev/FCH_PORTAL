export interface NavLink {
  id: number // Added id field
  name: string
  href: string
}

export const navLinks: NavLink[] = [
  { id: 1, name: "Home", href: "/" },
  { id: 2, name: "About", href: "/about" },
  { id: 3, name: "Membership", href: "/membership" },
  { id: 4, name: "Sponsor", href: "/sponsor" },
  { id: 5, name: "News", href: "/news" },
  { id: 6, name: "Events", href: "/events" },
  { id: 7, name: "Webinars", href: "/webinars" },
]
