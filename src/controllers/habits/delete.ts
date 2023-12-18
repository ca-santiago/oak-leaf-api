import { ReqRef, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";
import { ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";

interface DeleteHabitParams {
    habitId: string;
}

export const deleteHabitParamsSchema = Joi.object<DeleteHabitParams, true>({
    habitId: Joi.string().optional(),
});

type deleteHabitArgs = ReqRef & {
    Params: DeleteHabitParams;
};

export const deleteHabitController = async (
    req: ServerRequest<deleteHabitArgs>,
    h: ResponseToolkit
) => {
    const { habitId } = req.params;
    const userId = req.auth.credentials.userId;

    const found = await prismaClient.habit.findUnique({
        where: {
            id: habitId,
            userId
        }
    });

    if (found) {
        await prismaClient.$transaction([
            prismaClient.incidence.deleteMany({
                where: {
                    habitId
                }
            }),
            prismaClient.habit.delete({
                where: {
                    id: habitId,
                    userId
                },
            }),
        ])
    }


    return {
        id: habitId,
    };
};
