import { ServerRoute } from "@hapi/hapi";
import {
  CreateHabitController,
  createHabitSchema,
} from "../controllers/habits/create";
import { failActionHandler } from "../helper/validation";

export const HabitsRouter: ServerRoute[] = [
  {
    method: "POST",
    path: "/habits",
    options: {
      auth: "auth0",
      validate: {
        payload: createHabitSchema,
        failAction: failActionHandler,
      },
    },
    handler: CreateHabitController,
  },
];
