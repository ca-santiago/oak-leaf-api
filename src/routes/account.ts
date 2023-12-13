import { ServerRoute } from "@hapi/hapi";
import { failActionHandler } from "../helper/validation";
import {
  CreateAccountController,
  createAccountSchema,
} from "../controllers/account/create";

export const getAccountRoutes = (basePath: string): ServerRoute[] => {
  return [
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
