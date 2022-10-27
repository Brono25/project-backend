import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup
let token0: string;
let token1 : string;
let tmp: any;
let mId0: number;
let mId1: number;
let invalidMId: number;
let channelId0: number;
let uId0: number;
let uId1: number;
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
  uId0 = tmp.authUserId;

  tmp = h.postRequest(h.REGISTER_URL, {
    email: h.email1,
    password: h.password1,
    nameFirst: h.firstName1,
    nameLast: h.lastName1,
  });
  token1 = tmp.token;
  uId1 = tmp.authUserId;

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
      token: token0,
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
    expect(data).toStrictEqual({ error: 'Not a channel memeber' });
  });
  test('User is not a member of DM which has the message', () => {
    const data = h.putRequest(h.MSG_EDIT_URL, {
      token: token0,
      messageId: mId1,
      message: h.message0,
    });
    expect(data).toStrictEqual({ error: 'Not a dm memeber' });
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
    expect(data).toStrictEqual({ error: 'Dont have channel owner permissions' });
  });
  test('Is DM member but doesnt have owner permissions', () => {
    tmp = h.postRequest(h.DM_CREATE_URL, {
      token: token1,
      uIds: [uId0]
    });
    tmp = h.postRequest(h.MSG_SEND_DM_URL, {
      token: token1,
      dmId: tmp.dmId,
      message: 'Another DM'
    });
    const mId = tmp.messageId;
    const data = h.putRequest(h.MSG_EDIT_URL, {
      token: token0,
      messageId: mId,
      message: 'edit',
    });
    expect(data).toStrictEqual({ error: 'Dont have dm owner permissions' });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Edit own channel message', () => {
    const data = h.putRequest(h.MSG_EDIT_URL, {
      token: token0,
      messageId: mId0,
      message: 'Edited message Channel',
    });
    expect(data).toStrictEqual({});
  });
  test('Edit own DM message', () => {
    const data = h.putRequest(h.MSG_EDIT_URL, {
      token: token1,
      messageId: mId1,
      message: 'Edited message DM',
    });
    expect(data).toStrictEqual({});
  });
  test('Owner edits members DM message', () => {
    tmp = h.postRequest(h.DM_CREATE_URL, {
      token: token1,
      uIds: [uId0]
    });
    tmp = h.postRequest(h.MSG_SEND_DM_URL, {
      token: token0,
      dmId: tmp.dmId,
      message: 'Another DM'
    });
    const mId = tmp.messageId;
    const data = h.putRequest(h.MSG_EDIT_URL, {
      token: token1,
      messageId: mId,
      message: 'Edited by owner message DM',
    });
    expect(data).toStrictEqual({});
  });
  test('Owner edits members channel message', () => {
    tmp = h.postRequest(h.CHAN_JOIN_URL, {
      token: token1,
      channelId: channelId0,
    });

    tmp = h.postRequest(h.MSG_SEND_URL, {
      token: token1,
      channelId: channelId0,
      message: 'Member just joined'
    });
    const mId = tmp.messageId;
    const data = h.putRequest(h.MSG_EDIT_URL, {
      token: token0,
      messageId: mId,
      message: 'Edited by owner message channel',
    });
    expect(data).toStrictEqual({});
  });
  test('Gloabal Owner (not owner member) edits members channel message', () => {
    tmp = h.postRequest(h.CHAN_JOIN_URL, {
      token: token1,
      channelId: channelId0,
    });

    tmp = h.postRequest(h.MSG_SEND_URL, {
      token: token1,
      channelId: channelId0,
      message: 'Member just joined'
    });
    const mId = tmp.messageId;
    h.postRequest(h.CHAN_ADD_OWNER_URL, {
      token: token0,
      channelId: channelId0,
      uId: uId1,
    });
    h.postRequest(h.CHAN_RMV_OWNER_URL, {
      token: token0,
      channelId: channelId0,
      uId: uId0,
    });
    
    const data = h.putRequest(h.MSG_EDIT_URL, {
      token: token0,
      messageId: mId,
      message: 'Edited by global owner message channel',
    });
    expect(data).toStrictEqual({});
  });
});
