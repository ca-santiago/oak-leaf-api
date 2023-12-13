import { ReqRef, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";
import { ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";
import { conflict } from "@hapi/boom";

interface CreateAccountPayload {
  externalId: string;
  email: string;
  picture: string;
  username: string;
}

export const createAccountSchema = Joi.object<CreateAccountPayload, true>({
  externalId: Joi.string().required(),
  email: Joi.string().required(),
  picture: Joi.string().required(),
  username: Joi.string().required(),
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

  const newAccount = await prismaClient.account.create({
    data: {
      contactEmail: email,
      externalId,
      imageUri: picture,
      preferredName: username,
    },
  });

  return {
    data: newAccount,
  };
};
