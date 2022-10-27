import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup
let token0: string;
let token1 : string;
let tmp: any;
let mId0: number;
let mId1: number;
let mId2: number;
let invalidMId: number;
let channelId0: number;
beforeEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
  // tokens 0,1 and 2
  tmp = h.postRequest(h.REGISTER_URL, {
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
  const uId1 = tmp.authUserId;
  token1 = tmp.token;

  // Channels
  tmp = h.postRequest(h.CHAN_CREATE_URL, {
    token: token0,
    name: h.channelName0,
    isPublic: h.isPublic,
  });
  channelId0 = parseInt(tmp.channelId);

  tmp = h.postRequest(h.MSG_SEND_URL, {
    token: token0,
    channelId: channelId0,
    message: 'First message channel'
  });
  mId0 = parseInt(tmp.messageId);
  invalidMId = Math.abs(mId0 + 10);

  // Create DM
  tmp = h.postRequest(h.DM_CREATE_URL, {
    token: token1,
    uIds: []
  });
  const dmId0 = parseInt(tmp.dmId);
  tmp = h.postRequest(h.MSG_SEND_DM_URL, {
    token: token1,
    dmId: dmId0,
    message: 'First message DM'
  });
  mId1 = parseInt(tmp.messageId);
});
// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------///
describe('Error Handling', () => {
  test('Invalid token', () => {
    const data = h.putRequest(h.MSG_EDIT_URL, {
      token: h.invalidToken,
      messageId: mId0,
      message: 'Edited message',
    });
    expect(data).toStrictEqual({ error: 'Invalid token' });
  });
  test('Message too long', () => {
    const data = h.putRequest(h.MSG_EDIT_URL, {
      token: h.invalidToken,
      messageId: mId0,
      message: h.invalidLongMessage,
    });
    expect(data).toStrictEqual({ error: 'Invalid message' });
  });
  test('Invalid message ID', () => {
    const data = h.putRequest(h.MSG_EDIT_URL, {
      token: token1,
      messageId: invalidMId,
      message: h.message0,
    });
    expect(data).toStrictEqual({ error: 'Invalid message ID' });
  });
  test('User is not a member of channel which has the message', () => {
    const data = h.putRequest(h.MSG_EDIT_URL, {
      token: token1,
      messageId: mId0,
      message: h.message0,
    });
    expect(data).toStrictEqual({ error: 'Invalid message ID' });
  });
  test('User is not a member of DM which has the message', () => {
    const data = h.putRequest(h.MSG_EDIT_URL, {
      token: token0,
      messageId: mId0,
      message: h.message0,
    });
    expect(data).toStrictEqual({ error: 'Invalid message ID' });
  });
  test('Is channel member but doesnt have owner permissions', () => {
    h.postRequest(h.CHAN_JOIN_URL, {
      token: token1,
      channelId: channelId0,
    });
    const data = h.putRequest(h.MSG_EDIT_URL, {
      token: token1,
      messageId: mId0,
      message: 'edit',
    });
    expect(data).toStrictEqual({ error: 'Invalid Permissions' });
  });
});
