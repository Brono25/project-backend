
import { ChannelId } from '../data.types';
import * as h from './test.helper';

import { clearV1 } from '../other';
clearV1();
// Setup
let token0: string;
const invalidToken = 'Not An Active Token';
beforeEach(() => {
  const tmp: any = h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });
  token0 = tmp.token;
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Channel name too long', () => {
    const data = h.postRequest(h.CHAN_CREATE_URL, {
      token: token0,
      name: h.invalidLongChannelName,
      isPublic: h.isPublic,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Channel name empty', () => {
    const data = h.postRequest(h.CHAN_CREATE_URL, {
      token: token0,
      name: h.invalidEmptyChannelName,
      isPublic: h.isPublic,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Invalid token', () => {
    const data = h.postRequest(h.CHAN_CREATE_URL, {
      token: invalidToken,
      name: h.channelName1,
      isPublic: h.isPublic,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Create channel', () => {
    const data = h.postRequest(h.CHAN_CREATE_URL, {
      token: token0,
      name: h.invalidLongChannelName,
      isPublic: h.isPublic,
    });
    expect(data).toStrictEqual(<ChannelId>{ channelId: expect.any(Number) });
  });

  test('One user create 100 channels and get 100 unique channel ID\'s', () => {
    const numberOfChannels = 100;
    const channelIdList = new Set();
    for (let n = 0; n < numberOfChannels; n++) {
      const data = h.postRequest(h.CHAN_CREATE_URL, {
        token: token0,
        name: n.toString().concat(h.channelName0),
        isPublic: h.isPublic,
      });
      channelIdList.add(data);
    }
    expect(channelIdList.size === numberOfChannels).toStrictEqual(true);
  });
});
