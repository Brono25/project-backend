
import { ChannelId } from '../data.types';
import { channelsCreateV1 } from '../channels';
import { authRegisterV1 } from '../auth';
import { clearV1 } from '../other';
import * as h from './test.helper';


// Setup
let authUserId0: number;
let invalidAuthUserId: number;
beforeEach(() => {
  // Register users
  const args: h.Args = [h.email0, h.password0, h.firstName0, h.lastName0];
  authUserId0 = h.authRegisterReturnGaurd(authRegisterV1(...args));
  invalidAuthUserId = Math.abs(authUserId0) + 10;
});
// Tear down
afterEach(() => {
  clearV1();
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Channel name too long', () => {
    const args: h.Args = [authUserId0, h.invalidLongChannelName, h.isPublic];
    expect(channelsCreateV1(...args)).toStrictEqual({ error: expect.any(String) });
  });
  test('Channel name empty', () => {
    const args: h.Args = [authUserId0, h.invalidEmptyChannelName, h.isPublic];
    expect(channelsCreateV1(...args)).toStrictEqual({ error: expect.any(String) });
  });
  test('Invalid user ID', () => {
    const args: h.Args = [invalidAuthUserId, h.channelName0, h.isPublic];
    expect(channelsCreateV1(...args)).toStrictEqual({ error: expect.any(String) });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Create channel', () => {
    const args: h.Args = [authUserId0, h.channelName1, h.isPublic];
    expect(channelsCreateV1(...args)).toStrictEqual(<ChannelId>{ channelId: expect.any(Number) });
  });

  test('One user create 100 channels and get 100 unique ID\'s', () => {
    const numberOfChannels = 100;
    const channelIdList = new Set();
    for (let n = 0; n < numberOfChannels; n++) {
      const args: h.Args = [authUserId0, n.toString().concat(h.channelName0), h.isPublic];
      const channelId = channelsCreateV1(...args);
      channelIdList.add(channelId);
    }
    expect(channelIdList.size === numberOfChannels).toStrictEqual(true);
  });
});
