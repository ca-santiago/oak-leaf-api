import { Request, ResponseToolkit } from "@hapi/hapi";

export const failActionHandler = (
  _: Request,
  h: ResponseToolkit,
  err?: Error
) => {
  if (err) {
    // Log ??
    if (process.env.NODE_ENV === "prod") return h.continue;
    else throw err;
  }
  return h.continue;
};
