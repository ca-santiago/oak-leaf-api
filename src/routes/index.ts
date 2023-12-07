import { Server } from "@hapi/hapi";
import { HabitsRouter } from "./habits";
import { CompletionsRouter } from "./completion";

export const loadRoutes = (server: Server): Server => {
  server.route(HabitsRouter);
  server.route(CompletionsRouter);
  return server;
};
