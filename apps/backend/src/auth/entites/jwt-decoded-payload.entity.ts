export class JWTDecodedEntity {
  sub: number;
  username: string;
  phone: number;
  signUpCompleted: boolean;
  iat: number;
  exp: number;
}
