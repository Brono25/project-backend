import * as h from './test.helper';
import {
  MessageId,
} from '../data.types';

h.deleteRequest(h.CLEAR_URL, {});

// Setup
let token0: string;
let token1: string;
let channelId0: number;
let invalidChannelId: number;
let tmp: any;
beforeEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;

  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(0, true), token0);
  channelId0 = parseInt(tmp.channelId);
  invalidChannelId = Math.abs(channelId0) + 10;
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid channel ID', () => {
    const data = {
      channelId: invalidChannelId,
      message: h.message0
    };
    h.testErrorThrown(h.MSG_SEND_URL, 'POST', 400, data, token0);
  });
  test('Message too short', () => {
    const data = {
      channelId: channelId0,
      message: h.invalidShortMessage,
    };
    h.testErrorThrown(h.MSG_SEND_URL, 'POST', 400, data, token0);
  });
  test('Message too long', () => {
    const data = {
      channelId: channelId0,
      message: h.invalidLongMessage,
    };
    h.testErrorThrown(h.MSG_SEND_URL, 'POST', 400, data, token0);
  });
  test('Valid channel, user exists but is not a member', () => {
    const data = {
      channelId: channelId0,
      message: h.message0
    };
    h.testErrorThrown(h.MSG_SEND_URL, 'POST', 403, data, token1);
  });
  test('Invalid Token', () => {
    const data = {
      channelId: channelId0,
      message: h.message0
    };
    h.testErrorThrown(h.MSG_SEND_URL, 'POST', 403, data, h.invalidToken);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Sending a message', () => {
    let data = h.postRequest(h.MSG_SEND_URL, {
      channelId: channelId0,
      message: h.message0
    }, token0);
    expect(data).toStrictEqual(<MessageId>{ messageId: expect.any(Number) });
    data = h.postRequest(h.MSG_SEND_URL, {
      channelId: channelId0,
      message: h.message0
    }, token0);
    expect(data).toStrictEqual(<MessageId>{ messageId: expect.any(Number) });
  });
});
