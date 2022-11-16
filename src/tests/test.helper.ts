
import request from 'sync-request';
import config from '../config.json';

const OK = 200;
const port = config.port;
const url = config.url;

export const LOGIN_URL = `${url}:${port}/auth/login/v3`;
export const REGISTER_URL = `${url}:${port}/auth/register/v3`;
export const LOGOUT_URL = `${url}:${port}/auth/logout/v2`;

export const CHAN_CREATE_URL = `${url}:${port}/channels/create/v3`;
export const CHAN_JOIN_URL = `${url}:${port}/channel/join/v3`;
export const CHAN_DETAIL_URL = `${url}:${port}/channel/details/v3`;
export const CHAN_INV_URL = `${url}:${port}/channel/invite/v3`;
export const CLEAR_URL = `${url}:${port}/clear/v1`;
export const CHAN_LIST_URL = `${url}:${port}/channels/list/v3`;
export const CHAN_LIST_ALL_URL = `${url}:${port}/channels/listAll/v3`;
export const CHAN_LEAVE_URL = `${url}:${port}/channel/leave/v2`;
export const CHAN_ADD_OWNER_URL = `${url}:${port}/channel/addowner/v2`;
export const CHAN_MSG_URL = `${url}:${port}/channel/messages/v3`;
export const CHAN_RMV_OWNER_URL = `${url}:${port}/channel/removeowner/v2`;

export const DM_MSG_URL = `${url}:${port}/dm/messages/v2`;
export const DM_CREATE_URL = `${url}:${port}/dm/create/v2`;
export const DM_DETAILS_URL = `${url}:${port}/dm/details/v2`;
export const DM_LEAVE_URL = `${url}:${port}/dm/leave/v2`;
export const DM_LIST_URL = `${url}:${port}/dm/list/v2`;
export const DM_RMV_URL = `${url}:${port}/dm/remove/v2`;

export const MSG_SEND_URL = `${url}:${port}/message/send/v2`;
export const MSG_EDIT_URL = `${url}:${port}/message/edit/v2`;
export const MSG_RMV_URL = `${url}:${port}/message/remove/v2`;
export const MSG_SEND_DM_URL = `${url}:${port}/message/senddm/v2`;

export const USER_PROF_URL = `${url}:${port}/user/profile/v3`;
export const USER_ALL_URL = `${url}:${port}/users/all/v2`;
export const USER_PROF_SET_NAME_URL = `${url}:${port}/user/profile/setname/v2`;
export const USER_PROF_SET_EMAIL_URL = `${url}:${port}/user/profile/setemail/v2`;
export const USER_PROF_SET_HANDLE_URL = `${url}:${port}/user/profile/sethandle/v2`;
export const USER_STATS = `${url}:${port}/user/stats/v1`;

type AuthRegisterArgs = [string, string, string, string];
type ChannelsCreateArgs = [number, string, boolean];
export type Args = AuthRegisterArgs | ChannelsCreateArgs;

export const firstName0 = 'My First Name 0';
export const lastName0 = 'My Last Name 0';
export const email0 = 'email_0_@gmail.com';
export const password0 = 'password_0';

export const email0AltCase = 'EMAIL_0_@GMAIL.COM';
export const firstName1 = 'My First Name 1';
export const lastName1 = 'My Last Name 1';
export const email1 = 'email_1_@gmail.com';
export const password1 = 'password_1';

export const firstName2 = 'My First Name 2';
export const lastName2 = 'My Last Name 2';
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

export const message0 = 'This is the 0th message';
export const message1 = 'This is the 1st message';
export const message2 = 'This is the 2nd message';
export const message3 = 'This is the 3rd message';
export const message4 = 'This is the 4th message';

export const invalidShortMessage = '';
export const invalidLongMessage = 'x'.repeat(1001);

export const invalidToken = 'not a valid token (probably)';

type ReqType = 'PUT'| 'POST' | 'GET' | 'DELETE';
type ErrorList = 400 | 403;
export const testErrorThrown = (url: string, reqType: ReqType, error: ErrorList, data: any, token?: string) => {
  if (reqType === 'PUT' || reqType === 'POST') {
    const res = request(reqType, url, { json: data, headers: { token: token } });
    expect(res.statusCode).toBe(error);
  } else if (reqType === 'GET' || reqType === 'DELETE') {
    const res = request(reqType, url, { qs: data, headers: { token: token } });
    expect(res.statusCode).toBe(error);
  }
};

export const postRequest = (url: string, data: any, token?: string): object => {
  const res = request('POST', url, { json: data, headers: { token: token } });
  expect(res.statusCode).toBe(OK);
  const bodyObj = JSON.parse(res.getBody() as string);
  return bodyObj;
};

export const putRequest = (url: string, data: any, token?: string): object => {
  const res = request('PUT', url, { json: data, headers: { token: token } });
  expect(res.statusCode).toBe(OK);
  const bodyObj = JSON.parse(res.getBody() as string);
  return bodyObj;
};

export const getRequest = (url: string, data: any, token?: string): object => {
  const res = request('GET', url, { qs: data, headers: { token: token } });
  expect(res.statusCode).toBe(OK);
  const bodyObj = JSON.parse(res.getBody() as string);
  return bodyObj;
};

export const deleteRequest = (url: string, data: any, token?: string): object => {
  const res = request('DELETE', url, { qs: data, headers: { token: token } });
  expect(res.statusCode).toBe(OK);
  const bodyObj = JSON.parse(res.getBody() as string);
  return bodyObj;
};

export * from './test.helper';
export const password = 'password123456';

export function generateUserLoginArgs(n: number) {
  return {
    email: 'email_' + n.toString() + '_@gmail.com',
    password: password
  };
}
export function generateUserRegisterArgs(n: number) {
  return {
    email: 'email_' + n.toString() + '_@gmail.com',
    password: password,
    nameFirst: 'My First Name '.concat(n.toString()),
    nameLast: 'My Last Name '.concat(n.toString()),
  };
}
export function generateChannelsCreateArgs(n: number, isPublic: boolean) {
  return {
    name: 'Channel '.concat(n.toString()),
    isPublic: isPublic,
  };
}
