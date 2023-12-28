import { ReqRef, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";
import { ServerRequest } from "../../core/types";
import { prismaClient } from "../../services/prisma/client";
import { conflict } from "@hapi/boom";
import { PLANS, PlanType } from "../../core/plans";
import { v4 } from "uuid";

interface CreateAccountPayload {
  externalId: string;
  email: string;
  inviteCode?: string;
  username?: string;
  picture?: string;
}

export const createAccountSchema = Joi.object<CreateAccountPayload, true>({
  externalId: Joi.string().required(),
  email: Joi.string().required(),
  inviteCode: Joi.string().optional(),
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
  const { email, externalId, picture, username, inviteCode } = req.payload;

  const exists = await prismaClient.account.findFirst({
    where: {
      externalId: externalId,
    },
  });

  if (exists) return conflict();

  const endDate = new Date();
  endDate.setFullYear(9999);

  if (!inviteCode) {
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

    await prismaClient.accountInvite.create({
      data: {
        accountId: newAccount.id,
        inviteCode: v4(),
      },
    });

    return { data: newAccount };
  }

  // Create with code

  let planType: PlanType = PLANS.basic.type;

  const validInviteCodeInstance = await prismaClient.accountInvite.findFirst({
    where: {
      inviteCode,
    },
  });

  // Given code exists and it is not used
  if (validInviteCodeInstance && !validInviteCodeInstance?.usedByUserId) {
    planType = PLANS.advanced.type;

    // Create account with augmented plan
    const newAccount = await prismaClient.account.create({
      data: {
        contactEmail: email,
        externalId,
        imageUri: picture || undefined,
        preferredName: username || undefined,
        planType: PLANS.advanced.type,
        planInitDate: new Date(),
        planEndDate: endDate,
      },
    });

    // Send email?

    await Promise.all([
      // Create inviteCode for the new user
      prismaClient.accountInvite.create({
        data: {
          accountId: newAccount.id,
          inviteCode: v4(),
        },
      }),
      // Update given code
      prismaClient.accountInvite.update({
        where: {
          id: validInviteCodeInstance.id,
        },
        data: {
          usedByUserId: newAccount.id,
        },
      }),
      // Update account owner of the invite
      prismaClient.account.update({
        where: {
          id: validInviteCodeInstance.accountId,
        },
        data: {
          planType: PLANS.advanced.type,
        },
      }),
    ]);

    return {
      data: newAccount,
      inviteCodeOutcomeCode: 200,
    };
  } else {
    // Invalid code, just create a return it
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

    await prismaClient.accountInvite.create({
      data: {
        accountId: newAccount.id,
        inviteCode: v4(),
      },
    });

    return {
      data: newAccount,
      inviteCodeOutcomeCode: 409,
    };
  }
};
