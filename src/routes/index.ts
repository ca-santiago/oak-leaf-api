import { Server, ServerRoute } from "@hapi/hapi";
import { HabitsRouter } from "./habits";
import { VERSION } from "../core/constants";
import { getAccountRoutes } from "./account";
import { getInvitesRoute } from "./plans";

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
  server.route(getInvitesRoute("/invites"));
  server.route(HabitsRouter);
  return server;
};
