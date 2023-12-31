import { ServerRoute } from "@hapi/hapi";
import { failActionHandler } from "../helper/validation";
import {
  GetInviteByIdController,
  GetInviteByIdParamsSchema,
} from "../controllers/plans/invites-getById";
import { GetInviteByUserController } from "../controllers/plans/getByLoggedUser";

export const getInvitesRoute = (basePath: string): ServerRoute[] => {
  return [
    {
      method: "GET",
      path: basePath + "/{id}",
      handler: GetInviteByIdController,
      options: {
        validate: {
          params: GetInviteByIdParamsSchema,
          failAction: failActionHandler,
        },
      },
    },
    {
      method: "GET",
      path: basePath,
      handler: GetInviteByUserController,
      options: {
        auth: "auth0",
      },
    },
  ];
};
