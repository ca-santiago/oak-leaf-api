import { ResponseToolkit } from "@hapi/hapi";
import { ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";
import Joi from "joi";

export const GetHabitsByUserIdController = async (
  req: ServerRequest<any>,
  h: ResponseToolkit
) => {
  // TODO: casantiago 7-12-2023
  // const { start, end } = req.query;
  const userId = req.auth.credentials.userId;
  const lte = new Date(Date.now());
  const gte = new Date(lte);
  gte.setMonth(gte.getMonth() - 6);
  gte.setDate(1);

  const habits = await prismaClient.habit.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      completions: true,
    },
  });
  return {
    data: habits,
  };
};

export const getHabitsByUserIdControllerV2Schema = Joi.object({
  yearRange: Joi.string()
    .regex(new RegExp(/[0-9]{4}$/))
    .required(),
});

export const GetHabitsByUserIdControllerV2 = async (
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
        },
        take: 1,
      },
    },
  });

  return {
    data: habits,
  };
};
