import { Server } from "@hapi/hapi";
import { HabitsRouter } from "./habits";
import { CompletionsRouter } from "./completion";
import { getIncidencesRoutes } from "./incidences";

export const loadRoutes = (server: Server): Server => {
  server.route(HabitsRouter);
  server.route(CompletionsRouter);
  server.route(getIncidencesRoutes('/incidences'));
  return server;
};
