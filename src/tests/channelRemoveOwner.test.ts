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
beforeEach(() => {

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
  tmp = h.postRequest(h.CHAN_ADD_OWNER_URL, {
    token: tokenGlobalOwner,
    channelId: channelId0,
    uId: uId1,
  });
  h.postRequest(h.CHAN_JOIN_URL, {
    token: tokenGlobalOwner,
    channelId: channelId1,
  });

  invalidChannelId = Math.abs(channelId0) + 10;
  invalidUid = Math.abs(uId1) + Math.abs(uId2) + Math.abs(uIdGlobalOwner) + 10;
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid Channel Id', () => {
    const data = h.postRequest(h.CHAN_ADD_OWNER_URL, {
      token: tokenGlobalOwner,
      channelId: invalidChannelId,
      uId: uId1,
    });
    expect(data).toStrictEqual({ error: 'Invalid channel Id' });
  });
  test('Invalid  uId', () => {
    const data = h.postRequest(h.CHAN_ADD_OWNER_URL, {
      token: tokenGlobalOwner,
      channelId: channelId0,
      uId: invalidUid,
    });
    expect(data).toStrictEqual({ error: 'Invalid uId' });
  });
  test('Uid is not an owner', () => {
    const data = h.postRequest(h.CHAN_ADD_OWNER_URL, {
      token: token1,
      channelId: channelId1,
      uId: uIdGlobalOwner,
    });
    expect(data).toStrictEqual({ error: 'User ID is not an owner' });
  });
  test('Only owner cant remove themselves', () => {
    const data = h.postRequest(h.CHAN_ADD_OWNER_URL, {
      token: token1,
      channelId: channelId1,
      uId: uId1,
    });
    expect(data).toStrictEqual({ error: 'There must be atleast one owner' });
  });
  test('Global owner who is a member cannot remove channel owner who is the only owner', () => {
    const data = h.postRequest(h.CHAN_ADD_OWNER_URL, {
      token: tokenGlobalOwner,
      channelId: channelId1,
      uId: uId1,
    });
    expect(data).toStrictEqual({ error: 'There must be atleast one owner' });
  });
}); 
