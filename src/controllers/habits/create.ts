import { ReqRef, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";
import { ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";
import { conflict } from "@hapi/boom";
import { getPlanDetailsFromType } from "../../helper/plans";

interface CreateHabitPayload {
  habitName: string;
  colorKey: string;
  iconKey: string;
  description?: string;
}

export const createHabitSchema = Joi.object<CreateHabitPayload, true>({
  habitName: Joi.string().required(),
  colorKey: Joi.string().required(),
  iconKey: Joi.string().required(),
  description: Joi.string().optional(),
});

type CreateHabitArgs = ReqRef & {
  Payload: CreateHabitPayload;
};

export const CreateHabitController = async (
  req: ServerRequest<CreateHabitArgs>,
  h: ResponseToolkit
) => {
  const { habitName, description, colorKey, iconKey } = req.payload;
  const userId = req.auth.credentials.userId;

  const accountSettings = await prismaClient.account.findUnique({
    where: {
      id: userId
    }
  });

  if (!accountSettings) {
    req.logger.error(['createHabit', 'account'], `Missing account info for, user=${userId}`);
    return conflict('Account is not fully configured, not account instance found');
  }

  const planDetails = getPlanDetailsFromType(accountSettings.planType, req);

  const currentHabits = await prismaClient.habit.count({
    where: {
      userId
    }
  });

  if (currentHabits >= planDetails.maxHabits) {
    return conflict(`Max habits reached for plan ${planDetails.type}`);
  }

  const newHabit = await prismaClient.habit.create({
    data: {
      habitName,
      userId,
      description,
      colorKey,
      iconKey,
    },
  });
  return {
    data: newHabit,
  };
};
