import { ServerRoute } from "@hapi/hapi";
import {
  CreateHabitController,
  createHabitSchema,
} from "../controllers/habits/create";
import { failActionHandler } from "../helper/validation";
import {
  GetHabitsByUserIdController,
  getHabitsByUserIdControllerV2Schema,
} from "../controllers/habits/getByUserId";
import {
  deleteHabitController,
  deleteHabitParamsSchema,
} from "../controllers/habits/delete";
import {
  UpdateHabitController,
  updateHabitParams,
  updateHabitPayloadSchema,
} from "../controllers/habits/update";

export const HabitsRouter: ServerRoute[] = [
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
  {
    method: "DELETE",
    path: "/habits/{habitId}",
    options: {
      auth: "auth0",
      validate: {
        params: deleteHabitParamsSchema,
        failAction: failActionHandler,
      },
    },
    handler: deleteHabitController,
  },
  {
    method: "PUT",
    path: "/habits/{habitId}",
    options: {
      auth: "auth0",
      validate: {
        params: updateHabitParams,
        payload: updateHabitPayloadSchema,
        failAction: failActionHandler,
      },
    },
    handler: UpdateHabitController,
  },
];
