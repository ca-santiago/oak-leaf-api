import { ResponseToolkit } from "@hapi/hapi";
import { ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";

export const GetTaskController = async (
  req: ServerRequest,
  h: ResponseToolkit
) => {
  const userId = req.auth.credentials.userId;

  const tasks = await prismaClient.task.findMany({
    where: {
      ownerId: userId,
    },
  });

  return {
    data: tasks,
  };
};
