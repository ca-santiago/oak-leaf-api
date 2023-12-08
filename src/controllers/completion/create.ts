import { ReqRef, ResponseToolkit } from "@hapi/hapi";
import { ServerRequest } from "../../core/types";
import Joi from "joi";
import { prismaClient } from "../../services/prisma/client";

export interface CreateCompletionProps {
  habitId: string;
  date: string;
}

export const completionSchema = Joi.object<CreateCompletionProps>({
  habitId: Joi.string().required(),
  date: Joi.string().isoDate(),
});

type CreateCompletionArgs = ReqRef & {
  Payload: CreateCompletionProps;
};

export const CreateCompletionController = async (
  req: ServerRequest<CreateCompletionArgs>,
  h: ResponseToolkit
) => {
  const { habitId } = req.payload;
  const date = new Date(req.payload.date).toISOString();

  const newCompletion = await prismaClient.completion.create({
    data: {
      completed: true,
      completionDate: date,
      habitId,
    },
  });

  return { data: newCompletion };
};
