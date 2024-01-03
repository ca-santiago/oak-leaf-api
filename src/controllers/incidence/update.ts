import { ReqRef, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";
import { ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";

interface UpdateIncidencePayload {
  dateRanges: string;
  yearRange: string;
}

interface UpdateIncidenceParams {
  incidenceId: string;
}

export const updateIncidenceSchema = Joi.object<UpdateIncidencePayload, true>({
  dateRanges: Joi.string().required().min(0),
  yearRange: Joi.string().required(),
});

export const updateIncidenceParamsSchema = Joi.object<
  UpdateIncidenceParams,
  true
>({
  incidenceId: Joi.string().required(),
});

type UpdateIncidenceArgs = ReqRef & {
  Payload: UpdateIncidencePayload;
  Params: UpdateIncidenceParams;
};

export const UpdateIncidenceController = async (
  req: ServerRequest<UpdateIncidenceArgs>,
  h: ResponseToolkit
) => {
  const { dateRanges, yearRange } = req.payload;
  const { incidenceId } = req.params;

  const updated = await prismaClient.incidence.update({
    where: {
      id: incidenceId,
    },
    data: {
      dateRanges,
      yearRange,
    },
  });

  return {
    data: updated,
  };
};
