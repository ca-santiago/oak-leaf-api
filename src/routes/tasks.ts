import { ServerRoute } from "@hapi/hapi";
import { failActionHandler } from "../helper/validation";
import {
  CreateTaskController,
  createTaskSchema,
} from "../controllers/tasks/create";
import { GetTaskController } from "../controllers/tasks/getByOwner";
import { UpdateTaskController, updateTaskParams, updateTaskPayloadSchema } from "../controllers/tasks/update";

export const getTasksRoutes = (basePath: string): ServerRoute[] => {
  return [
    {
      method: "GET",
      path: `${basePath}`,
      handler: GetTaskController,
      options: {
        auth: "auth0",
      },
    },
    {
      method: "POST",
      path: basePath,
      handler: CreateTaskController,
      options: {
        auth: "auth0",
        validate: {
          payload: createTaskSchema,
          failAction: failActionHandler,
        },
      },
    },
    {
      method: "PATCH",
      path: `${basePath}/{taskId}`,
      handler: UpdateTaskController,
      options: {
        auth: "auth0",
        validate: {
          params: updateTaskParams,
          payload: updateTaskPayloadSchema,
        },
      },
    },
  ];
};
