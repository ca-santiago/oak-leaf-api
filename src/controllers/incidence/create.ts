import { ReqRef, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";
import { ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";
import { forbidden } from "@hapi/boom";

interface CreateIncidencePayload {
  habitId: string;
  dateRanges: string;
  yearRange: string;
}

export const createIncidenceSchema = Joi.object<CreateIncidencePayload, true>({
  dateRanges: Joi.string().required(),
  yearRange: Joi.string().required(),
  habitId: Joi.string().required(),
});

type CreateIncidenceArgs = ReqRef & {
  Payload: CreateIncidencePayload;
};

export const CreateIncidenceController = async (
  req: ServerRequest<CreateIncidenceArgs>,
  h: ResponseToolkit
) => {
  const { dateRanges, habitId, yearRange } = req.payload;
  const userId = req.auth.credentials.userId;

  const exists = await prismaClient.habit.findUnique({
    where: {
      id: habitId,
      userId,
    },
  });

  if (!exists) return forbidden();

  const existingIncidence = await prismaClient.incidence.findFirst({
    where: {
      habitId,
      yearRange,
    },
  });

  if (existingIncidence)
    return {
      data: existingIncidence,
    };

  const newIncidence = await prismaClient.incidence.create({
    data: {
      dateRanges,
      yearRange,
      habitId,
    },
  });

  return {
    data: newIncidence,
  };
};
