import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup
let token0: string;
let token1 : string;
let token2: string;

let uId2 : number;

let mId0: number;
let mId1: number;
let invalidMId: number;
let channelId0: number;
let tmp: any;

beforeEach(() => {
  // tokens 0,1,2 and uId 2
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;

  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;

  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
  token2 = tmp.token;
  uId2 = parseInt(tmp.authUserId);

  // channel 0
  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(0, true), token0);
  channelId0 = parseInt(tmp.channelId);

  // adding member to channel
  h.postRequest(h.CHAN_JOIN_URL, {
    channelId: channelId0,
  }, token2);

  // messages 0 (to channel) and invalid
  tmp = h.postRequest(h.MSG_SEND_URL, { channelId: channelId0, message: h.message0 }, token0);
  mId0 = parseInt(tmp.messageId);

  invalidMId = Math.abs(mId0 + 10);

  // dm 0
  tmp = h.postRequest(h.DM_CREATE_URL, { uIds: [uId2] }, token1);
  const dmId0 = parseInt(tmp.dmId);

  // message 1 (to dm)
  tmp = h.postRequest(h.MSG_SEND_DM_URL, { dmId: dmId0, message: h.message1 }, token1);
  mId1 = parseInt(tmp.messageId);
});
// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------///
describe('Error Handling', () => {
  test('Invalid token', () => {
    const data = {
      messageId: mId0,
      reactId: 1,
    };
    h.testErrorThrown(h.MSG_PIN_URL, 'POST', 403, data, h.invalidToken);
  });

  test('Invalid message ID', () => {
    const data = {
      messageId: invalidMId,
    };
    h.testErrorThrown(h.MSG_PIN_URL, 'POST', 400, data, token1);
  });

  test('User is not a member of channel which has the message', () => {
    const data = {
      messageId: mId0,
    };
    h.testErrorThrown(h.MSG_PIN_URL, 'POST', 400, data, token1);
  });

  test('User is not a member of DM which has the message', () => {
    const data = {
      messageId: mId1,
    };
    h.testErrorThrown(h.MSG_PIN_URL, 'POST', 400, data, token0);
  });

  test('the message is already pinned (in channel)', () => {
    const a = h.postRequest(h.MSG_PIN_URL, {
      messageId: mId0,
    }, token0);
    expect(a).toStrictEqual({});
    const b = {
      messageId: mId0,
    };
    h.testErrorThrown(h.MSG_PIN_URL, 'POST', 400, b, token0);
  });

  test('the message is already pinned (in dm)', () => {
    const a = h.postRequest(h.MSG_PIN_URL, {
      messageId: mId1,
    }, token1);
    expect(a).toStrictEqual({});
    const b = {
      messageId: mId1,
    };
    h.testErrorThrown(h.MSG_PIN_URL, 'POST', 400, b, token1);
  });

  test('User is a member of channel which has the message but does not have owner permissions', () => {
    const data = {
      messageId: mId0,
    };
    h.testErrorThrown(h.MSG_PIN_URL, 'POST', 403, data, token2);
  });

  test('User is a member of DM which has the message but does not have owner permissions', () => {
    const data = {
      messageId: mId1,
    };
    h.testErrorThrown(h.MSG_PIN_URL, 'POST', 403, data, token2);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('pin a channel message', () => {
    const a: any = h.postRequest(h.MSG_PIN_URL, {
      messageId: mId0,
    }, token0);
    expect(a).toStrictEqual({});
  });
  test('pin a dm message', () => {
    const a: any = h.postRequest(h.MSG_PIN_URL, {
      messageId: mId1,
    }, token1);
    expect(a).toStrictEqual({});
  });
});
