import { PrismaClient } from "@prisma/client";

const devOptions = {
  log: ["query", "info", "error"],
};

const options = process.env.NODE_ENV === "production" ? {} : devOptions;

export const prismaClient = new PrismaClient(options);
