import { ResponseToolkit } from "@hapi/hapi";
import { ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";
import { notFound } from "@hapi/boom";

export const GetAccountController = async (
  req: ServerRequest,
  h: ResponseToolkit
) => {
  const { userId } = req.auth.credentials;

  const exists = await prismaClient.account.findFirst({
    where: {
      id: userId,
    },
  });

  if (!exists) notFound();

  return {
    data: exists,
  };
};
