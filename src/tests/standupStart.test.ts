import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup: Create 3 users.

let token0: string;
let token1: string;
let channelId0: number;
let channelId1: number;
const length = 20;
let tmp: any;
beforeEach(() => {
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;
  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(0, true), token0);
  channelId0 = parseInt(tmp.channelId);
  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(1, true), token1);
  channelId1 = parseInt(tmp.channelId);
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid token0', () => {
    h.testErrorThrown(h.STANDUP_START_URL, 'POST', 403, { channelId: channelId0, length: length }, h.invalidToken);
  });
  test('Channel Id is not a valid channel', () => {
    h.testErrorThrown(h.STANDUP_START_URL, 'POST', 400, { channelId: channelId0, length: length }, token0);
  });
  test('Length is negative', () => {
    h.testErrorThrown(h.STANDUP_START_URL, 'POST', 400, { channelId: channelId0, length: -1 }, token0);
  });
  test('Standup is active', () => {
    h.testErrorThrown(h.STANDUP_START_URL, 'POST', 400, { channelId: channelId0, length: length }, token0);
  });
  test('User Unautherised', () => {
    h.testErrorThrown(h.STANDUP_START_URL, 'POST', 400, { channelId: channelId1, length: length }, token0);
  });
});
