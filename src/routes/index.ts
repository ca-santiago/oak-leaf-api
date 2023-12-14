import { Server, ServerRoute } from "@hapi/hapi";
import { HabitsRouter } from "./habits";
import { getIncidencesRoutes } from "./incidences";
import { VERSION } from "../core/constants";
import { getAccountRoutes } from "./account";

const metadataRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/info",
    handler: () => {
      return {
        version: VERSION,
      };
    },
  },
  {
    method: "GET",
    path: "/ping",
    handler: () => {
      return "pong";
    },
  },
];

export const loadRoutes = (server: Server): Server => {
  server.route(metadataRoutes);
  server.route(getAccountRoutes("/accounts"));
  server.route(HabitsRouter);
  server.route(getIncidencesRoutes("/incidences"));
  return server;
};
