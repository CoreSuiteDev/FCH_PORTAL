import { ZCSponsorPlanSchema, ZTCSponsorPlan } from "@workspace/types/index";
import { prisma } from "../../../infrastructure/database/prisma.js";



export class SponsorPlanService {
    static async createSponsorPlan(body: ZTCSponsorPlan){
        const validateBody = ZCSponsorPlanSchema.parse(body)


        const {planName, amount, currency, tier, benefits, description} = validateBody
      
        const createSponsorPlan = await prisma.sponsorPlans.create({
            data: {
                planName,
                amount,
                currency,
                tier,
                benefits,
                description
            }
        })

        return createSponsorPlan
    }


    static async getAllSponsorPlan() {
        const sponsorPlans = await prisma.sponsorPlans.findMany()

        return sponsorPlans
    }

    static async getSponsorPlanById(id: string) {
        const sponsorPlan = await prisma.sponsorPlans.findUnique({
            where: {
                id
            }
        })

        return sponsorPlan
    }

    static async updateSponsorPlan(id: string, body: ZTCSponsorPlan) {
        const validateBody = ZCSponsorPlanSchema.parse(body)

        const {planName, amount, currency, tier, benefits, description} = validateBody

        const updateSponsorPlan = await prisma.sponsorPlans.update({
            where: {
                id
            },
            data: {
                planName,
                amount,
                currency,
                tier,
                benefits,
                description
            }
        })

        return updateSponsorPlan
    }



    static async deleteSponsorPlan(id: string) {
        const deleteSponsorPlan = await prisma.sponsorPlans.delete({
            where: {
                id
            }
        })

        return deleteSponsorPlan
    }
}