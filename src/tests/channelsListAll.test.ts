
import {
  channelsListAllV1,
  channelsCreateV1,
} from '../channels';
import { Channel } from '../data.types';
import { authRegisterV1 } from '../auth';
import { clearV1 } from '../other';
import { channelJoinV1 } from '../channel';
import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// SETUP
let userId0: number;
let userId1: number;
let invalidUserId: number;
let publicChannelId : number;
let privateChannelId0: number;
let privateChannelId1: number;
let channelId0: number;
let start = 0;
beforeEach(() => {
  let args: h.Args = [h.email0, h.password0, h.firstName0, h.lastName0];
  userId0 = h.authRegisterReturnGaurd(authRegisterV1(...args));
  args = [h.email1, h.password1, h.firstName1, h.lastName1];
  userId1 = h.authRegisterReturnGaurd(authRegisterV1(...args));

  args = [userId0, h.channelName0, h.isPublic];
  publicChannelId = h.channelsCreateReturnGaurd(channelsCreateV1(...args));
  args = [userId0, h.channelName1, h.isNotPublic];
  privateChannelId0 = h.channelsCreateReturnGaurd(channelsCreateV1(...args));
  args = [userId1, h.channelName2, h.isNotPublic];
  privateChannelId1 = h.channelsCreateReturnGaurd(channelsCreateV1(...args));

  channelJoinV1(userId0, privateChannelId0);

  invalidUserId = Math.abs(userId0) + Math.abs(userId1) + 173;
});
// TEARDOWN
afterEach(() => {
  clearV1();
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Error Test: Invalid User ID', () => {
    expect(channelsListAllV1(invalidUserId)).toStrictEqual({ error: expect.any(String) });
  });
});

describe('Error Handling', () => {
  test('Invalid Token', () => {
    const data = h.getRequest(h.CHAN_MSG_URL, {
      token: h.invalidToken,
      channelId: channelId0,
      start: start,
    });
    expect(data).toStrictEqual({ error: 'Invalid Token' });

  })


})

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Function Test: Private and Public channels', () => {
    expect(channelsListAllV1(userId1)).toStrictEqual({
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
