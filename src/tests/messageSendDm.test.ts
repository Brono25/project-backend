import * as h from './test.helper';
h.deleteRequest(h.CLEAR_URL, {});

// Setup: Create 3 users.
let uId1: number;
let token0: string;
let token1: string;
let token2: string;
let dmId0: number;
let invalidDmId: number;
let tmp: any;
beforeEach(() => {
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;
  uId1 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
  token2 = tmp.token;

  tmp = h.postRequest(h.DM_CREATE_URL, { uIds: [uId1] }, token0);
  dmId0 = parseInt(tmp.dmId);
  invalidDmId = dmId0 + 10;
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid DmId', () => {
    const data = {
      dmId: invalidDmId,
      message: h.message0,
    };
    h.testErrorThrown(h.MSG_SEND_DM_URL, 'POST', 400, data, token0);
  });
  test('Message less than length 1', () => {
    const data = {
      dmId: dmId0,
      message: h.invalidShortMessage,
    };
    h.testErrorThrown(h.MSG_SEND_DM_URL, 'POST', 400, data, token0);
  });
  test('Message more than length 1000', () => {
    const data = {
      dmId: dmId0,
      message: h.invalidLongMessage,
    };
    h.testErrorThrown(h.MSG_SEND_DM_URL, 'POST', 400, data, token0);
  });
  test('User is not a member', () => {
    const data = {
      dmId: dmId0,
      message: h.message0,
    };
    h.testErrorThrown(h.MSG_SEND_DM_URL, 'POST', 403, data, token2);
  });
  test('Invalid token', () => {
    const data = {
      dmId: dmId0,
      message: h.message0,
    };
    h.testErrorThrown(h.MSG_SEND_DM_URL, 'POST', 403, data, h.invalidToken);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Owner Send  DM message', () => {
    const data = h.postRequest(h.MSG_SEND_DM_URL, {
      dmId: dmId0,
      message: h.message0,
    }, token0);
    expect(data).toStrictEqual({ messageId: expect.any(Number) });
  });
  test('Member Send DM message', () => {
    const data = h.postRequest(h.MSG_SEND_DM_URL, {
      dmId: dmId0,
      message: h.message0,
    }, token1);
    expect(data).toStrictEqual({ messageId: expect.any(Number) });
  });
});
