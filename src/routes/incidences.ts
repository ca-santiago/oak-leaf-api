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
  GetIncidenceByYearController,
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
      path: basePath + "/{id}",
      handler: GetIncidenceByYearController,
      options: {
        auth: "auth0",
        validate: {
          params: getIncidenceParamsSchema,
        },
      },
    },
    {
      method: "GET",
      path: basePath + "/{yearRange}/habit/{habitId}",
      handler: GetIncidenceByYearController,
      options: {
        auth: "auth0",
        validate: {
          params: getIncidenceParamsSchema,
        },
      },
    },
  ];
};
