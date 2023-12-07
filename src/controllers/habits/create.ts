import { ReqRef, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";
import { ServerRequest } from "../../core/types";

interface CreateHabitPayload {
  habitName: string;
  description?: string;
}

export const createHabitSchema = Joi.object<CreateHabitPayload>({
  habitName: Joi.string().required(),
  description: Joi.string().optional(),
});

type CreateHabitArgs = ReqRef & {
  Payload: CreateHabitPayload;
};

export const CreateHabitController = (
  req: ServerRequest<CreateHabitArgs>,
  h: ResponseToolkit
) => {
  const { habitName, description } = req.payload;
  console.log(req.auth.credentials);
  return req.payload;
};
