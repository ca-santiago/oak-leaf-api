import { ReqRef, Request } from "@hapi/hapi";

export const completionDateRegex = new RegExp(/^\d{4}-\d{2}-\d{2}$/);

export interface JwtDecoded {
  iss: string;
  sub: string;
  aud: string[];
  iat: number;
  axp: number;
  azp: string;
  scope: string;
}

interface JwtAuthCredentials {
  decoded: JwtDecoded;
  userId: string;
}

export interface ServerExtendedAuthCredentials extends ReqRef {
  AuthCredentialsExtra: JwtAuthCredentials;
}

export interface ServerRequest<T extends ReqRef = ReqRef>
  extends Request<T & ServerExtendedAuthCredentials> {}

export interface JwtValidateReturn {
  isValid: boolean;
  credentials?: JwtAuthCredentials;
}
