
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
let token1: string;
let dmId0: number;
let invalidDmId: number;
let start = 0;
const invalidStart = MSG_PER_PAGE + 10;
let tmp: any;
beforeEach(() => {
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;

  tmp = h.postRequest(h.DM_CREATE_URL, { uIds: [] }, token0);
  dmId0 = parseInt(tmp.dmId);

  invalidDmId = Math.abs(dmId0) + 10;

  h.postRequest(h.MSG_SEND_DM_URL, {
    token: token0,
    dmId: dmId0,
    message: 'Setup message',
  });
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid Token', () => {
    const data = h.getRequest(h.DM_MSG_URL, {
      token: h.invalidToken,
      dmId: dmId0,
      start: start,
    });
    expect(data).toStrictEqual({ error: 'Invalid Token' });
  });

  test('Invalid dmId', () => {
    const data = h.getRequest(h.DM_MSG_URL, {
      token: token0,
      dmId: invalidDmId,
      start: start,
    });
    expect(data).toStrictEqual({ error: 'Invalid dmId' });
  });
  test('Valid dmId, token not a member', () => {
    const data = h.getRequest(h.DM_MSG_URL, {
      token: token1,
      dmId: dmId0,
      start: start,
    });
    expect(data).toStrictEqual({ error: 'User is not a member of the dm' });
  });

  test('start greater than num messages', () => {
    const data = h.getRequest(h.DM_MSG_URL, {
      token: token0,
      dmId: dmId0,
      start: invalidStart,
    });
    expect(data).toStrictEqual({ error: 'Messages start too high' });
  });
});

// ------------------Function Testing------------------//
describe('Function Testing', () => {
  test('Return list of 4 messages', () => {
    const NUM_MSG = 3;
    for (let i = 0; i < NUM_MSG; i++) {
      h.postRequest(h.MSG_SEND_DM_URL, {
        token: token0,
        dmId: dmId0,
        message: `${MSG} ${i}`
      });
    }
    const data = h.getRequest(h.DM_MSG_URL, {
      token: token0,
      dmId: dmId0,
      start: start,
    });
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
      h.postRequest(h.MSG_SEND_DM_URL, {
        token: token0,
        dmId: dmId0,
        message: `${MSG} ${i}`
      });
    }
    const data = <PageMessages> h.getRequest(h.DM_MSG_URL, {
      token: token0,
      dmId: dmId0,
      start: start,
    });
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
      h.postRequest(h.MSG_SEND_DM_URL, {
        token: token0,
        dmId: dmId0,
        message: `${MSG} ${i}`
      });
    }
    const data = <PageMessages> h.getRequest(h.DM_MSG_URL, {
      token: token0,
      dmId: dmId0,
      start: start,
    });
    expect(data).toStrictEqual(
      <PageMessages>{
        start: start,
        end: NO_MORE_MSGS,
        messages: [],
      });
  });
});
