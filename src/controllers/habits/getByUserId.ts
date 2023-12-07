import { ResponseToolkit } from "@hapi/hapi";
import { ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";

export const GetHabitsByUserIdController = async (
  req: ServerRequest<any>,
  h: ResponseToolkit
) => {
  const userId = req.auth.credentials.userId;
  const newHabit = await prismaClient.habit.findMany({
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
    data: newHabit,
  };
};
