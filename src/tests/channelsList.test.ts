
import {
  channelsCreateV1,
  channelsListV2,
} from '../channels';
import { Channel } from '../data.types';
import { authRegisterV1 } from '../auth';
import { clearV1 } from '../other';
import { channelInviteV1 } from '../channel';
import * as h from './test.helper';

let token0: string;
let token1: string;
let token2: string;
let user: any;
let uId0: number;
let uId1: number;
let uId2: number;
let channel: any;
let channelId0: number;
let channelId1: number;
let channelId2: number;
let channelId3: number;
let invalidToken: string;
let invalidChannelId: number;
// SETUP
beforeEach(() => {
  // Create users 0, 1, 2
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
  // Create channels 0,1,2
  channel = h.postRequest(h.CHAN_CREATE_URL, {
    token: token0,
    name: h.channelName0,
    isPublic: h.isPublic,
  });
  channelId0 = parseInt(channel.channelId);
  channel = h.postRequest(h.CHAN_CREATE_URL, {
    token: token0,
    name: h.channelName1,
    isPublic: h.isNotPublic,
  });
  channelId1 = parseInt(channel.channelId);
  channel = h.postRequest(h.CHAN_CREATE_URL, {
    token: token0,
    name: h.channelName2,
    isPublic: h.isPublic,
  });
  channelId2 = parseInt(channel.channelId);
  channel = h.postRequest(h.CHAN_CREATE_URL, {
    token: token1,
    name: h.channelName3,
    isPublic: h.isNotPublic,
  });
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
  clearV1();
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
        {
          channelId: channelId3,
          name: h.channelName3,
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
