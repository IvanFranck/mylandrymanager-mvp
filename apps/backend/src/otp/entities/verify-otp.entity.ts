import { VerificationCheckInstance } from 'twilio/lib/rest/verify/v2/service/verificationCheck';
import { User } from '@prisma/client';

export class VerifyOTPEntity {
  message: string;
  data: VerificationCheckInstance;
  user: Omit<User, 'password'>;
}
