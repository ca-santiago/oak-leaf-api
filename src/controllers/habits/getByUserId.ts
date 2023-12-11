import { ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";
import Joi from "joi";

export const getHabitsByUserIdControllerV2Schema = Joi.object({
  yearRange: Joi.string()
    .regex(new RegExp(/[0-9]{4}$/))
    .required(),
});

export const GetHabitsByUserIdController = async (
  req: ServerRequest<any>
) => {
  const userId = req.auth.credentials.userId;
  const yearRange = req.params.yearRange;

  const habits = await prismaClient.habit.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      incidences: {
        where: {
          yearRange,
        }
      },
    },
  });

  return {
    data: habits,
  };
};
