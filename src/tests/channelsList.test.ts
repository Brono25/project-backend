
import { Channel } from '../data.types';
import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

let token0: string;
let token1: string;
let token2: string;
let user: any;
let channel: any;
let channelId0: number;
let channelId1: number;
let channelId2: number;
let channelId3: number;
let invalidToken: string;
// SETUP
beforeEach(() => {
  // Create users 0, 1, 2
  user = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = user.token;
  user = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = user.token;
  user = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
  token2 = user.token;
  // Create channels 0,1,2
  channel = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(0, true), token0);
  channelId0 = parseInt(channel.channelId);
  channel = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(1, false), token0);
  channelId1 = parseInt(channel.channelId);
  channel = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(0, true), token0);
  channelId2 = parseInt(channel.channelId);
  channel = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(3, false), token1);
  channelId3 = parseInt(channel.channelId);
  // User 1 joins Channel 0 and Channel 1
  h.postRequest(h.CHAN_JOIN_URL, {
    token: token1,
    channelId: channelId0,
  });
  h.postRequest(h.CHAN_JOIN_URL, {
    token: token1,
    channelId: channelId2,
  });
  // Error cases
  invalidToken = h.invalidToken;
});
// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid Token', () => {
    const invalidInput: any = h.getRequest(h.CHAN_LIST_URL, {
      token: invalidToken,
    });
    expect(invalidInput).toStrictEqual({ error: expect.any(String) });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('For Owner: List users channels with mix of public and private channels', () => {
    const input: any = h.getRequest(h.CHAN_LIST_URL, {
      token: token0,
    });
    expect(input).toStrictEqual({
      channels: <Channel[]>[
        {
          channelId: channelId0,
          name: h.channelName0,
        },
        {
          channelId: channelId1,
          name: h.channelName1,
        },
        {
          channelId: channelId2,
          name: h.channelName2,
        },
      ]
    });
  });
  test('For Member: List channels with mix of public and private channels', () => {
    const input: any = h.getRequest(h.CHAN_LIST_URL, {
      token: token1,
    });
    expect(input).toStrictEqual({
      channels: <Channel[]>[
        {
          channelId: channelId0,
          name: h.channelName0,
        },
        {
          channelId: channelId2,
          name: h.channelName2,
        },
        {
          channelId: channelId3,
          name: h.channelName3,
        },
      ]
    });
  });
  test('For user who has no channels', () => {
    const input: any = h.getRequest(h.CHAN_LIST_URL, {
      token: token2,
    });
    expect(input).toStrictEqual({
      channels: <Channel[]>[]
    });
  });
});
