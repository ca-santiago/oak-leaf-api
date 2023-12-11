import { ReqRef, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";
import { ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";
import { notFound } from "@hapi/boom";

interface GetIncidenceParams {
  id: string;
}

export const getIncidenceParamsSchema = Joi.object<GetIncidenceParams, true>({
  id: Joi.string().required(),
});

type GetIncidenceArgs = ReqRef & {
  Params: GetIncidenceParams;
};

export const GetIncidenceByIdController = async (
  req: ServerRequest<GetIncidenceArgs>,
  h: ResponseToolkit
) => {
  const { id } = req.params;

  const result = await prismaClient.incidence.findUnique({
    where: {
      id,
    },
  });

  // Should I create instead?
  if (!result) notFound();

  return {
    data: result,
  };
};
