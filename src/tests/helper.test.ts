
import {
  AuthUserId,
  ChannelId,
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

export const channelName0 = 'Channel 0';
export const channelName1 = 'Channel 1';
export const channelName2 = 'Channel 2';
export const isPublic = true;
export const isNotPublic = false;

export function authRegisterReturnGaurd(authUserId: AuthUserId | Error) {
  if ('authUserId' in authUserId) {
    return authUserId.authUserId;
  }
  return null;
}

export function channelsCreateReturnGaurd(channelId: ChannelId | Error) {
  if ('channelId' in channelId) {
    return channelId.channelId;
  }
  return null;
}

export * from './helper.test';
