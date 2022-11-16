
import * as h from './test.helper';
h.deleteRequest(h.CLEAR_URL, {});

// Setup
let token0: string;
let token1 : string;
let token2 : string;

let uId1: number;
let uId2: number;

let tmp: any;

beforeEach(() => {
  // tokens 0,1 and 2
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
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
    const data: any = h.getRequest(h.USERS_STATS_URL, {}, token0);
    expect(data).toStrictEqual({
      workspaceStats: {
        channelsExist: [
          { numChannelsExist: 0, timeStamp: expect.any(Number) },
          { numChannelsExist: 1, timeStamp: expect.any(Number) }
        ],
        dmsExist: [
          { numDmsExist: 0, timeStamp: expect.any(Number) },
          { numDmsExist: 1, timeStamp: expect.any(Number) }
        ],
        messagesExist: [
          { numMessagesExist: 0, timeStamp: expect.any(Number) },
          { numMessagesExist: 1, timeStamp: expect.any(Number) },
          { numMessagesExist: 2, timeStamp: expect.any(Number) },
          { numMessagesExist: 3, timeStamp: expect.any(Number) },
          { numMessagesExist: 4, timeStamp: expect.any(Number) },
        ],
        utilizationRate: expect.any(Number)
      }
    });
  });
  test('add 1 channel with 1 message, remove message', () => {
    tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(0, true), token0);
    tmp = h.postRequest(h.MSG_SEND_URL, { channelId: tmp.channelId, message: h.message0 }, token0);
    h.deleteRequest(h.MSG_RMV_URL, { messageId: tmp.messageId }, token0);

    const data: any = h.getRequest(h.USERS_STATS_URL, undefined, token0);
    expect(data).toStrictEqual({
      workspaceStats: {
        channelsExist: [
          { numChannelsExist: 0, timeStamp: expect.any(Number) },
          { numChannelsExist: 1, timeStamp: expect.any(Number) }
        ],
        dmsExist: [
          { numDmsExist: 0, timeStamp: expect.any(Number) },
        ],
        messagesExist: [
          { numMessagesExist: 0, timeStamp: expect.any(Number) },
          { numMessagesExist: 1, timeStamp: expect.any(Number) },
          { numMessagesExist: 0, timeStamp: expect.any(Number) },
        ],
        utilizationRate: expect.any(Number)
      }
    });
  });
  test('add 1 dm, post 3 dm message and then remove 1 dm message', () => {
    tmp = h.postRequest(h.DM_CREATE_URL, { uIds: [uId1, uId2] }, token0);
    const dmId: number = tmp.dmId;
    h.postRequest(h.MSG_SEND_DM_URL, { dmId: dmId, message: h.message1 }, token1);
    tmp = h.postRequest(h.MSG_SEND_DM_URL, { dmId: dmId, message: h.message2 }, token0);
    h.postRequest(h.MSG_SEND_DM_URL, { dmId: dmId, message: h.message3 }, token2);

    h.deleteRequest(h.MSG_RMV_URL, { messageId: tmp.messageId }, token0);
    const data: any = h.getRequest(h.USERS_STATS_URL, undefined, token0);
    expect(data).toStrictEqual({
      workspaceStats: {
        channelsExist: [
          { numChannelsExist: 0, timeStamp: expect.any(Number) },
        ],
        dmsExist: [
          { numDmsExist: 0, timeStamp: expect.any(Number) },
          { numDmsExist: 1, timeStamp: expect.any(Number) }
        ],
        messagesExist: [
          { numMessagesExist: 0, timeStamp: expect.any(Number) },
          { numMessagesExist: 1, timeStamp: expect.any(Number) },
          { numMessagesExist: 2, timeStamp: expect.any(Number) },
          { numMessagesExist: 3, timeStamp: expect.any(Number) },
          { numMessagesExist: 2, timeStamp: expect.any(Number) },
        ],
        utilizationRate: expect.any(Number)
      }
    });
  });
  test('add 1 dm, post 3 dm message and then remove dm', () => {
    tmp = h.postRequest(h.DM_CREATE_URL, { uIds: [uId1, uId2] }, token0);
    h.postRequest(h.MSG_SEND_DM_URL, { dmId: tmp.dmId, message: h.message1 }, token1);
    h.postRequest(h.MSG_SEND_DM_URL, { dmId: tmp.dmId, message: h.message2 }, token0);
    h.postRequest(h.MSG_SEND_DM_URL, { dmId: tmp.dmId, message: h.message3 }, token2);

    h.deleteRequest(h.DM_RMV_URL, { dmId: tmp.dmId }, token0);

    const data: any = h.getRequest(h.USERS_STATS_URL, undefined, token0);
    expect(data).toStrictEqual({
      workspaceStats: {
        channelsExist: [
          { numChannelsExist: 0, timeStamp: expect.any(Number) },
        ],
        dmsExist: [
          { numDmsExist: 0, timeStamp: expect.any(Number) },
          { numDmsExist: 1, timeStamp: expect.any(Number) },
          { numDmsExist: 0, timeStamp: expect.any(Number) }
        ],
        messagesExist: [
          { numMessagesExist: 0, timeStamp: expect.any(Number) },
          { numMessagesExist: 1, timeStamp: expect.any(Number) },
          { numMessagesExist: 2, timeStamp: expect.any(Number) },
          { numMessagesExist: 3, timeStamp: expect.any(Number) },
          { numMessagesExist: 2, timeStamp: expect.any(Number) },
          { numMessagesExist: 1, timeStamp: expect.any(Number) },
          { numMessagesExist: 0, timeStamp: expect.any(Number) },
        ],
        utilizationRate: expect.any(Number)
      }
    });
  });
});
