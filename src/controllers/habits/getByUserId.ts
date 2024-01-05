import { ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";

export const GetHabitsByUserIdController = async (req: ServerRequest<any>) => {
  const userId = req.auth.credentials.userId;

  const habits = await prismaClient.habit.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    data: habits,
  };
};
