import { ReqRef, ResponseToolkit } from "@hapi/hapi";
import Joi  from "joi";
import { ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";

interface GetIncidenceParams {
  incidenceId: string;
}

export const getIncidenceParamsSchema = Joi.object<
  GetIncidenceParams,
  true
>({
  incidenceId: Joi.string().required(),
});

type GetIncidenceArgs = ReqRef & {
  Params: GetIncidenceParams;
};

export const GetIncidenceController = async (
  req: ServerRequest<GetIncidenceArgs>,
  h: ResponseToolkit
) => {
  const { incidenceId } = req.params;

  const result = await prismaClient.incidence.findUnique({
    where: {
      id: incidenceId,
    },
  });

  return {
    data: result,
  };
};
