import { Server } from "@hapi/hapi";
import jwksRsa from "jwks-rsa";
import { JwtValidateReturn, JwtDecoded, ServerRequest } from "../core/types";
import { unauthorized } from "@hapi/boom";
import { prismaClient } from "../services/prisma/client";
import jwt from 'hapi-auth-jwt2';

const loadSchemas = (server: Server) => {
  server.auth.scheme("b64", (_: Server, options: any) => {
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
};

export const loadAuth = async (server: Server) => {
  loadSchemas(server);

  server.auth.strategy("auth0", "jwt", {
    complete: true,
    headerKey: "authorization",
    tokenType: "Bearer",
    key: jwksRsa.hapiJwt2KeyAsync({
      cache: true,
      jwksUri: `${process.env.AUTH0_ISSUER_BASE_URL}/.well-known/jwks.json`,
    }),
    validate: async (decoded: JwtDecoded, request: ServerRequest): Promise<JwtValidateReturn> => {
      request.logger.info(['auth0', 'validate'], JSON.stringify({ decoded }));
      const found = await prismaClient.account.findFirst({
        where: {
          externalId: decoded.sub,
        },
      });

      if (!found) {
        return {
          isValid: false,
        };
      }

      return {
        isValid: true,
        credentials: {
          decoded,
          userId: found.id,
        },
      };
    },
    verifyOptions: {
      audience: process.env.AUTH0_AUDIENCE,
      algorithms: ["RS256"],
    },
    errorFn(ctx: jwt.ErrorContext, request: ServerRequest) {
      request.logger.error(['auth0', 'jwt'], ctx.message)
    },
  });

  server.auth.strategy("internal", "b64", {
    clientId: process.env.SYSTEM_CLIENT_ID,
    clientSecret: process.env.SYSTEM_CLIENT_SECRET,
  });

  return server;
};
