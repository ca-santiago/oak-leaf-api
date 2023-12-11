import { PrismaClient } from "@prisma/client";

const devOptions = {
  log: ["query", "info", "error"],
};

const options = process.env.ENV === "prod" ? {} : devOptions;

export const prismaClient = new PrismaClient(options);
