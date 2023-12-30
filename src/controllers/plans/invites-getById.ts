import { ReqRef, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";
import { ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";
import { notFound } from "@hapi/boom";

interface GetInviteByIdParams {
  id: string;
}

export const GetInviteByIdParamsSchema = Joi.object<GetInviteByIdParams, true>({
  id: Joi.string().required(),
});

type GetInviteByIdArgs = ReqRef & {
  Params: GetInviteByIdParams;
};

export const GetInviteByIdController = async (
  req: ServerRequest<GetInviteByIdArgs>,
  h: ResponseToolkit
) => {
  const { id } = req.params;

  const invite = await prismaClient.accountInvite.findUnique({
    where: {
      id,
    },
  });

  if (!invite) return notFound();

  return {
    data: invite,
  };
};
