import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup
let token0: string;
let token1 : string;

let mId0: number;
let mId1: number;
let invalidMId: number;
let channelId0: number;
let tmp: any;
beforeEach(() => {
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token; tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;
  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(0, true), token0);
  channelId0 = parseInt(tmp.channelId);
  tmp = h.postRequest(h.MSG_SEND_URL, { channelId: channelId0, message: h.message0 }, token0);
  mId0 = parseInt(tmp.messageId);
  invalidMId = Math.abs(mId0 + 10);
  tmp = h.postRequest(h.DM_CREATE_URL, { uIds: [] }, token1);
  const dmId0 = parseInt(tmp.dmId);
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
    h.testErrorThrown(h.MSG_REACT_URL, 'POST', 403, data, h.invalidToken);
  });
  test('Invalid message ID', () => {
    const data = {
      messageId: invalidMId,
      reactId: 1,
    };
    h.testErrorThrown(h.MSG_REACT_URL, 'POST', 400, data, token1);
  });
  test('Invalid react ID', () => {
    const data = {
      messageId: mId0,
      reactId: 2,
    };
    h.testErrorThrown(h.MSG_REACT_URL, 'POST', 400, data, token1);
  });
  test('User is not a member of channel which has the message', () => {
    const data = {
      messageId: mId0,
      reactId: 1,
    };
    h.testErrorThrown(h.MSG_REACT_URL, 'POST', 400, data, token1);
  });
  test('User is not a member of DM which has the message', () => {
    const data = {
      messageId: mId1,
      reactId: 1,
    };
    h.testErrorThrown(h.MSG_REACT_URL, 'POST', 400, data, token0);
  });
  test('User has already reacted to this message reacted with the same react (in channel)', () => {
    const a = h.postRequest(h.MSG_REACT_URL, {
      messageId: mId0,
      reactId: 1,
    }, token0);
    expect(a).toStrictEqual({});
    const b = {
      messageId: mId0,
      reactId: 1,
    };
    h.testErrorThrown(h.MSG_REACT_URL, 'POST', 400, b, token0);
  });
  test('User has already reacted to this message reacted with the same react (in dm)', () => {
    const a = h.postRequest(h.MSG_REACT_URL, {
      messageId: mId1,
      reactId: 1,
    }, token1);
    expect(a).toStrictEqual({});
    const b = {
      messageId: mId1,
      reactId: 1,
    };
    h.testErrorThrown(h.MSG_REACT_URL, 'POST', 400, b, token1);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('add a new react to a channel message', () => {
    const a: any = h.postRequest(h.MSG_REACT_URL, {
      messageId: mId0,
      reactId: 1,
    }, token0);
    expect(a).toStrictEqual({});
  });
  test('add a new react to a dm message', () => {
    const a: any = h.postRequest(h.MSG_REACT_URL, {
      messageId: mId1,
      reactId: 1,
    }, token1);
    expect(a).toStrictEqual({});
  });
});
