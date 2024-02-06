import { ReqRef, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";
import { EItemStatus, ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";
import { conflict } from "@hapi/boom";

function isValidStatus(s: string): boolean {
  return Object.values(EItemStatus).includes(s);
}

interface UpdateTaskPayload {
  title: string;
  status: string;
  description?: string;
}

interface UpdateTaskParams {
  taskId: string;
}

export const updateTaskPayloadSchema = Joi.object<UpdateTaskPayload, true>({
  title: Joi.string().optional(),
  status: Joi.string().optional(),
  description: Joi.string().optional(),
}).min(1);

export const updateTaskParams = Joi.object<UpdateTaskParams, true>({
  taskId: Joi.string().required(),
});

type updateTaskArgs = ReqRef & {
  Payload: UpdateTaskPayload;
  Params: UpdateTaskParams;
};

export const UpdateTaskController = async (
  req: ServerRequest<updateTaskArgs>,
  h: ResponseToolkit
) => {
  const { title, description, status } = req.payload;
  const userId = req.auth.credentials.userId;
  const taskId = req.params.taskId;

  const exists = await prismaClient.task.findUnique({
    where: {
      ownerId: userId,
      id: taskId,
    },
  });

  if (!exists) return conflict("Invalid task");

  if (!isValidStatus(status)) return conflict("Invalid status");

  const updated = await prismaClient.task.update({
    where: {
      id: exists.id,
    },
    data: {
      title,
      description,
      status,
    },
  });

  return {
    data: updated,
  };
};
