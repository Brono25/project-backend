
import {
  channelsCreateV1,
  channelsListV1,
} from '../channels';

import { authRegisterV1 } from '../auth';
import { clearV1 } from '../other';
import { channelInviteV1 } from '../channel';

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
const channelName4 = 'Channel 4';
const isPublic = true;
const isNotPublic = false;

let authUserId1 = null;
let authUserId2 = null;
let invalidAuthUserId = null;
let publicChannelId1 = null;
let publicChannelId2 = null;
let privateChannelId1 = null;
let privateChannelId2 = null;
// Setup
beforeEach(() => {
  authUserId1 = authRegisterV1(email1, password1, firstName1, lastName1).authUserId;
  authUserId2 = authRegisterV1(email2, password2, firstName2, lastName2).authUserId;

  // User 1's owner of channels
  publicChannelId1 = channelsCreateV1(authUserId1, channelName1, isPublic).channelId;
  publicChannelId2 = channelsCreateV1(authUserId1, channelName2, isPublic).channelId;
  privateChannelId1 = channelsCreateV1(authUserId1, channelName3, isNotPublic).channelId;
  privateChannelId2 = channelsCreateV1(authUserId1, channelName4, isNotPublic).channelId;

  // User 2 member of channels
  channelInviteV1(authUserId1, privateChannelId1, authUserId2);
  channelInviteV1(authUserId1, publicChannelId1, authUserId2);
  channelInviteV1(authUserId1, publicChannelId2, authUserId2);

  invalidAuthUserId = Math.abs(authUserId1) + 10;
});
// Tear down
afterEach(() => { clearV1(); });

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid user ID', () => {
    expect(channelsListV1(invalidAuthUserId)).toStrictEqual({ error: expect.any(String) });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('List channels for public', () => {
    expect(channelsListV1(authUserId1)).toStrictEqual({
      channels: [
        {
          channelId: publicChannelId1,
          name: channelName1,
        },
        {
          channelId: publicChannelId2,
          name: channelName2,
        },
        {
          channelId: privateChannelId1,
          name: channelName3,
        },
        {
          channelId: privateChannelId2,
          name: channelName4,
        },
      ]
    });
  });
  test('List channels for private', () => {
    expect(channelsListV1(authUserId2)).toStrictEqual({
      channels: [
        {
          channelId: publicChannelId1,
          name: channelName1,
        },
        {
          channelId: publicChannelId2,
          name: channelName2,
        },
        {
          channelId: privateChannelId1,
          name: channelName3,
        },
      ]
    });
  });
});
