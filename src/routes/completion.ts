import { ServerRoute } from "@hapi/hapi";
import {
  CreateCompletionController,
  completionSchema,
} from "../controllers/completion/create";
import { failActionHandler } from "../helper/validation";
import { UpdateCompletionController, updateCompletionJoi } from "../controllers/completion/update";

export const CompletionsRouter: ServerRoute[] = [
  {
    method: "POST",
    path: "/completions",
    options: {
      auth: "auth0",
      validate: {
        payload: completionSchema,
        failAction: failActionHandler,
      },
    },
    handler: CreateCompletionController,
  },
  {
    method: "PATCH",
    path: "/completions",
    options: {
      auth: "auth0",
      validate: {
        payload: updateCompletionJoi,
        failAction: failActionHandler,
      },
    },
    handler: UpdateCompletionController,
  },
];
