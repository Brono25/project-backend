
import { Channel } from '../data.types';

import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// SETUP
let token0: string;
let token1: string;
let publicChannelId : number;
let privateChannelId0: number;
let privateChannelId1: number;

let tmp: any;

beforeEach(() => {
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;

  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(0, true), token0);
  publicChannelId = parseInt(tmp.channelId);
  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(1, false), token0);
  privateChannelId0 = parseInt(tmp.channelId);
  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(2, false), token1);
  privateChannelId1 = parseInt(tmp.channelId);
  h.postRequest(h.CHAN_JOIN_URL, { channelId: publicChannelId }, token1);
});

// TEARDOWN
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid Token', () => {
    h.testErrorThrown(h.CHAN_LIST_ALL_URL, 'GET', 403, {}, h.invalidToken);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Function Test: Private and Public channels', () => {
    const data = h.getRequest(h.CHAN_LIST_ALL_URL, {}, token1);
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
