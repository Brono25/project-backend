import * as h from './test.helper';
h.deleteRequest(h.CLEAR_URL, {});

// Setup: Create 3 users.
let uId1: number;
let token0: string;
let token1: string;
let token2: string;
let dmId0: number;
let invalidDmId: number;
let pastTime: number;
let time: number;
let tmp: any;
beforeEach(() => {
  // tokens and uids
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;
  uId1 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
  token2 = tmp.token;

  // dms
  tmp = h.postRequest(h.DM_CREATE_URL, { uIds: [uId1] }, token0);
  dmId0 = parseInt(tmp.dmId);
  invalidDmId = dmId0 + 10;

  // send dm
  tmp = h.postRequest(h.MSG_SEND_DM_URL, {
    dmId: dmId0,
    message: h.message0,
  }, token0);

  // get time
  tmp = h.getRequest(h.USER_STATS_URL, undefined, token0);
  pastTime = tmp.userStats.messagesSent[0].timeStamp;

  time = pastTime + 10;
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
      timeSent: time,
    };
    h.testErrorThrown(h.MSG_SEND_LATER_DM_URL, 'POST', 400, data, token0);
  });

  test('Message less than length 1', () => {
    const data = {
      dmId: dmId0,
      message: h.invalidShortMessage,
      timeSent: time,
    };
    h.testErrorThrown(h.MSG_SEND_LATER_DM_URL, 'POST', 400, data, token0);
  });

  test('Message more than length 1000', () => {
    const data = {
      dmId: dmId0,
      message: h.invalidLongMessage,
      timeSent: time,
    };
    h.testErrorThrown(h.MSG_SEND_LATER_DM_URL, 'POST', 400, data, token0);
  });

  test('timeSent is a time in the past', () => {
    const data = {
      dmId: dmId0,
      message: h.invalidLongMessage,
      timeSent: pastTime,
    };
    h.testErrorThrown(h.MSG_SEND_LATER_DM_URL, 'POST', 400, data, token0);
  });

  test('User is not a member', () => {
    const data = {
      dmId: dmId0,
      message: h.message0,
      timeSent: time,
    };
    h.testErrorThrown(h.MSG_SEND_LATER_DM_URL, 'POST', 403, data, token2);
  });

  test('Invalid token', () => {
    const data = {
      dmId: dmId0,
      message: h.message0,
      timeSent: time,
    };
    h.testErrorThrown(h.MSG_SEND_LATER_DM_URL, 'POST', 403, data, h.invalidToken);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Owner Send  DM message', () => {
    const data = h.postRequest(h.MSG_SEND_LATER_DM_URL, {
      dmId: dmId0,
      message: h.message0,
      timeSent: time,
    }, token0);
    expect(data).toStrictEqual({ messageId: expect.any(Number) });
  });

  test('Member Send DM message', () => {
    const data = h.postRequest(h.MSG_SEND_LATER_DM_URL, {
      dmId: dmId0,
      message: h.message0,
      timeSent: time,
    }, token1);
    expect(data).toStrictEqual({ messageId: expect.any(Number) });
  });
});
