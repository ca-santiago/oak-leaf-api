import { ReqRef, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";
import { ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";
import { conflict } from "@hapi/boom";
import { PLANS } from "../../core/plans";

interface CreateAccountPayload {
  externalId: string;
  email: string;
  username?: string;
  picture?: string;
}

export const createAccountSchema = Joi.object<CreateAccountPayload, true>({
  externalId: Joi.string().required(),
  email: Joi.string().required(),
  picture: Joi.string().optional(),
  username: Joi.string().optional(),
});

type CreateAccountArgs = ReqRef & {
  Payload: CreateAccountPayload;
};

export const CreateAccountController = async (
  req: ServerRequest<CreateAccountArgs>,
  h: ResponseToolkit
) => {
  const { email, externalId, picture, username } = req.payload;

  const exists = await prismaClient.account.findFirst({
    where: {
      externalId: externalId,
    },
  });

  if (exists) return conflict();

  const endDate = new Date();
  endDate.setFullYear(9999);

  const newAccount = await prismaClient.account.create({
    data: {
      contactEmail: email,
      externalId,
      imageUri: picture || undefined,
      preferredName: username || undefined,
      planType: PLANS.basic.type,
      planInitDate: new Date(),
      planEndDate: endDate,
    },
  });

  return {
    data: newAccount,
  };
};
