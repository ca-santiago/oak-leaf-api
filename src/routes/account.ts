import { ServerRoute } from "@hapi/hapi";
import { failActionHandler } from "../helper/validation";
import {
  CreateAccountController,
  createAccountSchema,
} from "../controllers/account/create";
import { GetAccountController } from "../controllers/account/get";

export const getAccountRoutes = (basePath: string): ServerRoute[] => {
  return [
    {
      method: "GET",
      path: `${basePath}`,
      handler: GetAccountController,
      options: {
        auth: "auth0",
      },
    },
    {
      method: "POST",
      path: basePath,
      handler: CreateAccountController,
      options: {
        auth: {
          strategy: "internal",
        },
        validate: {
          payload: createAccountSchema,
          failAction: failActionHandler,
        },
      },
    },
  ];
};
