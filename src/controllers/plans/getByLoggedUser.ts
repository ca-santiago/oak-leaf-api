import { ResponseToolkit } from "@hapi/hapi";
import { ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";
import { notFound } from "@hapi/boom";

export const GetInviteByUserController = async (
  req: ServerRequest,
  h: ResponseToolkit
) => {
  const { userId } = req.auth.credentials;

  const invite = await prismaClient.accountInvite.findFirst({
    where: {
      accountId: userId,
      usedByUserId: null,
    },
  });

  if (!invite) {
    return notFound();
    // Need to create a new one, because the last available is already used
    // This means a single user can invite more than one person
    // Disabled for now since I want a given user to invite just once
    // return await prismaClient.accountInvite.create({
    //   data: {
    //     accountId: userId,
    //     inviteCode: v4(),
    //   },
    // });
  }

  return {
    data: invite,
  };
};
