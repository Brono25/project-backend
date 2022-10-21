import * as h from './test.helper';

import {
  dmCreateV1,
} from '../dm';
import {
  messageSendDmV1,
} from '../message'

// Setup: Create 3 users.
let uId0: number;
let uId1: number;
let uId2: number;
let invalidUid: number;
let token0: string;
let token1: string;
let token2: string;
let dmId: number;
let invalidDmId: number;
beforeEach(() => {
  let tmp: any = h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });
  token0 = tmp.token;
  uId0 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, {
    email: h.email1,
    password: h.password1,
    nameFirst: h.firstName1,
    nameLast: h.lastName1,
  });
  token1 = tmp.token;
  uId1 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, {
    email: h.email2,
    password: h.password2,
    nameFirst: h.firstName2,
    nameLast: h.lastName2,
  });
  token2 = tmp.token;
  uId2 = parseInt(tmp.authUserId);
  invalidUid = Math.abs(uId0) + Math.abs(uId1) + Math.abs(uId2) + 10;
  tmp = dmCreateV1(token0, [uId1]);
  dmId = tmp.dmId;
  invalidDmId = dmId + 10;
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Atleast one invalid Uid', () => {
    const data = h.postRequest(h.MSG_SEND_DM_URL, {
      token: token0,
      dmId: invalidDmId,
      message: h.message0,
    });
    expect(data).toStrictEqual({ error: 'Invalid DM ID' });
  });
  test('Message less than length 1', () => {
    const data = h.postRequest(h.MSG_SEND_DM_URL, {
      token: token0,
      dmId: dmId,
      message: h.invalidShortMessage,
    });
    expect(data).toStrictEqual({ error: 'Message must be atleast 1 character' });
  });
  test('Message more than length 1000', () => {
    const data = h.postRequest(h.MSG_SEND_DM_URL, {
      token: token0,
      dmId: dmId,
      message: h.invalidLongMessage,
    });
    expect(data).toStrictEqual({ error: 'Message must be less than 1000 characters' });
  });
  test('User is not a member', () => {
    const data = h.postRequest(h.MSG_SEND_DM_URL, {
      token: token2,
      dmId: dmId,
      message: h.message0,
    });
    expect(data).toStrictEqual({ error: 'Invalid Member' });
  });
  test('User is not a member', () => {
    const data = h.postRequest(h.MSG_SEND_DM_URL, {
      token: h.invalidToken,
      dmId: dmId,
      message: h.message0,
    });
    expect(data).toStrictEqual({ error: 'Invalid Token' });
  });
});
