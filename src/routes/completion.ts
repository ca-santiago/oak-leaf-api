import { ServerRoute } from "@hapi/hapi";
import {
  CreateCompletionController,
  completionSchema,
} from "../controllers/completion/create";
import { failActionHandler } from "../helper/validation";

export const CompletionsRouter: ServerRoute[] = [
  {
    method: "POST",
    path: "/completions",
    options: {
      auth: "auth0",
      validate: {
        payload: completionSchema,
        failAction: failActionHandler 
      },
    },
    handler: CreateCompletionController,
  },
];
