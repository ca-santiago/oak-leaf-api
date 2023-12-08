import { ResponseToolkit } from "@hapi/hapi";
import { ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";

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
      completions: {
        where: {
          completionDate: {
            lte,
            gte,
          },
        },
      },
    },
  });
  return {
    data: habits,
  };
};
