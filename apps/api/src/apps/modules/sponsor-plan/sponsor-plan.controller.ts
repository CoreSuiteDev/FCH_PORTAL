import { ZTCSponsorPlan } from "@workspace/types/index"
import { SponsorPlanService } from "./sponsor-plan.service.js"



export class SponsorPlanController {
    static async createSponsorPlan(body: ZTCSponsorPlan){
        return SponsorPlanService.createSponsorPlan(body)
    }

    static async getAllSponsorPlan(){
        return SponsorPlanService.getAllSponsorPlan()
    }

    static async getSponsorPlanById(id: string){
        return SponsorPlanService.getSponsorPlanById(id)
    }

    static async updateSponsorPlan(id: string, body: ZTCSponsorPlan){
        return SponsorPlanService.updateSponsorPlan(id, body)
    }

    static async deleteSponsorPlan(id: string){
        return SponsorPlanService.deleteSponsorPlan(id)
    }
}