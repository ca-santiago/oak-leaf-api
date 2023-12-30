import { ServerRoute } from "@hapi/hapi";
import { failActionHandler } from "../helper/validation";
import {
  GetInviteByIdController,
  GetInviteByIdParamsSchema,
} from "../controllers/plans/invites-getById";

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
  ];
};
