
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
  h.postRequest(h.MSG_SEND_DM_URL, { dmId: dmId0, message: h.message0 }, token0);
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid Token', () => {
    const data = {
      dmId: dmId0,
      start: start,
    };
    h.testErrorThrown(h.DM_MSG_URL, 'GET', 403, data, h.invalidToken);
  });

  test('Invalid dmId', () => {
    const data = {
      dmId: invalidDmId,
      start: start,
    };
    h.testErrorThrown(h.DM_MSG_URL, 'GET', 400, data, token0);
  });
  test('Valid dmId, token not a member', () => {
    const data = {
      dmId: dmId0,
      start: start,
    };
    h.testErrorThrown(h.DM_MSG_URL, 'GET', 403, data, token1);
  });

  test('start greater than num messages', () => {
    const data = {
      dmId: dmId0,
      start: invalidStart,
    };
    h.testErrorThrown(h.DM_MSG_URL, 'GET', 400, data, token0);
  });
});

// ------------------Function Testing------------------//
describe('Function Testing', () => {
  test('Return list of 4 messages', () => {
    h.postRequest(h.MSG_SEND_DM_URL, { dmId: dmId0, message: h.message1 }, token0);
    h.postRequest(h.MSG_SEND_DM_URL, { dmId: dmId0, message: h.message2 }, token0);
    h.postRequest(h.MSG_SEND_DM_URL, { dmId: dmId0, message: h.message3 }, token0);

    const data = h.getRequest(h.DM_MSG_URL, {
      dmId: dmId0,
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
            message: h.message3,
            timeSent: expect.any(Number)
          },
          {
            messageId: expect.any(Number),
            uId: expect.any(Number),
            message: h.message2,
            timeSent: expect.any(Number)
          },
          {
            messageId: expect.any(Number),
            uId: expect.any(Number),
            message: h.message1,
            timeSent: expect.any(Number)
          },
          {
            messageId: expect.any(Number),
            uId: expect.any(Number),
            message: h.message0,
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
        dmId: dmId0,
        message: `${MSG} ${i}`
      }, token0);
    }
    const data = <PageMessages> h.getRequest(h.DM_MSG_URL, {
      dmId: dmId0,
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
      h.postRequest(h.MSG_SEND_DM_URL, {
        dmId: dmId0,
        message: `${MSG} ${i}`
      }, token0);
    }
    const data = <PageMessages> h.getRequest(h.DM_MSG_URL, {
      dmId: dmId0,
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
