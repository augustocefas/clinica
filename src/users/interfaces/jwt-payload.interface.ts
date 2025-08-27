export interface JwtPayload {
  sub: string; // user uuid
  email: string;
  name: string;
  tenancies?: string[]; // array de tenancy uuids
  iat?: number;
  exp?: number;
}
