import { ReqRef, ResponseToolkit } from "@hapi/hapi";
import { ServerRequest, completionDateRegex } from "../../core/types";
import Joi from "joi";
import { prismaClient } from "../../services/prisma/client";

export interface CreateCompletionProps {
  habitId: string;
  active?: boolean;
  date: string;
}

export const completionSchema = Joi.object<CreateCompletionProps>({
  habitId: Joi.string().required(),
  active: Joi.boolean().optional(),
  date: Joi.string().regex(completionDateRegex).required(),
});

type CreateCompletionArgs = ReqRef & {
  Payload: CreateCompletionProps;
};

export const CreateCompletionController = async (
  req: ServerRequest<CreateCompletionArgs>,
  h: ResponseToolkit
) => {
  const { habitId, active, date } = req.payload;
  const existingCompletion = await prismaClient.completion.findFirst({
    where: {
      habitId,
      completionDate: date,
    },
  });

  if (existingCompletion) {
    const updatedCompletion = await prismaClient.completion.update({
      data: {
        ...existingCompletion,
        completed: active,
      },
      where: {
        id: existingCompletion.id,
      },
    });
    return { data: updatedCompletion };
  }

  const newCompletion = await prismaClient.completion.create({
    data: {
      completed: true,
      completionDate: date,
      habitId,
    },
  });

  return { data: newCompletion };
};
