import { PrismaClient } from "@prisma/client";

const devOptions = {
  log: ["query", "info", "error"],
};

const options = process.env.ENV === "pro" ? {} : devOptions;

export const prismaClient = new PrismaClient(options);
