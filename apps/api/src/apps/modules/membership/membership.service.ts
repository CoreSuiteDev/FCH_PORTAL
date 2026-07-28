import { TRPCError } from "@trpc/server"
import { Prisma } from "../../../generated/prisma/client.js"
import { prisma } from "../../../infrastructure/database/prisma.js"
import { stripe } from "../../../infrastructure/stripe/stripe.js"
import config from "../../../utils/config.js"

export class MembershipService {
  static async createMembershipSubscription(body: {
    packageId: string
    name: string
    email: string
    phone?: string
    userId: string
    paymentMethodId?: string
  }) {
    const { packageId, name, email, phone, userId } = body

    const pkg = await prisma.membershipPackage.findUnique({
      where: { id: packageId },
    })
    if (!pkg) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Membership package not found",
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      })
    }

    // Check for active membership to enforce upgrade rules
    const activeSub = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "ACTIVE",
        currentPeriodEnd: {
          gt: new Date(),
        },
      },
      include: {
        package: true,
      },
    })

    if (activeSub) {
      const activePkg = activeSub.package

      let isValidUpgrade = false
      if (activePkg.type === "GENERAL" && pkg.type === "PASTORAL") {
        isValidUpgrade = true
      } else if (activePkg.type === pkg.type) {
        if (activePkg.billingCycle === "MONTHLY" && pkg.billingCycle === "YEARLY") {
          isValidUpgrade = true
        }
      }

      if (!isValidUpgrade) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `You already have an active ${activePkg.name} subscription. You cannot purchase a new membership, but you can upgrade from Monthly to Yearly, or General to Pastoral.`,
        })
      }
    }

    const basePrice = Number(pkg.price)
    const amountInCents = Math.round(basePrice * 100)

    const currentPeriodStart = new Date()
    const currentPeriodEnd = new Date()
    if (pkg.billingCycle === "MONTHLY") {
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)
    } else {
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1)
    }

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        packageId: pkg.id,
        currentPeriodStart,
        currentPeriodEnd,
        status: "PENDING",
      },
    })

    const payment = await prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        amount: basePrice,
        currency: pkg.currency,
        status: "PENDING",
        paymentMethod: "CARD",
      },
    })

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: pkg.currency.toLowerCase(),
              product_data: {
                name: `Membership Package: ${pkg.name}`,
                description: `Subscription to ${pkg.name} (${pkg.billingCycle.toLowerCase()})`,
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        success_url: `${config.frontendUrl}/membership/success?session_id={CHECKOUT_SESSION_ID}&packageId=${pkg.id}&price=${basePrice}&packageName=${pkg.name}&billingCycle=${pkg.billingCycle}`,
        cancel_url: `${config.frontendUrl}/membership/cancel`,
        invoice_creation: { enabled: true },
        metadata: {
          type: "payment",
          subscriptionId: subscription.id,
          paymentId: payment.id,
          packageId: pkg.id,
          userId: userId,
        },
      })

      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          stripeCheckoutSessionId: session.id,
        },
      })

      return {
        checkoutUrl: session.url!,
        subscriptionId: subscription.id,
      }
    } catch (error: any) {
      console.error("[Stripe Membership Error]: ", error)
      await prisma.payment.delete({ where: { id: payment.id } }).catch(() => {})
      await prisma.subscription
        .delete({ where: { id: subscription.id } })
        .catch(() => {})
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to initiate Stripe payment.",
        cause: error,
      })
    }
  }

  static async getMembershipsHistory(params: {
    page: number
    limit: number
    search?: string
    tier?: string
    status?: string
  }) {
    const { page, limit, search, tier, status } = params
    const skip = (page - 1) * limit

    const where: Prisma.SubscriptionWhereInput = {}

    if (tier && tier !== "ALL") {
      const dbType = tier.toUpperCase() === "GENERAL" ? "GENERAL" : "PASTORAL"
      where.package = {
        type: dbType,
      }
    }

    if (status && status !== "ALL") {
      const statusMap: Record<
        string,
        "ACTIVE" | "PENDING" | "CANCELED" | "EXPIRED" | "UNPAID"
      > = {
        Active: "ACTIVE",
        Pending: "PENDING",
        Canceled: "CANCELED",
        Expired: "EXPIRED",
        Suspended: "UNPAID",
      }

      if (statusMap[status]) {
        where.status = statusMap[status]
      }
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: "insensitive" } },
        {
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      ]
    }

    const [data, totalCount, statusCounts, generalEarnings, pastoralEarnings] =
      await Promise.all([
        prisma.subscription.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            user: true,
            package: true,
            payments: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        }),

        prisma.subscription.count({ where }),

        prisma.subscription.groupBy({
          by: "status",
          _count: { _all: true },
        }),

        prisma.payment.aggregate({
          where: { subscription: { package: { type: "GENERAL" } } },
          _sum: { amount: true },
        }),

        prisma.payment.aggregate({
          where: { subscription: { package: { type: "PASTORAL" } } },
          _sum: { amount: true },
        }),
      ])

    const stats = { total: 0, active: 0, pending: 0, expiredOrCanceled: 0 }
    statusCounts.forEach((group) => {
      const count = group._count._all
      stats.total += count
      if (group.status === "ACTIVE") stats.active += count
      if (group.status === "PENDING") stats.pending += count
      if (group.status === "EXPIRED" || group.status === "CANCELED")
        stats.expiredOrCanceled += count
    })

    // Calculate actual active Monthly & Yearly counts
    const activeSubs = await prisma.subscription.findMany({
      where: { status: "ACTIVE" },
      include: { package: true },
    })

    const pricingStats = {
      general: {
        earnings: Number(generalEarnings._sum.amount || 0),
        monthlyCount: 0,
        yearlyCount: 0,
      },
      pastoral: {
        earnings: Number(pastoralEarnings._sum.amount || 0),
        monthlyCount: 0,
        yearlyCount: 0,
      },
    }

    activeSubs.forEach((sub) => {
      if (sub.package.type === "GENERAL") {
        if (sub.package.billingCycle === "MONTHLY")
          pricingStats.general.monthlyCount++
        else if (sub.package.billingCycle === "YEARLY")
          pricingStats.general.yearlyCount++
      } else if (sub.package.type === "PASTORAL") {
        if (sub.package.billingCycle === "MONTHLY")
          pricingStats.pastoral.monthlyCount++
        else if (sub.package.billingCycle === "YEARLY")
          pricingStats.pastoral.yearlyCount++
      }
    })

    // Define time ranges
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

    // Calculate Active Income/Sales: Daily, Monthly, Yearly, Total counts & amounts
    const allSuccessfulPayments = await prisma.payment.findMany({
      where: { status: { in: ["SUCCEEDED", "PARTIALLY_REFUNDED"] } },
      include: { subscription: { include: { package: true } } },
    })

    const salesStats = {
      general: {
        daily: { count: 0, amount: 0 },
        monthly: { count: 0, amount: 0 },
        yearly: { count: 0, amount: 0 },
        total: { count: 0, amount: 0 },
      },
      pastoral: {
        daily: { count: 0, amount: 0 },
        yearly: { count: 0, amount: 0 },
        monthly: { count: 0, amount: 0 },
        total: { count: 0, amount: 0 },
      },
    }

    allSuccessfulPayments.forEach((pay) => {
      const amt = Number(pay.amount)
      const date = pay.createdAt
      const type = pay.subscription?.package?.type // "GENERAL" | "PASTORAL"
      if (!type) return

      const target =
        type === "GENERAL" ? salesStats.general : salesStats.pastoral

      target.total.count++
      target.total.amount += amt

      if (date >= oneDayAgo) {
        target.daily.count++
        target.daily.amount += amt
      }
      if (date >= oneMonthAgo) {
        target.monthly.count++
        target.monthly.amount += amt
      }
      if (date >= oneYearAgo) {
        target.yearly.count++
        target.yearly.amount += amt
      }
    })

    // Calculate Cancellations & Refund Stats: Daily, Monthly, Yearly, Total
    const allApprovedCancellations = await prisma.cancellationRequest.findMany({
      where: { status: "APPROVED" },
    })

    const cancelStats = {
      daily: { count: 0, refundSum: 0 },
      monthly: { count: 0, refundSum: 0 },
      yearly: { count: 0, refundSum: 0 },
      total: { count: 0, refundSum: 0 },
    }

    allApprovedCancellations.forEach((req) => {
      const date = req.processedAt || req.updatedAt
      const refund = req.refundAmount ? Number(req.refundAmount) : 0

      cancelStats.total.count++
      cancelStats.total.refundSum += refund

      if (date >= oneDayAgo) {
        cancelStats.daily.count++
        cancelStats.daily.refundSum += refund
      }
      if (date >= oneMonthAgo) {
        cancelStats.monthly.count++
        cancelStats.monthly.refundSum += refund
      }
      if (date >= oneYearAgo) {
        cancelStats.yearly.count++
        cancelStats.yearly.refundSum += refund
      }
    })

    return {
      data: data.map((sub) => {
        const latestPayment = sub.payments[0]
        const amount = latestPayment
          ? Number(latestPayment.amount)
          : Number(sub.package.price)
        const currencySymbol =
          sub.package.currency === "USD" ? "$" : sub.package.currency + " "

        const statusFmtMap: Record<string, any> = {
          ACTIVE: "Active",
          CANCELED: "Canceled",
          CANCELLED: "Canceled",
          EXPIRED: "Expired",
          PENDING: "Pending",
          UNPAID: "Suspended",
          PAST_DUE: "Suspended",
        }

        const fmt = (d: Date) =>
          d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })

        return {
          id: sub.id,
          name: sub.user?.name || "Unknown User",
          email: sub.user?.email || "No Email",
          tier: sub.package.type === "PASTORAL" ? "Pastoral" : "General",
          packageName: sub.package.name,
          billingCycle: sub.package.billingCycle as "MONTHLY" | "YEARLY",
          joinedDate: fmt(sub.createdAt),
          expiryDate: fmt(sub.currentPeriodEnd),
          amountPaid: `${currencySymbol} ${amount.toFixed(2)}`,
          status: statusFmtMap[sub.status] || "Pending",
          paymentStatus: latestPayment?.status ?? null,
          stripePaymentIntentId: latestPayment?.stripePaymentIntentId ?? null,
          cardBrand: latestPayment?.cardBrand ?? null,
          cardLast4: latestPayment?.cardLast4 ?? null,
          paymentMethod: latestPayment?.paymentMethod ?? null,
          receiptUrl: latestPayment?.receiptUrl ?? null,
        }
      }),
      totalCount,
      stats,
      pricingStats,
      salesStats,
      cancelStats,
    }
  }

  static async getUserMemberships(userId: string) {
    const subs = await prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        package: true,
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    })

    return subs.map((sub) => {
      const latestPayment = sub.payments[0]
      const amount = latestPayment
        ? Number(latestPayment.amount)
        : Number(sub.package.price)
      const currencySymbol =
        sub.package.currency === "USD" ? "$" : sub.package.currency + " "

      let status: "Active" | "Pending" | "Expired" | "Canceled" | "Suspended" =
        "Pending"
      if (sub.status === "ACTIVE") status = "Active"
      else if (sub.status === "CANCELED") status = "Canceled"
      else if (sub.status === "EXPIRED") status = "Expired"
      else if (sub.status === "UNPAID" || sub.status === "PAST_DUE")
        status = "Suspended"

      let tier: "General" | "Pastoral" | "Board" = "General"
      if (sub.package.type === "PASTORAL") tier = "Pastoral"

      const fmt = (d: Date) =>
        d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })

      return {
        id: sub.id,
        tier,
        packageName: sub.package.name,
        billingCycle: sub.package.billingCycle as "MONTHLY" | "YEARLY",
        joinedDate: fmt(sub.createdAt),
        expiryDate: fmt(sub.currentPeriodEnd),
        amountPaid: `${currencySymbol}${amount.toFixed(2)}`,
        status,
        paymentStatus: latestPayment?.status ?? null,
        stripePaymentIntentId: latestPayment?.stripePaymentIntentId ?? null,
      }
    })
  }

  static async deleteMembershipSubscription(id: string) {
    const sub = await prisma.subscription.findUnique({
      where: { id },
    })
    if (!sub) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Membership subscription not found",
      })
    }
    await prisma.subscription.delete({
      where: { id },
    })
    return { id }
  }

  static async updateMembershipStatus(
    id: string,
    status: "Active" | "Pending" | "Expired" | "Canceled" | "Suspended"
  ) {
    let dbStatus: "ACTIVE" | "PENDING" | "CANCELED" | "EXPIRED" | "UNPAID" =
      "PENDING"
    if (status === "Active") dbStatus = "ACTIVE"
    else if (status === "Pending") dbStatus = "PENDING"
    else if (status === "Canceled") dbStatus = "CANCELED"
    else if (status === "Expired") dbStatus = "EXPIRED"
    else if (status === "Suspended") dbStatus = "UNPAID"

    const sub = await prisma.subscription.findUnique({
      where: { id },
    })
    if (!sub) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Membership subscription not found",
      })
    }

    const updated = await prisma.subscription.update({
      where: { id },
      data: {
        status: dbStatus,
      },
    })
    return updated
  }

  static async filteredMemberships(params: {
    page: number
    limit: number
    skip?: number
    search?: string
    status?: string
    packageId?: string
    billingCycle?: string
    startDate?: string
    endDate?: string
    minAmount?: number
    maxAmount?: number
  }) {
    const {
      page,
      limit,
      skip,
      search,
      status,
      packageId,
      billingCycle,
      startDate,
      endDate,
      minAmount,
      maxAmount,
    } = params

    const computedSkip = skip ?? (page - 1) * limit

    const where: Prisma.SubscriptionWhereInput = {}

    // Status Filter
    if (status && status !== "ALL") {
      const statusMap: Record<
        string,
        "ACTIVE" | "PENDING" | "CANCELED" | "EXPIRED" | "UNPAID"
      > = {
        ACTIVE: "ACTIVE",
        PENDING: "PENDING",
        CANCELED: "CANCELED",
        EXPIRED: "EXPIRED",
        UNPAID: "UNPAID",
        Active: "ACTIVE",
        Pending: "PENDING",
        Canceled: "CANCELED",
        Expired: "EXPIRED",
        Suspended: "UNPAID",
      }
      const mapped = statusMap[status] || (statusMap[status.toUpperCase()] as any)
      if (mapped) {
        where.status = mapped
      }
    }

    // Package ID Filter
    if (packageId && packageId !== "ALL") {
      where.packageId = packageId
    }

    const packageWhere: any = {}

    // Billing Cycle Filter
    if (billingCycle && billingCycle !== "ALL") {
      packageWhere.billingCycle = billingCycle.toUpperCase()
    }

    // Amount range filter (filters packages by price)
    if (minAmount !== undefined || maxAmount !== undefined) {
      packageWhere.price = {
        gte: minAmount !== undefined ? minAmount : undefined,
        lte: maxAmount !== undefined ? maxAmount : undefined,
      }
    }

    if (Object.keys(packageWhere).length > 0) {
      where.package = packageWhere
    }

    // Search Filter
    if (search) {
      where.OR = [
        { id: { contains: search, mode: "insensitive" } },
        { stripeSubscriptionId: { contains: search, mode: "insensitive" } },
        { stripeCustomerId: { contains: search, mode: "insensitive" } },
        {
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      ]
    }

    // Date Range Filter (based on subscription creation date)
    if (startDate || endDate) {
      where.createdAt = {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      }
    }

    const [totalCount, data] = await prisma.$transaction([
      prisma.subscription.count({ where }),
      prisma.subscription.findMany({
        where,
        skip: computedSkip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              createdAt: true,
            },
          },
          package: true,
          payments: {
            orderBy: { createdAt: "desc" },
          },
        },
      }),
    ])

    return {
      data,
      totalCount,
    }
  }

  // ── Cancellation request flow ────────────────────────────────────────────

  /**
   * User submits a cancellation request for their active subscription.
   * Blocks duplicate PENDING requests.
   */
  static async requestCancellation(body: {
    userId: string
    subscriptionId: string
    reason: string
  }) {
    const { userId, subscriptionId, reason } = body

    // Verify the subscription belongs to this user and is active
    const sub = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        package: true,
        payments: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    })
    if (!sub) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Subscription not found",
      })
    }
    if (sub.userId !== userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "This subscription does not belong to you",
      })
    }
    if (sub.status !== "ACTIVE") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Only ACTIVE subscriptions can be cancelled (current: ${sub.status})`,
      })
    }

    // Block duplicate pending request
    const existing = await prisma.cancellationRequest.findFirst({
      where: { subscriptionId, status: "PENDING" },
    })
    if (existing) {
      throw new TRPCError({
        code: "CONFLICT",
        message:
          "You already have a pending cancellation request for this subscription",
      })
    }

    // Calculate pro-rata refund for display purposes
    const now = new Date()
    const periodTotal =
      sub.currentPeriodEnd.getTime() - sub.currentPeriodStart.getTime()
    const remaining = sub.currentPeriodEnd.getTime() - now.getTime()
    const ratio = Math.max(0, Math.min(1, remaining / periodTotal))
    const latestPayment = sub.payments[0]
    const amountPaid = latestPayment
      ? Number(latestPayment.amount)
      : Number(sub.package.price)
    const estimatedRefund = parseFloat((amountPaid * ratio).toFixed(2))

    const request = await prisma.cancellationRequest.create({
      data: {
        userId,
        subscriptionId,
        reason,
      },
    })

    return { id: request.id, estimatedRefund }
  }

  /**
   * Admin: Get all cancellation requests (paginated, filterable by status)
   */
  static async getCancellationRequests(params: {
    page: number
    limit: number
    search?: string
    tier?: string
    status?: string
  }) {
    const { page, limit, search, tier, status } = params
    const skip = (page - 1) * limit

    const where: any = {}

    if (status && status !== "ALL") {
      where.status = status as "PENDING" | "APPROVED" | "REJECTED"
    }

    if (tier && tier !== "ALL") {
      const dbType = tier.toUpperCase() === "GENERAL" ? "GENERAL" : "PASTORAL"
      where.subscription = {
        package: {
          type: dbType,
        },
      }
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: "insensitive" } },
        { reason: { contains: search, mode: "insensitive" } },
        {
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      ]
    }

    const [totalCount, data] = await prisma.$transaction([
      prisma.cancellationRequest.count({ where }),
      prisma.cancellationRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          subscription: {
            include: {
              package: true,
              payments: { orderBy: { createdAt: "desc" }, take: 1 },
            },
          },
        },
      }),
    ])

    const formatted = data.map((req) => {
      const sub = req.subscription
      const now = new Date()
      const periodTotal =
        sub.currentPeriodEnd.getTime() - sub.currentPeriodStart.getTime()
      const remaining = sub.currentPeriodEnd.getTime() - now.getTime()
      const ratio = Math.max(0, Math.min(1, remaining / periodTotal))
      const latestPayment = sub.payments[0]
      const amountPaid = latestPayment
        ? Number(latestPayment.amount)
        : Number(sub.package.price)
      const estimatedRefund = parseFloat((amountPaid * ratio).toFixed(2))

      return {
        id: req.id,
        createdAt: req.createdAt,
        reason: req.reason,
        status: req.status,
        adminNote: req.adminNote ?? null,
        refundAmount: req.refundAmount ? Number(req.refundAmount) : null,
        processedAt: req.processedAt ?? null,
        user: req.user,
        subscription: {
          id: sub.id,
          status: sub.status,
          packageName: sub.package.name,
          tier: sub.package.type,
          billingCycle: sub.package.billingCycle,
          amountPaid,
          currency: sub.package.currency,
          currentPeriodEnd: sub.currentPeriodEnd,
          stripePaymentIntentId: latestPayment?.stripePaymentIntentId ?? null,
        },
        estimatedRefund,
      }
    })

    return { data: formatted, totalCount }
  }

  /**
   * Super-admin: approve (with refund) or reject a cancellation request.
   */
  static async processCancellation(body: {
    requestId: string
    action: "APPROVE" | "REJECT"
    refundAmount?: number
    adminNote?: string
  }) {
    const { requestId, action, refundAmount, adminNote } = body

    const req = await prisma.cancellationRequest.findUnique({
      where: { id: requestId },
      include: {
        subscription: {
          include: {
            package: true,
            payments: { orderBy: { createdAt: "desc" }, take: 1 },
          },
        },
        user: { select: { id: true } },
      },
    })

    if (!req) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Cancellation request not found",
      })
    }
    if (req.status !== "PENDING") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Request is already ${req.status}`,
      })
    }

    if (action === "REJECT") {
      await prisma.cancellationRequest.update({
        where: { id: requestId },
        data: {
          status: "REJECTED",
          adminNote: adminNote ?? null,
          processedAt: new Date(),
        },
      })
      return { success: true, action: "REJECTED" }
    }

    // ── APPROVE path ────────────────────────────────────────────────────────

    const sub = req.subscription
    const latestPayment = sub.payments[0]

    // Calculate pro-rata refund if not explicitly provided
    let finalRefundAmount = refundAmount
    if (finalRefundAmount === undefined || finalRefundAmount === null) {
      const now = new Date()
      const periodTotal =
        sub.currentPeriodEnd.getTime() - sub.currentPeriodStart.getTime()
      const remaining = sub.currentPeriodEnd.getTime() - now.getTime()
      const ratio = Math.max(0, Math.min(1, remaining / periodTotal))
      const amountPaid = latestPayment
        ? Number(latestPayment.amount)
        : Number(sub.package.price)
      finalRefundAmount = parseFloat((amountPaid * ratio).toFixed(2))
    }

    // Issue partial refund on Stripe if there's a payment intent and a refund > 0
    let stripeRefundId: string | null = null
    if (finalRefundAmount > 0 && latestPayment?.stripePaymentIntentId) {
      try {
        const refundAmountCents = Math.round(finalRefundAmount * 100)
        const refund = await stripe.refunds.create({
          payment_intent: latestPayment.stripePaymentIntentId,
          amount: refundAmountCents,
          reason: "requested_by_customer",
        })
        stripeRefundId = refund.id

        // Mark payment as PARTIALLY_REFUNDED
        await prisma.payment.update({
          where: { id: latestPayment.id },
          data: {
            status: "PARTIALLY_REFUNDED",
            refundedAmount: finalRefundAmount,
          },
        })
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown Stripe error"
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Stripe refund failed: ${msg}`,
        })
      }
    }

    // Cancel the subscription
    await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        status: "CANCELED",
        cancelledAt: new Date(),
        cancelAtPeriodEnd: false,
      },
    })

    // Revert user role by removing the cancelled tier role (MEMBER or PASTORAL)
    const roleName = sub.package.type === "GENERAL" ? "MEMBER" : "PASTORAL"
    const { UserService } = await import("../user/user.service.js")
    await UserService.removeUserRole(req.user.id, roleName)

    // Mark the request as APPROVED
    await prisma.cancellationRequest.update({
      where: { id: requestId },
      data: {
        status: "APPROVED",
        refundAmount: finalRefundAmount,
        adminNote: adminNote ?? null,
        processedAt: new Date(),
      },
    })

    return {
      success: true,
      action: "APPROVED",
      refundAmount: finalRefundAmount,
      stripeRefundId,
    }
  }

  /**
   * User: get their own cancellation requests
   */
  static async getUserCancellationRequests(userId: string) {
    const data = await prisma.cancellationRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        subscription: {
          include: { package: true },
        },
      },
    })

    return data.map((req) => ({
      id: req.id,
      createdAt: req.createdAt,
      reason: req.reason,
      status: req.status,
      adminNote: req.adminNote ?? null,
      refundAmount: req.refundAmount ? Number(req.refundAmount) : null,
      processedAt: req.processedAt ?? null,
      packageName: req.subscription.package.name,
      subscriptionId: req.subscriptionId,
    }))
  }
}
