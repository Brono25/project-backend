
import { ChannelId } from '../data.types';
import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup
let token0: string;
let tmp: any;
beforeEach(() => {
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Channel name too long', () => {
    const data = {
      name: h.invalidLongChannelName,
      isPublic: h.isPublic,
    };
    h.testErrorThrown(h.CHAN_CREATE_URL, 'POST', 400, data, token0);
  });
  test('Channel name empty', () => {
    const data = {
      name: h.invalidEmptyChannelName,
      isPublic: h.isPublic,
    };
    h.testErrorThrown(h.CHAN_CREATE_URL, 'POST', 400, data, token0);
  });
  test('Invalid token', () => {
    const data = {
      name: h.channelName1,
      isPublic: h.isPublic,
    };
    h.testErrorThrown(h.CHAN_CREATE_URL, 'POST', 403, data, h.invalidToken);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Create channel', () => {
    const data = h.postRequest(h.CHAN_CREATE_URL, {
      name: h.channelName0,
      isPublic: h.isPublic
    }, token0);
    expect(data).toStrictEqual(<ChannelId>{ channelId: expect.any(Number) });
  });

  test('One user create 100 channels and get 100 unique channel ID\'s', () => {
    const numberOfChannels = 100;
    const channelIdList = new Set();
    for (let n = 0; n < numberOfChannels; n++) {
      const data = h.postRequest(h.CHAN_CREATE_URL, {
        name: n.toString().concat(h.channelName0),
        isPublic: h.isPublic,
      }, token0);
      channelIdList.add(data);
    }
    expect(channelIdList.size === numberOfChannels).toStrictEqual(true);
  });
});
