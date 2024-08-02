export class JWTDecodedEntity {
  sub: number;
  username: string;
  phone: string;
  signUpCompleted: boolean;
  iat: number;
  exp: number;
}
