
import { channelsCreateV1 } from '../channels';
import { authRegisterV1 } from '../auth';
import { clearV1 } from '../other';

type Args = [number, string, boolean];

// Test data
const firstName1 = 'First Name 1';
const lastName1 = 'Last Name 1';
const email1 = 'email_1@gmail.com';
const password1 = 'password1';
const channelName1 = 'Channel 1';
const isPublic = true;
const invalidEmptyChannelName = '';
const invalidLongChannelName = 'ChannelsNamesMoreThanTwentyCharactersAreInvalid';

// Setup
let authUserId1 = null;
let invalidAuthUserId = null;
beforeEach(() => {
  authUserId1 = authRegisterV1(email1, password1, firstName1, lastName1).authUserId;
  invalidAuthUserId = Math.abs(authUserId1) + 10;
});
// Tear down
afterEach(() => { clearV1(); });

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Channel name too long', () => {
    const args: Args = [authUserId1, invalidLongChannelName, isPublic];
    expect(channelsCreateV1(...args)).toStrictEqual({ error: expect.any(String) });
  });
  test('Channel name empty', () => {
    const args: Args = [authUserId1, invalidEmptyChannelName, isPublic];
    expect(channelsCreateV1(...args)).toStrictEqual({ error: expect.any(String) });
  });
  test('Invalid user ID', () => {
    const args: Args = [invalidAuthUserId, channelName1, isPublic];
    expect(channelsCreateV1(...args)).toStrictEqual({ error: expect.any(String) });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Create channel', () => {
    const args: Args = [authUserId1, channelName1, isPublic];
    expect(channelsCreateV1(...args)).toStrictEqual({ channelId: expect.any(Number) });
  });

  test('One user create 100 channels and get 100 unique ID\'s', () => {
    const numberOfChannels = 100;
    const channelIdList = new Set();
    for (let n = 0; n < numberOfChannels; n++) {
      const args: Args = [authUserId1, n.toString().concat(channelName1), isPublic];
      const channelId = channelsCreateV1(...args);
      channelIdList.add(channelId);
    }
    expect(channelIdList.size === numberOfChannels).toStrictEqual(true);
  });
});
