import { ReqRef, ResponseToolkit } from "@hapi/hapi";
import { ServerRequest } from "../../core/types";
import Joi from "joi";
import { prismaClient } from "../../services/prisma/client";

export interface CreateCompletionProps {
  completionId: string;
  status: boolean;
}

export const updateCompletionJoi = Joi.object<CreateCompletionProps>({
  completionId: Joi.string().required(),
  status: Joi.boolean().required(),
});

type CreateCompletionArgs = ReqRef & {
  Payload: CreateCompletionProps;
};

export const UpdateCompletionController = async (
  req: ServerRequest<CreateCompletionArgs>,
  h: ResponseToolkit
) => {
  const { completionId, status } = req.payload;

  const updatedCompletion = await prismaClient.completion.update({
    data: {
      completed: status,
    },
    where: {
      id: completionId,
    },
  });
  console.log({ updatedCompletion, status });
  return { data: updatedCompletion };
};
