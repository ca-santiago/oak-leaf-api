import { Server } from "@hapi/hapi";
import { HabitsRouter } from "./habits";
import { getIncidencesRoutes } from "./incidences";

export const loadRoutes = (server: Server): Server => {
  server.route(HabitsRouter);
  server.route(getIncidencesRoutes("/incidences"));
  return server;
};
