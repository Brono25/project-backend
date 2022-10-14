
import {
  channelsCreateV1,
  channelsListV1,
} from '../channels';

import { authRegisterV1 } from '../auth';
import { clearV1 } from '../other';
import { channelInviteV1 } from '../channel';
import * as h from './test.helper';

let authUserId0: number;
let authUserId1: number;
let invalidAuthUserId: number;
let publicChannelId0: number;
let publicChannelId1: number;
let privateChannelId0: number;
let privateChannelId1: number;
// Setup
beforeEach(() => {
  let args: h.Args = [h.email0, h.password0, h.firstName0, h.lastName0];
  authUserId0 = h.authRegisterReturnGaurd(authRegisterV1(...args));
  args = [h.email1, h.password1, h.firstName1, h.lastName1];
  authUserId1 = h.authRegisterReturnGaurd(authRegisterV1(...args));

  // User 1's owner of channels
  args = [authUserId0, h.channelName0, h.isPublic];
  publicChannelId0 = h.channelsCreateReturnGaurd(channelsCreateV1(...args));
  args = [authUserId0, h.channelName1, h.isPublic];
  publicChannelId1 = h.channelsCreateReturnGaurd(channelsCreateV1(...args));
  args = [authUserId0, h.channelName2, h.isNotPublic];
  privateChannelId0 = h.channelsCreateReturnGaurd(channelsCreateV1(...args));
  args = [authUserId0, h.channelName3, h.isNotPublic];
  privateChannelId1 = h.channelsCreateReturnGaurd(channelsCreateV1(...args));

  // User 2 member of channels
  channelInviteV1(authUserId0, privateChannelId0, authUserId1);
  channelInviteV1(authUserId0, publicChannelId0, authUserId1);

  invalidAuthUserId = Math.abs(authUserId0) + Math.abs(authUserId1) + 10;
});
// Tear down
afterEach(() => {
  clearV1();
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid user ID', () => {
    expect(channelsListV1(invalidAuthUserId)).toStrictEqual({ error: expect.any(String) });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('List users channels with mix of public and private channels', () => {
    expect(channelsListV1(authUserId0)).toStrictEqual({
      channels: [
        {
          channelId: publicChannelId0,
          name: h.channelName0,
        },
        {
          channelId: publicChannelId1,
          name: h.channelName1,
        },
        {
          channelId: privateChannelId0,
          name: h.channelName2,
        },
        {
          channelId: privateChannelId1,
          name: h.channelName3,
        },
      ]
    });
  });
  test('List channels when user has only private channels', () => {
    expect(channelsListV1(authUserId1)).toStrictEqual({
      channels: [
        {
          channelId: publicChannelId0,
          name: h.channelName0,
        },
        {
          channelId: privateChannelId0,
          name: h.channelName2,
        },
      ]
    });
  });
});
