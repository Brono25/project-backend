
import {
  AuthUserId,
  Error,
} from '../data.types';

export type AuthRegisterArgs = [string, string, string, string];

export const firstName0 = 'First Name 0';
export const lastName0 = 'Last Name 0';
export const email0 = 'email_0_@gmail.com';
export const password0 = 'password_0';
export const email0AltCase = 'EMAIL_0_@GMAIL.COM';

export const firstName1 = 'First Name 1';
export const lastName1 = 'Last Name 1';
export const email1 = 'email_1_@gmail.com';
export const password1 = 'password_1';

export const firstName2 = 'First Name 2';
export const lastName2 = 'Last Name 2';
export const email2 = 'email_2_@gmail.com';
export const password2 = 'password_2';

export const wrongEmail = 'anything@gmail.com';
export const wrongPassword = 'wrongpassword';

export const invalidEmail = 'Not a valid email string';
export const invalidShortPassword = '12345';
export const invalidEmptyName = '';
export const invalidLongFirstName = 'FirstNameLongerThanFiftyCharactersIsAnInvalidFirstName';
export const invalidLongLastName = 'LastNameLongerThanFiftyCharactersIsAnInvalidLastName';

export function authUserIdReturnGaurd(authUserId: AuthUserId | Error) {
  if ('authUserId' in authUserId) {
    return authUserId.authUserId;
  }
  return null;
}

export * from './helper.test';
