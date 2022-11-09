import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

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
let invalidUserId: number;
let tmp: any;
beforeEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
  // tokens 0,1 and 2
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  tokenGlobalOwner = tmp.token;
  uIdGlobalOwner = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;
  uId1 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
  token2 = tmp.token;
  uId2 = parseInt(tmp.authUserId);

  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(0, true), tokenGlobalOwner);
  channelId0 = parseInt(tmp.channelId);
  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(1, true), token1);
  channelId1 = parseInt(tmp.channelId);

  h.postRequest(h.CHAN_JOIN_URL, { channelId: channelId0 }, token1);

  h.postRequest(h.CHAN_JOIN_URL, { channelId: channelId1 }, tokenGlobalOwner);
  h.postRequest(h.CHAN_JOIN_URL, { channelId: channelId0 }, token2);
  h.postRequest(h.CHAN_ADD_OWNER_URL, {
    channelId: channelId0,
    uId: uId1,
  }, tokenGlobalOwner);

  invalidChannelId = Math.abs(channelId0) + 10;
  invalidUserId = Math.abs(uId1) + Math.abs(uId2) + Math.abs(uIdGlobalOwner) + 10;
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid Token', () => {
    const data = {
      channelId: channelId0,
      uId: uIdGlobalOwner,
    };
    h.testErrorThrown(h.CHAN_RMV_OWNER_URL, 'POST', 403, data, h.invalidToken);
  });
  test('Invalid Channel Id', () => {
    const data = {
      channelId: invalidChannelId,
      uId: uId1,
    };
    h.testErrorThrown(h.CHAN_RMV_OWNER_URL, 'POST', 400, data, tokenGlobalOwner);
  });
  test('Invalid  uId', () => {
    const data = {
      channelId: channelId0,
      uId: invalidUserId,
    };
    h.testErrorThrown(h.CHAN_RMV_OWNER_URL, 'POST', 400, data, tokenGlobalOwner);
  });
  test('Uid is not an owner', () => {
    const data = {
      channelId: channelId0,
      uId: uId2,
    };
    h.testErrorThrown(h.CHAN_RMV_OWNER_URL, 'POST', 400, data, token1);
  });
  test('Only owner cant remove themselves', () => {
    const data = {
      channelId: channelId1,
      uId: uId1,
    };
    h.testErrorThrown(h.CHAN_RMV_OWNER_URL, 'POST', 400, data, token1);
  });
  test('Global owner who is a member cannot remove channel owner who is the only owner', () => {
    const data = {
      channelId: channelId1,
      uId: uId1,
    };
    h.testErrorThrown(h.CHAN_RMV_OWNER_URL, 'POST', 400, data, tokenGlobalOwner);
  });
  test('Token does not have permission', () => {
    const data = {
      channelId: channelId0,
      uId: uId1,
    };
    h.testErrorThrown(h.CHAN_RMV_OWNER_URL, 'POST', 403, data, token2);
  });
});

// ------------------Function Testing------------------//
describe('Function Testing', () => {
  test('Remove Channel Owner', () => {
    let data: any = h.postRequest(h.CHAN_RMV_OWNER_URL, {
      channelId: channelId0,
      uId: uId1,
    }, tokenGlobalOwner);
    expect(data).toStrictEqual({});
    data = h.getRequest(h.CHAN_DETAIL_URL, {
      channelId: channelId0,
    }, tokenGlobalOwner);
    expect(data.ownerMembers.some((a: any) => a.uId === uId1)).toStrictEqual(false);
  });
  test('Remove Channel Owner as global owner channel member', () => {
    h.postRequest(h.CHAN_RMV_OWNER_URL, {
      channelId: channelId0,
      uId: uIdGlobalOwner,
    }, tokenGlobalOwner);
    h.postRequest(h.CHAN_ADD_OWNER_URL, {
      channelId: channelId0,
      uId: uId2,
    }, tokenGlobalOwner);
    let data: any = h.postRequest(h.CHAN_RMV_OWNER_URL, {
      channelId: channelId0,
      uId: uId1,
    }, tokenGlobalOwner);
    expect(data).toStrictEqual({});
    data = h.getRequest(h.CHAN_DETAIL_URL, {
      channelId: channelId0,
    }, token1);
    expect(data.ownerMembers.some((a: any) => a.uId === uIdGlobalOwner)).toStrictEqual(false);
    expect(data.allMembers.some((a: any) => a.uId === uIdGlobalOwner)).toStrictEqual(true);
  });
});
