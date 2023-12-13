import { Server } from "@hapi/hapi";
import { HabitsRouter } from "./habits";
import { getIncidencesRoutes } from "./incidences";
import { VERSION } from "../core/constants";
import { getAccountRoutes } from "./account";

export const loadRoutes = (server: Server): Server => {
  server.route({
    method: "GET",
    path: "/ping",
    handler: (request, h) => {
      return "pong";
    },
  });
  server.route({
    method: "GET",
    path: "/info",
    handler: () => {
      return {
        version: VERSION,
      };
    },
  });
  server.route(getAccountRoutes("/accounts"));
  server.route(HabitsRouter);
  server.route(getIncidencesRoutes("/incidences"));
  return server;
};
