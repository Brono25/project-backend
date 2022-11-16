import HTTPError from 'http-errors';
import { UserStats } from '../data.types';
import * as h from './test.helper';

// Setup
let token0: string;
let token1 : string;
let token2 : string;
let uId0: number;
let uId1: number;
let uId2: number;

let tmp: any;

beforeEach(() => {
  // tokens 0,1 and 2
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  uId0 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;
  uId1 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
  token2 = tmp.token;
  uId2 = parseInt(tmp.authUserId);
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid token', () => {
    h.testErrorThrown(h.USERS_STATS_URL, 'GET', 403, undefined, h.invalidToken);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('add 1 channel, 1 dm and 4 messages', () => {
    tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(0, true), token0);
    h.postRequest(h.MSG_SEND_URL, { channelId: tmp.channelId, message: h.message0 }, token0);
    tmp = h.postRequest(h.DM_CREATE_URL, { uIds: [uId1, uId2] }, token0);
    h.postRequest(h.MSG_SEND_DM_URL, { dmId: tmp.dmId, message: h.message1 }, token1);
    h.postRequest(h.MSG_SEND_DM_URL, { dmId: tmp.dmId, message: h.message2 }, token0);
    h.postRequest(h.MSG_SEND_DM_URL, { dmId: tmp.dmId, message: h.message3 }, token2);
    const data: any = h.postRequest(h.USERS_STATS_URL, undefined, token0);
    expect(data).toStrictEqual({
      workspaceStats: {
        channelsExist: [
          { numChannelsJoined: 0, timeStamp: expect.any(Number) },
          { numChannelsJoined: 1, timeStamp: expect.any(Number) }
        ],
        dmsExist: [
          { numDmsJoined: 0, timeStamp: expect.any(Number) },
          { numDmsJoined: 1, timeStamp: expect.any(Number) }
        ],
        messagesExist: [
          { numMessagesSent: 0, timeStamp: expect.any(Number) },
          { numMessagesSent: 1, timeStamp: expect.any(Number) },
          { numMessagesSent: 2, timeStamp: expect.any(Number) },
          { numMessagesSent: 3, timeStamp: expect.any(Number) },
          { numMessagesSent: 4, timeStamp: expect.any(Number) },
        ],
        involvementRate: expect.any(Number)
      }
    });
  });
  test('add 1 channel with 1 message, remove message', () => {
    tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(0, true), token0);
    tmp = h.postRequest(h.MSG_SEND_URL, { channelId: tmp.channelId, message: h.message0 }, token0);
    h.deleteRequest(h.MSG_RMV_URL, { messageId: tmp.messageId }, token0);

    const data: any = h.postRequest(h.USERS_STATS_URL, undefined, token0);
    expect(data).toStrictEqual({
      workspaceStats: {
        channelsExist: [
          { numChannelsJoined: 0, timeStamp: expect.any(Number) },
          { numChannelsJoined: 1, timeStamp: expect.any(Number) }
        ],
        dmsExist: [
          { numDmsJoined: 0, timeStamp: expect.any(Number) },
        ],
        messagesExist: [
          { numMessagesSent: 0, timeStamp: expect.any(Number) },
          { numMessagesSent: 1, timeStamp: expect.any(Number) },
          { numMessagesSent: 0, timeStamp: expect.any(Number) },
        ],
        involvementRate: expect.any(Number)
      }
    });
  });
  test('add 1 dm, post 3 dm message and then remove 1 dm message', () => {
    tmp = h.postRequest(h.DM_CREATE_URL, { uIds: [uId1, uId2] }, token0);
    h.postRequest(h.MSG_SEND_DM_URL, { dmId: tmp.dmId, message: h.message1 }, token1);
    tmp = h.postRequest(h.MSG_SEND_DM_URL, { dmId: tmp.dmId, message: h.message2 }, token0);
    h.postRequest(h.MSG_SEND_DM_URL, { dmId: tmp.dmId, message: h.message3 }, token2);

    h.deleteRequest(h.MSG_RMV_URL, { messageId: tmp.messageId }, token0);
    const data: any = h.postRequest(h.USERS_STATS_URL, undefined, token0);
    expect(data).toStrictEqual({
      workspaceStats: {
        channelsExist: [
          { numChannelsJoined: 0, timeStamp: expect.any(Number) },
        ],
        dmsExist: [
          { numDmsJoined: 0, timeStamp: expect.any(Number) },
          { numDmsJoined: 1, timeStamp: expect.any(Number) }
        ],
        messagesExist: [
          { numMessagesSent: 0, timeStamp: expect.any(Number) },
          { numMessagesSent: 1, timeStamp: expect.any(Number) },
          { numMessagesSent: 2, timeStamp: expect.any(Number) },
          { numMessagesSent: 3, timeStamp: expect.any(Number) },
          { numMessagesSent: 2, timeStamp: expect.any(Number) },
        ],
        involvementRate: expect.any(Number)
      }
    });
  });
  test('add 1 dm, post 3 dm message and then remove dm', () => {
    tmp = h.postRequest(h.DM_CREATE_URL, { uIds: [uId1, uId2] }, token0);
    h.postRequest(h.MSG_SEND_DM_URL, { dmId: tmp.dmId, message: h.message1 }, token1);
    h.postRequest(h.MSG_SEND_DM_URL, { dmId: tmp.dmId, message: h.message2 }, token0);
    h.postRequest(h.MSG_SEND_DM_URL, { dmId: tmp.dmId, message: h.message3 }, token2);

    h.deleteRequest(h.DM_RMV_URL, { dmId: tmp.dmId }, token0);

    const data: any = h.postRequest(h.USERS_STATS_URL, undefined, token0);
    expect(data).toStrictEqual({
      workspaceStats: {
        channelsExist: [
          { numChannelsJoined: 0, timeStamp: expect.any(Number) },
        ],
        dmsExist: [
          { numDmsJoined: 0, timeStamp: expect.any(Number) },
          { numDmsJoined: 1, timeStamp: expect.any(Number) },
          { numDmsJoined: 0, timeStamp: expect.any(Number) }
        ],
        messagesExist: [
          { numMessagesSent: 0, timeStamp: expect.any(Number) },
          { numMessagesSent: 1, timeStamp: expect.any(Number) },
          { numMessagesSent: 2, timeStamp: expect.any(Number) },
          { numMessagesSent: 3, timeStamp: expect.any(Number) },
          { numMessagesSent: 2, timeStamp: expect.any(Number) },
          { numMessagesSent: 1, timeStamp: expect.any(Number) },
          { numMessagesSent: 0, timeStamp: expect.any(Number) },
        ],
        involvementRate: expect.any(Number)
      }
    });
  });
});
