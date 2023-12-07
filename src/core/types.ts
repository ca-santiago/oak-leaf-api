import { ReqRef, Request } from "@hapi/hapi";

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

export interface ServerRequest<T extends ReqRef>
  extends Request<T & ServerExtendedAuthCredentials> {}

export interface JwtValidateReturn {
  isValid: boolean;
  credentials?: JwtAuthCredentials;
}
