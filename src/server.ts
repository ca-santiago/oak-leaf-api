"use strict";
import Hapi from "@hapi/hapi";
import jwt from "hapi-auth-jwt2";
import { loadAuth } from "./auth";
import { loadRoutes } from "./routes";

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"]
      },
    },
  });

  // PLUGINS
  await server.register(jwt);

  await loadAuth(server);
  loadRoutes(server);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
