import { ReqRef, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";
import { ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";
import { notFound } from "@hapi/boom";

interface GetIncidenceParams {
  habitId: string;
  yearRange: string;
}

export const getIncidenceParamsSchema = Joi.object<GetIncidenceParams, true>({
  habitId: Joi.string().required(),
  yearRange: Joi.string().required(),
});

type GetIncidenceArgs = ReqRef & {
  Params: GetIncidenceParams;
};

export const GetIncidenceByYearController = async (
  req: ServerRequest<GetIncidenceArgs>,
  h: ResponseToolkit
) => {
  const { habitId, yearRange } = req.params;

  const result = await prismaClient.incidence.findFirst({
    where: {
      habitId,
      yearRange,
    },
  });

  // Should I create instead?
  if (!result) notFound();

  return {
    data: result,
  };
};
