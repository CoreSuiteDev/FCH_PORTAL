import { EventVisibility } from "../../../generated/prisma/client.js"

export const ROLE_HIERARCHY: Record<string, number> = {
  GUEST: 0,
  MEMBER: 1,
  PASTORAL: 2,
  BOARD: 3,
  SUPER_ADMIN: 4,
}

export const VISIBILITY_LEVEL: Record<EventVisibility, number> = {
  PUBLIC: 0,
  FREE_WEBINAR: 0,
  MEMBER_ONLY: 1,
  PASTORAL_ONLY: 2,
  BOARD_ONLY: 3,
}

export class EventPolicy {
  /**
   * Returns a list of all visibility settings the user's role can view
   */
  static getAllowedVisibilities(userRole: string | undefined): EventVisibility[] {
    const role = userRole ? userRole.toUpperCase() : "GUEST"
    if (role === "SUPER_ADMIN") {
      return ["PUBLIC", "FREE_WEBINAR", "MEMBER_ONLY", "PASTORAL_ONLY", "BOARD_ONLY"]
    }
    const userScore = ROLE_HIERARCHY[role] ?? 0
    return Object.entries(VISIBILITY_LEVEL)
      .filter(([_, level]) => level <= userScore)
      .map(([vis]) => vis as EventVisibility)
  }

  /**
   * Evaluates if a given role can view an event
   */
  static canView(userRole: string | undefined, eventVisibility: EventVisibility): boolean {
    const role = userRole ? userRole.toUpperCase() : "GUEST"

    // Super Admin bypasses all visibility checks
    if (role === "SUPER_ADMIN") {
      return true
    }

    const userScore = ROLE_HIERARCHY[role] ?? 0
    const requiredScore = VISIBILITY_LEVEL[eventVisibility] ?? 0

    return userScore >= requiredScore
  }

  /**
   * Filter a list of events to only return what the user has permission to see
   */
  static filterVisibleEvents<T extends { visibility: EventVisibility }>(
    userRole: string | undefined,
    events: T[]
  ): T[] {
    return events.filter((event) => this.canView(userRole, event.visibility))
  }

  /**
   * Evaluates if a given role can manage (create/update/delete) events
   */
  static canManage(userRole: string | undefined): boolean {
    const role = userRole ? userRole.toUpperCase() : "GUEST"
    return role === "SUPER_ADMIN"
  }
}
