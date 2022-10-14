
import { channelJoinV1 } from '../channel';
import { authRegisterV1 } from '../auth';
import { channelsCreateV1 } from '../channels';
import { clearV1 } from '../other';
import * as h from './helper.test';

// Setup
let authUserId0: number = null;
let invalidAuthUserId: number = null;
let channelId0: number = null;
let invalidChannelId: number = null;
let authUserId1: number = null;
let channelIdPriv: number = null;
let authUserId2: number = null;
beforeEach(() => {
  // Users 0,1,2
  let args: h.Args;
  args = [h.email0, h.password0, h.firstName0, h.lastName0];
  authUserId0 = h.authRegisterReturnGaurd(authRegisterV1(...args));
  args = [h.email1, h.password1, h.firstName1, h.lastName1];
  authUserId1 = h.authRegisterReturnGaurd(authRegisterV1(...args));
  args = [h.email2, h.password2, h.firstName2, h.lastName2];
  authUserId2 = h.authRegisterReturnGaurd(authRegisterV1(...args));
  // Channels 0 and private
  channelId0 = h.channelsCreateReturnGaurd(channelsCreateV1(authUserId0, h.channelName0, h.isPublic));
  channelIdPriv = h.channelsCreateReturnGaurd(channelsCreateV1(authUserId1, h.channelName1, h.isNotPublic));
  // Error inputs
  invalidAuthUserId = Math.abs(authUserId0) + Math.abs(authUserId1) + Math.abs(authUserId2) + 10;
  invalidChannelId = Math.abs(channelId0) + Math.abs(channelIdPriv) + 10;
});
// Tear down
afterEach(() => {
  clearV1();
});

// ------------------Error Testing------------------//
describe('Error Handling', () => {
  test('Invalid channel Id', () => {
    expect(channelJoinV1(authUserId0, invalidChannelId)).toStrictEqual({ error: expect.any(String) });
  });

  test('User already member of channel', () => {
    expect(channelJoinV1(authUserId0, channelId0)).toStrictEqual({ error: expect.any(String) });
  });

  test('Private channelId', () => {
    expect(channelJoinV1(authUserId2, channelIdPriv)).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid User Id', () => {
    expect(channelJoinV1(invalidAuthUserId, channelId0)).toStrictEqual({ error: expect.any(String) });
  });
});

// ------------------Function Testing------------------//
describe('Function Testing', () => {
  test('adds a global member to the channel', () => {
    expect(channelJoinV1(authUserId1, channelId0)).toStrictEqual({});
  });

  test('adds a global owner to the channel', () => {
    expect(channelJoinV1(authUserId0, channelIdPriv)).toStrictEqual({});
  });
});
