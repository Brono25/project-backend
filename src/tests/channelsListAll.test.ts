
import {
  channelsListAllV1,
  channelsCreateV1,
} from '../channels';

import { authRegisterV1 } from '../auth';
import { clearV1 } from '../other';
import { channelJoinV1 } from '../channel';

// Test data
const firstName1 = 'First Name 1';
const lastName1 = 'Last Name 1';
const email1 = 'email_1@gmail.com';
const password1 = 'password1';

const firstName2 = 'First Name 2';
const lastName2 = 'Last Name 2';
const email2 = 'email_2@gmail.com';
const password2 = 'password2';

const channelName1 = 'Channel 1';
const channelName2 = 'Channel 2';
const channelName3 = 'Channel 3';

const isPublic = true;
const isNotPublic = false;

// SETUP
let user1Id = null;
let user2Id = null;
let invalidUserId = null;
let user1ChannelId = null;
let user1Channel2Id = null;
let user2ChannelId = null;
beforeEach(() => {
  user1Id = authRegisterV1(email1, password1, firstName1, lastName1).authUserId;
  user2Id = authRegisterV1(email2, password2, firstName2, lastName2).authUserId;
  invalidUserId = Math.abs(user1Id) + 173;

  user1ChannelId = channelsCreateV1(user1Id, channelName1, isPublic).channelId;
  user1Channel2Id = channelsCreateV1(user1Id, channelName3, isNotPublic).channelId;
  user2ChannelId = channelsCreateV1(user2Id, channelName2, isNotPublic).channelId;
  channelJoinV1(user1Id, user1Channel2Id);
});
// TEARDOWN
afterEach(() => { clearV1(); });

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Error Test: Invalid User ID', () => {
    expect(channelsListAllV1(invalidUserId)).toStrictEqual({ error: expect.any(String) });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Function Test: Valid User ID & Created Channels', () => {
    expect(channelsListAllV1(user1Id)).toStrictEqual({
      channels: [
        {
          channelId: user1ChannelId,
          name: channelName1,
        },
        {
          channelId: user1Channel2Id,
          name: channelName3,
        },
        {
          channelId: user2ChannelId,
          name: channelName2,
        },
      ],
    });
  });

  test('Function Test: Valid User ID & Private Channel', () => {
    expect(channelsListAllV1(user2Id)).toStrictEqual({
      channels: [
        {
          channelId: user1ChannelId,
          name: channelName1,
        },
        {
          channelId: user1Channel2Id,
          name: channelName3,
        },
        {
          channelId: user2ChannelId,
          name: channelName2,
        },
      ],
    });
  });
});
