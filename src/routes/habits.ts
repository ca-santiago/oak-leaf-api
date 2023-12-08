import { ServerRoute } from "@hapi/hapi";
import {
  CreateHabitController,
  createHabitSchema,
} from "../controllers/habits/create";
import { failActionHandler } from "../helper/validation";
import {
  GetHabitsByUserIdController,
  GetHabitsByUserIdControllerV2,
  getHabitsByUserIdControllerV2Schema,
} from "../controllers/habits/getByUserId";

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
    method: "GET",
    path: "/habits/{yearRange}",
    options: {
      auth: "auth0",
      validate: {
        params: getHabitsByUserIdControllerV2Schema,
        failAction: failActionHandler,
      },
    },
    handler: GetHabitsByUserIdControllerV2,
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
