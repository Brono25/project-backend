
import { Channel } from '../data.types';

import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// SETUP
let token0: string;
let token1: string;
let publicChannelId : number;
let privateChannelId0: number;
let privateChannelId1: number;

beforeEach(() => {
  let tmp: any = h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });
  token0 = tmp.token;

  tmp = h.postRequest(h.REGISTER_URL, {
    email: h.email1,
    password: h.password1,
    nameFirst: h.firstName1,
    nameLast: h.lastName1,
  });
  token1 = tmp.token;

  tmp = h.postRequest(h.CHAN_CREATE_URL, {
    token: token0,
    name: h.channelName0,
    isPublic: h.isPublic,
  });
  publicChannelId = tmp.channelId;
  tmp = h.postRequest(h.CHAN_CREATE_URL, {
    token: token0,
    name: h.channelName1,
    isPublic: h.isNotPublic,
  });
  privateChannelId0 = tmp.channelId;
  tmp = h.postRequest(h.CHAN_CREATE_URL, {
    token: token1,
    name: h.channelName2,
    isPublic: h.isNotPublic,
  });
  privateChannelId1 = tmp.channelId;

  h.postRequest(h.CHAN_JOIN_URL, {
    token: token0,
    channelId: privateChannelId0,
  });
});
// TEARDOWN
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid Token', () => {
    const data = h.getRequest(h.CHAN_LIST_ALL_URL, {
      token: h.invalidToken,
    });
    expect(data).toStrictEqual({ error: 'Invalid Token' });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Function Test: Private and Public channels', () => {
    const data = h.getRequest(h.CHAN_LIST_ALL_URL, {
      token: token1,
    });
    expect(data).toStrictEqual({
      channels: <Channel[]>[
        {
          channelId: publicChannelId,
          name: h.channelName0,
        },
        {
          channelId: privateChannelId0,
          name: h.channelName1,
        },
        {
          channelId: privateChannelId1,
          name: h.channelName2,
        },
      ],
    });
  });
});
