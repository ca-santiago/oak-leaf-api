import { ServerRoute } from "@hapi/hapi";
import {
  CreateIncidenceController,
  createIncidenceSchema,
} from "../controllers/incidence/create";
import { failActionHandler } from "../helper/validation";
import {
  UpdateIncidenceController,
  updateIncidenceParamsSchema,
  updateIncidenceSchema,
} from "../controllers/incidence/update";
import {
  GetIncidenceController,
  getIncidenceParamsSchema,
} from "../controllers/incidence/getByYear";

export const getIncidencesRoutes = (basePath: string): ServerRoute[] => {
  return [
    {
      method: "POST",
      path: basePath,
      handler: CreateIncidenceController,
      options: {
        auth: "auth0",
        validate: {
          payload: createIncidenceSchema,
          failAction: failActionHandler,
        },
      },
    },
    {
      method: "PUT",
      path: basePath + "/{incidenceId}",
      handler: UpdateIncidenceController,
      options: {
        auth: "auth0",
        validate: {
          payload: updateIncidenceSchema,
          params: updateIncidenceParamsSchema,
        },
      },
    },
    {
      method: "GET",
      path: basePath + "/{incidenceId}",
      handler: GetIncidenceController,
      options: {
        auth: "auth0",
        validate: {
          params: getIncidenceParamsSchema,
        },
      },
    },
  ];
};
