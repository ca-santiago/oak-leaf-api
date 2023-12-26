"use strict";
import Hapi from "@hapi/hapi";
import jwt from "hapi-auth-jwt2";
import { loadAuth } from "./auth";
import { loadRoutes } from "./routes";
import HapiPino from "hapi-pino";

const devOrigins: string[] = [];

if (process.env.NODE_ENV === "stage") {
  devOrigins.push("http://stage-habits.casantiago.com");
  devOrigins.push("http://stage.habits.com:3000");
} else if (process.env.NODE_ENV === "dev") {
  devOrigins.push("http://localhost:3000");
}

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: "localhost",
    routes: {
      cors: {
        origin: [
          "https://habits.casantiago.com",
          "https://habits-stage.casantiago.com",
          ...devOrigins,
        ],
      },
    },
  });

  // PLUGINS
  await server.register(jwt);
  await server.register(HapiPino);

  await loadAuth(server);
  loadRoutes(server);

  await server.start();
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
