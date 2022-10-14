
import { channelMessagesV1 } from '../channel';

import { authRegisterV1 } from '../auth';
import { channelsCreateV1 } from '../channels';
import { clearV1 } from '../other';

import * as h from './test.helper';

let userId0: number;
let userId1: number;
let channelId0: number;
let channelId1: number;
let invalidChannelId: number;
let invalidUserId: number;
const start = 0;
const invalidStart = 10;
// Setup
beforeEach(() => {
  // Register users
  let args: h.Args = [h.email0, h.password0, h.firstName0, h.lastName0];
  userId0 = h.authRegisterReturnGaurd(authRegisterV1(...args));
  args = [h.email1, h.password1, h.firstName1, h.lastName1];
  userId1 = h.authRegisterReturnGaurd(authRegisterV1(...args));
  // Create channels
  args = [userId0, h.channelName0, h.isNotPublic];
  channelId0 = h.channelsCreateReturnGaurd(channelsCreateV1(...args));
  args = [userId1, h.channelName1, h.isNotPublic];
  channelId1 = h.channelsCreateReturnGaurd(channelsCreateV1(...args));
  // Invalid input
  invalidUserId = Math.abs(userId0) + Math.abs(userId1) + 10;
  invalidChannelId = Math.abs(channelId0) + 10;
});

// Tear down
afterEach(() => {
  clearV1();
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid authUserId', () => {
    expect(channelMessagesV1(invalidUserId, channelId0, start)).toStrictEqual(
      { error: expect.any(String) }
    );
  });

  test('Invalid channelId', () => {
    expect(
      channelMessagesV1(userId0, invalidChannelId, start)).toStrictEqual(
      { error: expect.any(String) }
    );
  });

  test('Valid channelId, authUserId not a member', () => {
    expect(channelMessagesV1(userId0, channelId1, start)).toStrictEqual(
      { error: expect.any(String) }
    );
  });

  test('start greater than num messages', () => {
    expect(channelMessagesV1(userId0, channelId0, invalidStart)).toStrictEqual(
      { error: expect.any(String) }
    );
  });
});

// ------------------Function Testing------------------//
/* describe('Function Testing', () => {

});
 */
