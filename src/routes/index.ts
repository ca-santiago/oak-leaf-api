import { Server } from "@hapi/hapi";
import { HabitsRouter } from "./habits";

export const loadRoutes = (server: Server): Server => {
  server.route(HabitsRouter);
  return server;
};
