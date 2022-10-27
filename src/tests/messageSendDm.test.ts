import * as h from './test.helper';

import {
  dmCreateV1,
} from '../dm';
h.deleteRequest(h.CLEAR_URL, {});

// Setup: Create 3 users.
let uId1: number;
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
  test('Invalid DmId', () => {
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
    expect(data).toStrictEqual({ error: 'Invalid message length' });
  });
  test('Message more than length 1000', () => {
    const data = h.postRequest(h.MSG_SEND_DM_URL, {
      token: token0,
      dmId: dmId,
      message: h.invalidLongMessage,
    });
    expect(data).toStrictEqual({ error: 'Invalid message length' });
  });
  test('User is not a member', () => {
    const data = h.postRequest(h.MSG_SEND_DM_URL, {
      token: token2,
      dmId: dmId,
      message: h.message0,
    });
    expect(data).toStrictEqual({ error: 'Invalid Member' });
  });
  test('Invalid token', () => {
    const data = h.postRequest(h.MSG_SEND_DM_URL, {
      token: h.invalidToken,
      dmId: dmId,
      message: h.message0,
    });
    expect(data).toStrictEqual({ error: 'Invalid token' });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Owner Send  DM message', () => {
    const data = h.postRequest(h.MSG_SEND_DM_URL, {
      token: token0,
      dmId: dmId,
      message: h.message0,
    });
    expect(data).toStrictEqual({ messageId: expect.any(Number) });
  });
  test('Member Send DM message', () => {
    const data = h.postRequest(h.MSG_SEND_DM_URL, {
      token: token1,
      dmId: dmId,
      message: h.message0,
    });
    expect(data).toStrictEqual({ messageId: expect.any(Number) });
  });
});
