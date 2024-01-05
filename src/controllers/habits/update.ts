import { ReqRef, ResponseToolkit } from "@hapi/hapi";
import Joi, { string } from "joi";
import { ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";
import { conflict, notFound } from "@hapi/boom";
import { getPlanDetailsFromType } from "../../helper/plans";

interface UpdateHabitPayload {
  habitName?: string;
  colorKey?: string;
  iconKey?: string;
  description?: string;
  completions?: string;
}

interface UpdateHabitParams {
  habitId: string;
}

export const updateHabitPayloadSchema = Joi.object<UpdateHabitPayload, true>({
  habitName: Joi.string().optional(),
  colorKey: Joi.string().optional(),
  iconKey: Joi.string().optional(),
  description: Joi.string().optional(),
  completions: Joi.string().optional(),
}).min(1);

export const updateHabitParams = Joi.object<UpdateHabitParams, true>({
  habitId: Joi.string().required(),
});

type updateHabitArgs = ReqRef & {
  Payload: UpdateHabitPayload;
  Params: UpdateHabitParams;
};

export const UpdateHabitController = async (
  req: ServerRequest<updateHabitArgs>,
  h: ResponseToolkit
) => {
  const { habitName, description, colorKey, iconKey, completions } = req.payload;
  const userId = req.auth.credentials.userId;
  const habitId = req.params.habitId;

  const exists = await prismaClient.habit.findUnique({
    where: {
      userId,
      id: habitId,
    },
  });

  if (!exists) return notFound();

  // Need to add some validation to completions?

  const updated = await prismaClient.habit.update({
    where: {
      id: exists.id,
    },
    data: {
      habitName,
      userId,
      description,
      colorKey,
      iconKey,
      completions
    },
  });

  return {
    data: updated,
  };
};
