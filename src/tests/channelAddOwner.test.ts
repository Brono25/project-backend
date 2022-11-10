import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup
let token0: string;
let token1 : string;
let token2 : string;
let uId0: number;
let uId1: number;
let uId2: number;

let invalidUserId: number;

let channelId0: number;
let channelId1: number;
let channelId2: number;
let invalidChannelId: number;

let tmp: any;
beforeEach(() => {
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  uId0 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;
  uId1 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
  token2 = tmp.token;
  uId2 = parseInt(tmp.authUserId);

  // Create channels 0, 1, 2
  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(0, true), token1);
  channelId0 = parseInt(tmp.channelId);
  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(1, false), token1);
  channelId1 = parseInt(tmp.channelId);
  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(2, true), token2);
  channelId2 = parseInt(tmp.channelId);

  h.postRequest(h.CHAN_JOIN_URL, { channelId: channelId0 }, token0);
  h.postRequest(h.CHAN_JOIN_URL, { channelId: channelId0 }, token2);
  h.postRequest(h.CHAN_JOIN_URL, { channelId: channelId2 }, token0);

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
    const data = {
      channelId: channelId0,
      uId: uId2,
    };
    h.testErrorThrown(h.CHAN_ADD_OWNER_URL, 'POST', 403, data, h.invalidToken);
  });
  test('Invalid Channel ID', () => {
    const data = {
      channelId: invalidChannelId,
      uId: uId2,
    };
    h.testErrorThrown(h.CHAN_ADD_OWNER_URL, 'POST', 400, data, token2);
  });
  test('Invalid uId', () => {
    const data = {
      channelId: channelId0,
      uId: invalidUserId,
    };
    h.testErrorThrown(h.CHAN_ADD_OWNER_URL, 'POST', 400, data, token0);
  });
  test('Invalid uId: Not a member of channel', () => {
    const data = {
      channelId: channelId1,
      uId: uId0,
    };
    h.testErrorThrown(h.CHAN_ADD_OWNER_URL, 'POST', 400, data, token1);
  });
  test('Invalid uId: Already an owner', () => {
    const data = {
      channelId: channelId0,
      uId: uId1,
    };
    h.testErrorThrown(h.CHAN_ADD_OWNER_URL, 'POST', 400, data, token2);
  });
  test('member but not owner or global', () => {
    const data = {
      channelId: channelId0,
      uId: uId0,
    };
    h.testErrorThrown(h.CHAN_ADD_OWNER_URL, 'POST', 403, data, token2);
  });
  test('not member or global owner', () => {
    const data = {
      channelId: channelId2,
      uId: uId1,
    };
    h.testErrorThrown(h.CHAN_ADD_OWNER_URL, 'POST', 400, data, token1);
  });
});

// ------------------Function Testing------------------//
describe('Function Testing', () => {
  test('Make a global member an owner', () => {
    let data: any = h.postRequest(h.CHAN_ADD_OWNER_URL, {
      channelId: channelId2,
      uId: uId0,
    }, token2);
    expect(data).toStrictEqual({});
    data = h.getRequest(h.CHAN_DETAIL_URL, {
      channelId: channelId2,
    }, token2);
    expect(data.ownerMembers.some((a: any) => <number>a.uId === <number>uId0)).toStrictEqual(true);
  });
  test('Global owner channel member make selves owner', () => {
    let data: any = h.postRequest(h.CHAN_ADD_OWNER_URL, {
      channelId: channelId2,
      uId: uId0,
    }, token0);
    expect(data).toStrictEqual({});
    data = h.getRequest(h.CHAN_DETAIL_URL, {
      channelId: channelId2,
    }, token0);
    expect(data.ownerMembers.some((a: any) => a.uId === uId0)).toStrictEqual(true);
  });
  test('Global owner channel member make member owner', () => {
    let data: any = h.postRequest(h.CHAN_ADD_OWNER_URL, {
      channelId: channelId0,
      uId: uId2,
    }, token0);
    expect(data).toStrictEqual({});
    data = h.getRequest(h.CHAN_DETAIL_URL, {
      channelId: channelId0,
    }, token0);
    expect(data.ownerMembers.some((a: any) => a.uId === uId2)).toStrictEqual(true);
  });
  test('Global owner channel owner make member owner', () => {
    const channel: any = h.postRequest(h.CHAN_CREATE_URL, {
      name: h.channelName3,
      isPublic: h.isPublic,
    }, token0);
    h.postRequest(h.CHAN_JOIN_URL, {
      channelId: channel.channelId,
    }, token1);

    let data: any = h.postRequest(h.CHAN_ADD_OWNER_URL, {
      channelId: channel.channelId,
      uId: uId1,
    }, token0);
    expect(data).toStrictEqual({});
    data = h.getRequest(h.CHAN_DETAIL_URL, {
      channelId: channel.channelId,
    }, token0);
    expect(data.ownerMembers.some((a: any) => a.uId === uId1)).toStrictEqual(true);
  });
});
