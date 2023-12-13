import { Server } from "@hapi/hapi";
import jwksRsa from "jwks-rsa";
import { JwtValidateReturn, JwtDecoded } from "../core/types";
import { unauthorized } from "@hapi/boom";

export const loadAuth = async (server: Server) => {
  server.auth.scheme("b64", (server: Server, options: any) => {
    return {
      authenticate(request, h) {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
          return unauthorized("Authorization header is missing");
        }

        const b64String = authHeader.split(" ")[1];

        const [id, secret] = Buffer.from(b64String, "base64")
          .toString("utf-8")
          .split(":");

        if (id === options?.clientId && secret === options?.clientSecret) {
          return h.continue;
        }

        return unauthorized("Invalid credentials");
      },
    };
  });

  server.auth.strategy("auth0", "jwt", {
    complete: true,
    headerKey: "authorization",
    tokenType: "Bearer",
    key: jwksRsa.hapiJwt2KeyAsync({
      cache: true,
      jwksUri: `${process.env.AUTH0_ISSUER_BASE_URL}/.well-known/jwks.json`,
    }),
    validate: (decoded: JwtDecoded): JwtValidateReturn => {
      return {
        isValid: true,
        credentials: {
          decoded,
          userId: decoded.sub,
        },
      };
    },
    verifyOptions: {
      ignoreExpired: true,
      audience: process.env.AUTH0_AUDIENCE,
      algorithms: ["RS256"],
    },
    errorFn(err: any) {
      console.log(err);
    },
  });

  server.auth.strategy("internal", "b64", {
    clientId: process.env.SYSTEM_CLIENT_ID,
    clientSecret: process.env.SYSTEM_CLIENT_SECRET,
  });

  return server;
};
