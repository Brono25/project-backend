
import { channelInviteV1 } from '../channel';
import { authRegisterV1 } from '../auth';
import { channelsCreateV1 } from '../channels';
import { clearV1 } from '../other';
import * as h from './test.helper';

// Setup
let authUserId0: number;
let invalidAuthUserId: number;
let channelId0: number;
let invalidChannelId: number;
let authUserId1: number;
beforeEach(() => {
  // Users 0,1
  let args: h.Args = [h.email0, h.password0, h.firstName0, h.lastName0];
  authUserId0 = h.authRegisterReturnGaurd(authRegisterV1(...args));
  args = [h.email1, h.password1, h.firstName1, h.lastName1];
  authUserId1 = h.authRegisterReturnGaurd(authRegisterV1(...args));
  // Channel 0
  args = [authUserId0, h.channelName0, h.isPublic];
  channelId0 = h.channelsCreateReturnGaurd(channelsCreateV1(...args));
  // Error types
  invalidAuthUserId = Math.abs(authUserId0) + Math.abs(authUserId1) + 10;
  invalidChannelId = Math.abs(channelId0) + 10;
});

// Tear down
afterEach(() => { clearV1(); });

// ------------------Error Testing------------------//
describe('Error Handling', () => {
  test('Invalid channel Id', () => {
    expect(channelInviteV1(authUserId0, invalidChannelId, authUserId1)).toStrictEqual({ error: expect.any(String) });
  });

  test('User already member of channel', () => {
    expect(channelInviteV1(authUserId0, channelId0, authUserId0)).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid User Id', () => {
    expect(channelInviteV1(invalidAuthUserId, channelId0, authUserId1)).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid User Id', () => {
    expect(channelInviteV1(authUserId0, channelId0, invalidAuthUserId)).toStrictEqual({ error: expect.any(String) });
  });

  test('authUser not a member', () => {
    expect(channelInviteV1(authUserId1, channelId0, authUserId1)).toStrictEqual({ error: expect.any(String) });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('adds the user to the channel', () => {
    expect(channelInviteV1(authUserId0, channelId0, authUserId1)).toStrictEqual({});
  });
});
