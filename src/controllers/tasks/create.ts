import { ReqRef, ResponseToolkit } from "@hapi/hapi";
import Joi, { string } from "joi";
import { ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";
import { conflict, unauthorized } from "@hapi/boom";

interface CreateTaskPayload {
  title: string;
  date: string;
  habitId: string;
  status: string;
  description?: string;
}

export const createTaskSchema = Joi.object<CreateTaskPayload, true>({
  title: Joi.string().required(),
  date: Joi.string().required(),
  habitId: Joi.string().required(),
  status: Joi.string().required(),
  description: Joi.string().optional(),
});

type CreateTaskArgs = ReqRef & {
  Payload: CreateTaskPayload;
};

export const CreateTaskController = async (
  req: ServerRequest<CreateTaskArgs>,
  h: ResponseToolkit
) => {
  const { title, description, date, status, habitId } = req.payload;
  const userId = req.auth.credentials.userId;

  const exists = await prismaClient.habit.findFirst({
    where: {
      id: habitId,
      userId,
    },
  });

  if (!exists) return conflict("Cannot create a task for given habit");

  const newTask = await prismaClient.task.create({
    data: {
      habitId,
      date,
      title,
      description,
      ownerId: userId,

      // TODO: casantiago - Helper function to validate status
      status,
    },
  });

  return {
    data: newTask,
  };
};
