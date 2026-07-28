import { ZCSponsorPlanSchema, ZTCSponsorPlan } from "@workspace/types/index";
import { prisma } from "../../../infrastructure/database/prisma.js";
import { Tier } from "../../../generated/prisma/enums.js";

export class SponsorPlanService {
    static async createSponsorPlan(body: ZTCSponsorPlan){
        const validateBody = ZCSponsorPlanSchema.parse(body)

        const { name, amount, currency, tier, benefits, description, sortOrder, isActive, isFeatured } = validateBody
      
        const createSponsorPlan = await prisma.sponsorPlan.create({
            data: {
                name,
                amount,
                currency,
                tier: tier.toUpperCase() as Tier,
                benefits,
                description,
                slug: name.toLowerCase().replace(/\s+/g, "-"),
                
                sortOrder: sortOrder ?? 0,
                isActive: isActive ?? true,
                isFeatured: isFeatured ?? false
            }
        })

        return createSponsorPlan
    }

    static async getAllSponsorPlan() {
        const sponsorPlans = await prisma.sponsorPlan.findMany({
            orderBy: { sortOrder: "asc" }
        })

        return sponsorPlans
    }

    static async getSponsorPlanById(id: string) {
        const sponsorPlan = await prisma.sponsorPlan.findUnique({
            where: {
                id
            }
        })

        return sponsorPlan
    }

    static async updateSponsorPlan(id: string, body: ZTCSponsorPlan) {
        const validateBody = ZCSponsorPlanSchema.parse(body)

        const { name, amount, currency, tier, benefits, description, sortOrder, isActive, isFeatured } = validateBody

        const updateSponsorPlan = await prisma.sponsorPlan.update({
            where: {
                id
            },
            data: {
                name,
                amount,
                currency,
                tier: tier.toUpperCase() as Tier,
                benefits,
                description,
                slug: name.toLowerCase().replace(/\s+/g, "-"),
                sortOrder: sortOrder ?? 0,
                isActive: isActive ?? true,
                isFeatured: isFeatured ?? false
            }
        })

        return updateSponsorPlan
    }

    static async deleteSponsorPlan(id: string) {
        const deleteSponsorPlan = await prisma.sponsorPlan.delete({
            where: {
                id
            }
        })

        return deleteSponsorPlan
    }
}