import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// SETUP
let user: any;
let token0: string;
let token1: string;
let token2: string;
let invalidToken: string;
let uId0: number;
let uId1: number;
let uId2: number;
let invalidUserId: number;
let channel: any;
let channelId0: number;
let channelId1: number;
let channelId2: number;
let invalidChannelId: number;
beforeEach(() => {
  // Create 3 users
  user = h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });
  token0 = user.token;
  uId0 = parseInt(user.authUserId);
  user = h.postRequest(h.REGISTER_URL, {
    email: h.email1,
    password: h.password1,
    nameFirst: h.firstName1,
    nameLast: h.lastName1,
  });
  token1 = user.token;
  uId1 = parseInt(user.authUserId);
  user = h.postRequest(h.REGISTER_URL, {
    email: h.email2,
    password: h.password2,
    nameFirst: h.firstName2,
    nameLast: h.lastName2,
  });
  token2 = user.token;
  uId2 = parseInt(user.authUserId);
  token2 = user.token;
  uId2 = parseInt(user.authUserId);
  // Create channels 0, 1, 2
  channel = h.postRequest(h.CHAN_CREATE_URL, {
    token: token1,
    name: h.channelName0,
    isPublic: h.isPublic,
  });
  channelId0 = parseInt(channel.channelId);
  h.postRequest(h.CHAN_JOIN_URL, {
    token: token0,
    channelId: channelId0,
  });
  h.postRequest(h.CHAN_JOIN_URL, {
    token: token2,
    channelId: channelId0,
  });
  channel = h.postRequest(h.CHAN_CREATE_URL, {
    token: token1,
    name: h.channelName1,
    isPublic: h.isNotPublic,
  });
  channelId1 = parseInt(channel.channelId);
  channel = h.postRequest(h.CHAN_CREATE_URL, {
    token: token2,
    name: h.channelName2,
    isPublic: h.isPublic,
  });
  channelId2 = parseInt(channel.channelId);
  h.postRequest(h.CHAN_JOIN_URL, {
    token: token0,
    channelId: channelId2,
  });
  // Error cases
  invalidToken = h.invalidToken;
  invalidUserId = Math.abs(uId0) + Math.abs(uId1) + Math.abs(uId2) + 10;
  invalidChannelId = Math.abs(channelId0) + Math.abs(channelId1) + Math.abs(channelId2) + 10;
});

// TEARDOWN
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//
describe('Error Handling', () => {
  test('Invalid Token', () => {
    const data = h.postRequest(h.CHAN_ADD_OWNER_URL, {
      token: invalidToken,
      channelId: channelId0,
      uId: uId2,
    });
    expect(data).toStrictEqual({ error: 'Invalid Token' });
  });
  test('Invalid Channel ID', () => {
    const data = h.postRequest(h.CHAN_ADD_OWNER_URL, {
      token: token2,
      channelId: invalidChannelId,
      uId: uId2,
    });
    expect(data).toStrictEqual({ error: 'Invalid Channel Id' });
  });
  test('Invalid uId', () => {
    const data = h.postRequest(h.CHAN_ADD_OWNER_URL, {
      token: token0,
      channelId: channelId0,
      uId: invalidUserId,
    });
    expect(data).toStrictEqual({ error: 'Invalid User Id' });
  });
  test('Invalid uId: Not a member of channel', () => {
    const data = h.postRequest(h.CHAN_ADD_OWNER_URL, {
      token: token1,
      channelId: channelId1,
      uId: uId0,
    });
    expect(data).toStrictEqual({ error: 'User not a member of channel' });
  });
  test('Invalid uId: Already an owner', () => {
    const data = h.postRequest(h.CHAN_ADD_OWNER_URL, {
      token: token1,
      channelId: channelId0,
      uId: uId1,
    });
    expect(data).toStrictEqual({ error: 'User is already a channel owner' });
  });
  test('Invalid token: member but not owner or global', () => {
    const data = h.postRequest(h.CHAN_ADD_OWNER_URL, {
      token: token2,
      channelId: channelId0,
      uId: uId0,
    });
    expect(data).toStrictEqual({ error: 'Token does not have owner permissions' });
  });
  test('Invalid token: not member or global owner', () => {
    const data = h.postRequest(h.CHAN_ADD_OWNER_URL, {
      token: token1,
      channelId: channelId2,
      uId: uId0,
    });
    expect(data).toStrictEqual({ error: 'Token does not have owner permissions' });
  });
});

// ------------------Function Testing------------------//
describe('Function Testing', () => {
  test('Make a global member an owner', () => {
    let data: any = h.postRequest(h.CHAN_ADD_OWNER_URL, {
      token: token2,
      channelId: channelId2,
      uId: uId0,
    });
    expect(data).toStrictEqual({});
    data = h.getRequest(h.CHAN_DETAIL_URL, {
      token: token2,
      channelId: channelId2,
    });
    expect(data.ownerMembers.some((a: any) => <number>a.uId === <number>uId0)).toStrictEqual(true);
  });
  test('Global owner channel member make selves owner', () => {
    let data: any = h.postRequest(h.CHAN_ADD_OWNER_URL, {
      token: token0,
      channelId: channelId2,
      uId: uId0,
    });
    expect(data).toStrictEqual({});
    data = h.getRequest(h.CHAN_DETAIL_URL, {
      token: token0,
      channelId: channelId2,
    });
    expect(data.ownerMembers.some((a: any) => a.uId === uId0)).toStrictEqual(true);
  });
  test('Global owner channel member make member owner', () => {
    let data: any = h.postRequest(h.CHAN_ADD_OWNER_URL, {
      token: token0,
      channelId: channelId0,
      uId: uId2,
    });
    expect(data).toStrictEqual({});
    data = h.getRequest(h.CHAN_DETAIL_URL, {
      token: token0,
      channelId: channelId0,
    });
    expect(data.ownerMembers.some((a: any) => a.uId === uId2)).toStrictEqual(true);
  });
  test('Global owner channel owner make member owner', () => {
    const channel: any = h.postRequest(h.CHAN_CREATE_URL, {
      token: token0,
      name: h.channelName3,
      isPublic: h.isPublic,
    });
    h.postRequest(h.CHAN_JOIN_URL, {
      token: token1,
      channelId: channel.channelId,
    });

    let data: any = h.postRequest(h.CHAN_ADD_OWNER_URL, {
      token: token0,
      channelId: channel.channelId,
      uId: uId1,
    });
    expect(data).toStrictEqual({});
    data = h.getRequest(h.CHAN_DETAIL_URL, {
      token: token0,
      channelId: channel.channelId,
    });
    expect(data.ownerMembers.some((a: any) => a.uId === uId1)).toStrictEqual(true);
  });
});
