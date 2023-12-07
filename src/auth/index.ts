import { AuthCredentials, Server } from "@hapi/hapi";
import jwksRsa from "jwks-rsa";
import { JwtValidateReturn, JwtDecoded } from "../core/types";

export const loadAuth = (server: Server) => {
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
      audience: process.env.AUTH0_AUDIENCE,
      algorithms: ["RS256"],
    },
  });
  return server;
};
