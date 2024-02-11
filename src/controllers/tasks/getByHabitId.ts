import { ReqRef, ResponseToolkit } from "@hapi/hapi";
import { ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";
import Joi from "joi";

interface GetTasksByHabitIdParams {
  habitId: string;
}

export const getTasksByHabitIdSchema = Joi.object<
  GetTasksByHabitIdParams,
  true
>({
  habitId: Joi.string().required(),
});

type getTasksArgs = ReqRef & {
  Params: GetTasksByHabitIdParams;
};

export const GetTasksByHabitIdController = async (
  req: ServerRequest<getTasksArgs>,
  h: ResponseToolkit
) => {
  const userId = req.auth.credentials.userId;
  const habitId = req.params.habitId;

  const tasks = await prismaClient.task.findMany({
    where: {
      ownerId: userId,
      habitId,
    },
  });

  return {
    data: tasks,
    habitId,
  };
};
