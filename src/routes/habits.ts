import { ServerRoute } from "@hapi/hapi";
import {
  CreateHabitController,
  createHabitSchema,
} from "../controllers/habits/create";
import { failActionHandler } from "../helper/validation";
import { GetHabitsByUserIdController } from "../controllers/habits/getByUserId";

export const HabitsRouter: ServerRoute[] = [
  {
    method: "GET",
    path: "/habits",
    options: {
      auth: "auth0",
    },
    handler: GetHabitsByUserIdController,
  },
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
