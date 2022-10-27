import * as h from './test.helper';

// Setup
let tokenGlobalOwner: string;
let token1 : string;
let token2: string;
let uIdGlobalOwner: number;
let uId1: number;
let uId2: number;
let channelId0: number;
let channelId1: number;
let invalidChannelId: number;
let invalidUid: number;
let tmp: any;
let mId0: number;
let mId1: number;
let mId2: number;
let mId3: number;
let mId4: number;
let invalidMId: number;
beforeEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
  // tokens 0,1 and 2
  tmp = h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });
  uIdGlobalOwner = tmp.authUserId;
  tokenGlobalOwner = tmp.token;

  tmp = h.postRequest(h.REGISTER_URL, {
    email: h.email1,
    password: h.password1,
    nameFirst: h.firstName1,
    nameLast: h.lastName1,
  });
  uId1 = tmp.authUserId;
  token1 = tmp.token;

  tmp = h.postRequest(h.REGISTER_URL, {
    email: h.email2,
    password: h.password2,
    nameFirst: h.firstName2,
    nameLast: h.lastName2,
  });
  uId2 = tmp.authUserId;
  token2 = tmp.token;

  // Channels 0 and private
  tmp = h.postRequest(h.CHAN_CREATE_URL, {
    token: tokenGlobalOwner,
    name: h.channelName0,
    isPublic: h.isPublic,
  });
  channelId0 = parseInt(tmp.channelId);

  tmp = h.postRequest(h.CHAN_CREATE_URL, {
    token: token1,
    name: h.channelName1,
    isPublic: h.isPublic,
  });
  channelId1 = parseInt(tmp.channelId);

  h.postRequest(h.CHAN_JOIN_URL, {
    token: token1,
    channelId: channelId0,
  });
  tmp = h.postRequest(h.CHAN_RMV_OWNER_URL, {
    token: tokenGlobalOwner,
    channelId: channelId0,
    uId: uId1,
  });
  h.postRequest(h.CHAN_JOIN_URL, {
    token: tokenGlobalOwner,
    channelId: channelId1,
  });
  h.postRequest(h.CHAN_JOIN_URL, {
    token: token2,
    channelId: channelId0,
  });
  h.postRequest(h.CHAN_ADD_OWNER_URL, {
    token: tokenGlobalOwner,
    channelId: channelId0,
    uId: uId1,
  });

  invalidChannelId = Math.abs(channelId0) + 10;
  invalidUid = Math.abs(uId1) + Math.abs(uId2) + Math.abs(uIdGlobalOwner) + 10;
  tmp = h.postRequest(h.MSG_SEND_URL, {
    token: tokenGlobalOwner,
    channelId: channelId0,
    message: 'First message channel 0 by global owner'
  });
  mId0 = parseInt(tmp.messageId);
  tmp = h.postRequest(h.MSG_SEND_URL, {
    token: token1,
    channelId: channelId0,
    message: 'Second message channel 0 by user 1'
  });
  mId1 = parseInt(tmp.messageId);
  tmp = h.postRequest(h.MSG_SEND_URL, {
    token: token2,
    channelId: channelId0,
    message: 'Third message channel 0 by user 2'
  });
  mId2 = parseInt(tmp.messageId);
  tmp = h.postRequest(h.MSG_SEND_URL, {
    token: token1,
    channelId: channelId1,
    message: 'First message channel 1 by owner user 1'
  });
  mId3 = parseInt(tmp.messageId);
  tmp = h.postRequest(h.MSG_SEND_URL, {
    token: tokenGlobalOwner,
    channelId: channelId1,
    message: 'Second message channel 1 by global owner who is a channel member only'
  });
  mId4 = parseInt(tmp.messageId);
  invalidMId = Math.abs(mId0 + mId1 + mId2 + mId3 + mId4)
});
// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//
describe('Error Handling', () => {
  test('invalid token', () => {
    const data = h.deleteRequest(h.MSG_RMV_URL, {
      token: h.invalidToken,
      messageId: mId0,
    });
    expect(data).toStrictEqual({ error: 'Invalid token' });
  });
  test('User is not part of the channel that the message was posted in', () => {
    const data = h.deleteRequest(h.MSG_RMV_URL, {
      token: token2,
      channelId: mId4,
    });
    expect(data).toStrictEqual({ error: 'Invalid message Id' });
  });
  test('Member try to delete message they didnt post', () => {
    const data = h.deleteRequest(h.MSG_RMV_URL, {
      token: token2,
      channelId: mId1,
    });
    expect(data).toStrictEqual({ error: 'Token doesnt have permission' });
  });
});
