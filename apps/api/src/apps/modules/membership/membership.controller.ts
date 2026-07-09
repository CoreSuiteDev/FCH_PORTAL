import { MembershipService } from "./membership.service.js"

export class MembershipController {
  static async createMembershipSubscription(
    body: Parameters<typeof MembershipService.createMembershipSubscription>[0]
  ) {
    return MembershipService.createMembershipSubscription(body)
  }

  static async getMembershipsHistory(
    params: Parameters<typeof MembershipService.getMembershipsHistory>[0]
  ) {
    return MembershipService.getMembershipsHistory(params)
  }

  static async updateMembershipStatus(
    id: string,
    status: Parameters<typeof MembershipService.updateMembershipStatus>[1]
  ) {
    return MembershipService.updateMembershipStatus(id, status)
  }

  static async deleteMembershipSubscription(id: string) {
    return MembershipService.deleteMembershipSubscription(id)
  }

  static async getUserMemberships(userId: string) {
    return MembershipService.getUserMemberships(userId)
  }

  static async requestCancellation(
    body: Parameters<typeof MembershipService.requestCancellation>[0]
  ) {
    return MembershipService.requestCancellation(body)
  }

  static async getUserCancellationRequests(userId: string) {
    return MembershipService.getUserCancellationRequests(userId)
  }

  static async getCancellationRequests(
    params: Parameters<typeof MembershipService.getCancellationRequests>[0]
  ) {
    return MembershipService.getCancellationRequests(params)
  }

  static async processCancellation(
    body: Parameters<typeof MembershipService.processCancellation>[0]
  ) {
    return MembershipService.processCancellation(body)
  }

  static async filteredMemberships(
    params: Parameters<typeof MembershipService.filteredMemberships>[0]
  ) {
    return MembershipService.filteredMemberships(params)
  }
}