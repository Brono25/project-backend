import { ok } from 'assert';
import request from 'sync-request';
import config from '../config.json';
import {
  AuthUserId,
  ChannelId,
  Error,
} from '../data.types';

export const OK = 200;
const port = config.port;
const url = config.url;
export const CLEAR_URL = `${url}:${port}/clear/v1`;
export const REGISTER_URL = `${url}:${port}/auth/register/v2`;
export const LOGIN_URL = `${url}:${port}/auth/login/v2`;
export const CHAN_CREATE_URL = `${url}:${port}/channels/create/v2`;
export const CHAN_LIST_URL = `${url}:${port}/channels/list/v2`;
export const CHAN_LIST_ALL_URL = `${url}:${port}/channels/listAll/v2`;

export const CHAN_DETAIL_URL = `${url}:${port}/channel/details/v2`;
export const CHAN_JOIN_URL = `${url}:${port}/channel/join/v2`;
export const CHAN_INV_URL = `${url}:${port}/channel/invite/v2`;
export const CHAN_MSG_URL = `${url}:${port}/channel/messages/v2`;
export const USER_PROF_URL = `${url}:${port}/user/profile/v2`;
export const LOGOUT_URL = `${url}:${port}/auth/logout/v1`;
export const CHAN_LEAVE_URL = `${url}:${port}/channel/leave/v1`;
export const CHAN_ADD_OWNER_URL = `${url}:${port}/channel/addowner/v1`;
export const CHAN_RMV_OWNER_URL = `${url}:${port}/channel/removeowner/v1`;
export const MSG_SEND_URL = `${url}:${port}/message/send/v1`;
export const MSG_EDIT_URL = `${url}:${port}/message/edit/v1`;
export const MSG_RMV_URL = `${url}:${port}/message/remove/v1`;
export const DM_CREATE_URL = `${url}:${port}/dm/create/v1`;
export const DM_LIST_URL = `${url}:${port}/dm/list/v1`;
export const DM_RMV_URL = `${url}:${port}/dm/remove/v1`;
export const DM_DETAILS__URL = `${url}:${port}/dm/details/v1`;
export const DM_LEAVE_URL = `${url}:${port}/dm/leave/v1`;
export const DM_MSG_URL = `${url}:${port}/dm/messages/v1`;
export const MSG_SEND_DM_URL = `${url}:${port}/message/senddm/v1`;
export const USER_ALL_URL = `${url}:${port}/users/all/v1`;
export const USER_PROF_SET_NAME_URL = `${url}:${port}/user/profile/setname/v1`;
export const USER_PROF_SET_EMAIL_URL = `${url}:${port}/user/profile/setemail/v1`;
export const USER_PROF_SET_HANDLE_URL = `${url}:${port}/user/profile/sethandle/v1`;

type AuthRegisterArgs = [string, string, string, string];
type ChannelsCreateArgs = [number, string, boolean];
export type Args = AuthRegisterArgs | ChannelsCreateArgs;

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
export const invalidEmptyChannelName = '';
export const invalidLongChannelName = 'ChannelsNamesMoreThanTwentyCharactersAreInvalid';

export const channelName0 = 'Channel 0';
export const channelName1 = 'Channel 1';
export const channelName2 = 'Channel 2';
export const channelName3 = 'Channel 3';
export const isPublic = true;
export const isNotPublic = false;

export function authRegisterReturnGaurd(authUserId: AuthUserId | Error): number {
  if ('authUserId' in authUserId) {
    return authUserId.authUserId;
  }
  return null;
}

export function channelsCreateReturnGaurd(channelId: ChannelId | Error): number {
  if ('channelId' in channelId) {
    return channelId.channelId;
  }
  return null;
}

export const postRequest = (url: string, data: any): object => {
  const res = request('POST', url, { json: data });
  expect(res.statusCode).toBe(OK);
  const bodyObj = JSON.parse(res.getBody() as string);
  return bodyObj;
};

export const getRequest = (url: string, data: any): object => {
  const res = request('GET', url, { qs: data });
  expect(res.statusCode).toBe(OK);
  const bodyObj = JSON.parse(res.getBody() as string);
  return bodyObj;
};

export const deleteRequest = (url: string, data: any): object => {
  const res = request('DELETE', url, {});
  expect(res.statusCode).toBe(OK);
  const bodyObj = JSON.parse(res.getBody() as string);
  return bodyObj;
};

export * from './test.helper';
