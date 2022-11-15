
import * as h from './test.helper';

// Setup
let token0: string;
let token1 : string;
let token2 : string;
let uId0: number;
let uId1: number;
let uId2: number;

let channelId0: number;
let channelId1: number;
let channelId2: number;

let dmId0: number;
let tmp: any;

beforeEach(() => {
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  uId0 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;
  uId1 = parseInt(tmp.authUserId);
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid token', () => {
    h.testErrorThrown(h.USER_STATS, 'GET', 403, undefined, h.invalidToken);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('User just registered, initial stats', () => {
    const tmp: any = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
    token2 = tmp.token;
    const data: any = h.getRequest(h.USER_STATS, undefined, token2);

    expect(data).toStrictEqual({
      channelsJoined: [{ numChannelsJoined: 0, timeStamp: expect.any(Number) }],
      dmsJoined: [{ numDmsJoined: 0, timeStamp: expect.any(Number) }],
      messagesSent: [{ numMessagesSent: 0, timeStamp: expect.any(Number) }],
      involvementRate: 0
    });
  });
  test('Create 2 channels join 1 channel leave 1 channel join 1 channel', () => {
    let tmp: any;
    tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(0, true), token1);
    tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(1, true), token1);
    tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(0, true), token0);
    const channelId2 = parseInt(tmp.channelId);
    tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(1, true), token0);
    const channelId3 = parseInt(tmp.channelId);

    h.postRequest(h.CHAN_JOIN_URL, { channelId: channelId2 }, token1);
    h.postRequest(h.CHAN_LEAVE_URL, { channelId: channelId2 }, token1);
    h.postRequest(h.CHAN_JOIN_URL, { channelId: channelId3 }, token1);

    const data: any = h.getRequest(h.USER_STATS, undefined, token1);
    expect(data).toStrictEqual({
      channelsJoined: [
        { numChannelsJoined: 0, timeStamp: expect.any(Number) },
        { numChannelsJoined: 1, timeStamp: expect.any(Number) },
        { numChannelsJoined: 2, timeStamp: expect.any(Number) },
        { numChannelsJoined: 3, timeStamp: expect.any(Number) },
        { numChannelsJoined: 2, timeStamp: expect.any(Number) },
        { numChannelsJoined: 3, timeStamp: expect.any(Number) },
      ],
      dmsJoined: [{ numDmsJoined: 0, timeStamp: expect.any(Number) }],
      messagesSent: [{ numMessagesSent: 0, timeStamp: expect.any(Number) }],
      involvementRate: 0
    });
  });
});
