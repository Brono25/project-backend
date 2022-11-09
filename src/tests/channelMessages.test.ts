
import * as h from './test.helper';
import {
  PageMessages,
} from '../data.types';

h.deleteRequest(h.CLEAR_URL, {});

const MSG = 'This is message';
const NO_MORE_MSGS = -1;
const MSG_PER_PAGE = 50;

// Setup
let token0: string;
let token1 : string;
let uId0: number;
let uId1: number;

let channelId0: number;
let invalidChannelId: number;
let start = 0;
const invalidStart = MSG_PER_PAGE + 10;
let tmp: any;
beforeEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});

  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  uId0 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;
  uId1 = parseInt(tmp.authUserId);

  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(0, true), token0);
  channelId0 = parseInt(tmp.channelId);
  invalidChannelId = Math.abs(channelId0) + 10;

  h.postRequest(h.MSG_SEND_URL, {
    channelId: channelId0,
    message: 'Setup message',
  }, token0);
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid Token', () => {
    const data = {
      channelId: channelId0,
      start: start,
    };
    h.testErrorThrown(h.CHAN_MSG_URL, 'GET', 403, data, h.invalidToken);
  });

  test('Invalid channelId', () => {
    const data = {
      channelId: invalidChannelId,
      start: start,
    };
    h.testErrorThrown(h.CHAN_MSG_URL, 'GET', 400, data, token0);
  });
  test('Valid channelId, token not a member', () => {
    const data = {
      channelId: channelId0,
      start: start,
    };
    h.testErrorThrown(h.CHAN_MSG_URL, 'GET', 403, data, token1);
  });

  test('start greater than num messages', () => {
    const data = {
      channelId: channelId0,
      start: invalidStart,
    };
    h.testErrorThrown(h.CHAN_MSG_URL, 'GET', 400, data, token0);
  });
});

// ------------------Function Testing------------------//
describe('Function Testing', () => {
  test('Return list of 4 messages', () => {
    const NUM_MSG = 3;
    for (let i = 0; i < NUM_MSG; i++) {
      h.postRequest(h.MSG_SEND_URL, {
        channelId: channelId0,
        message: `${MSG} ${i}`
      }, token0);
    }
    const data = h.getRequest(h.CHAN_MSG_URL, {
      channelId: channelId0,
      start: start,
    }, token0);
    expect(data).toStrictEqual(
      <PageMessages>{
        start: start,
        end: NO_MORE_MSGS,
        messages: [
          {
            messageId: expect.any(Number),
            uId: expect.any(Number),
            message: `${MSG} 2`,
            timeSent: expect.any(Number)
          },
          {
            messageId: expect.any(Number),
            uId: expect.any(Number),
            message: `${MSG} 1`,
            timeSent: expect.any(Number)
          },
          {
            messageId: expect.any(Number),
            uId: expect.any(Number),
            message: `${MSG} 0`,
            timeSent: expect.any(Number)
          },
          {
            messageId: expect.any(Number),
            uId: expect.any(Number),
            message: 'Setup message',
            timeSent: expect.any(Number)
          },
        ]
      });
  });
  test('More than 50 messages', () => {
    const NUM_MSG = 55;
    start = 3;
    for (let i = 0; i < NUM_MSG; i++) {
      h.postRequest(h.MSG_SEND_URL, {
        channelId: channelId0,
        message: `${MSG} ${i}`
      }, token0);
    }
    const data = <PageMessages> h.getRequest(h.CHAN_MSG_URL, {
      channelId: channelId0,
      start: start,
    }, token0);
    expect(data).toStrictEqual(
      <PageMessages>{
        start: start,
        end: start + MSG_PER_PAGE,
        messages: expect.any(Array),
      });
    expect(data.messages.length).toStrictEqual(MSG_PER_PAGE);
  });

  test('Start = Number of messages (return empty array)', () => {
    const NUM_MSG = 5;
    start = NUM_MSG + 1;
    for (let i = 0; i < NUM_MSG; i++) {
      h.postRequest(h.MSG_SEND_URL, {
        channelId: channelId0,
        message: `${MSG} ${i}`
      }, token0);
    }
    const data = <PageMessages> h.getRequest(h.CHAN_MSG_URL, {
      channelId: channelId0,
      start: start,
    }, token0);
    expect(data).toStrictEqual(
      <PageMessages>{
        start: start,
        end: NO_MORE_MSGS,
        messages: [],
      });
  });
});
