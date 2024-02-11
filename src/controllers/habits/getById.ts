import { ReqRef, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";
import { ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";
import { notFound } from "@hapi/boom";

interface GetHabitByIdParams {
  habitId: string;
}

export const getHabitByIdParamsSchema = Joi.object<GetHabitByIdParams, true>({
  habitId: Joi.string().optional(),
});

type GetHabitByIdArgs = ReqRef & {
  Params: GetHabitByIdParams;
};

export const getHabitByIdController = async (
  req: ServerRequest<GetHabitByIdArgs>
) => {
  const { habitId } = req.params;

  const found = await prismaClient.habit.findUnique({
    where: {
      id: habitId
    },
  });

  if (!found) return notFound();

  return {
    data: found,
  };
};
