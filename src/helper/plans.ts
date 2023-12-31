import { PLANS, PlanDefinition, PlanType } from "../core/plans";
import { ServerRequest } from "../core/types";

export const getPlanDetailsFromType = (type: string, request: ServerRequest<any>): PlanDefinition => {
    const found = PLANS[type as PlanType];
    if (!found) {
        request.logger.info(['getPlanDetailsFromType'], `No plan found. user=${request.auth.credentials.userId} planType=${type}`);
        return PLANS.basic;
    }
    return found;
}
