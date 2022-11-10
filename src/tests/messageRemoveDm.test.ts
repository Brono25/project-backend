import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});
const MSG = 'Message ';
// Setup
let token0: string;
let token1 : string;
let token2: string;
let uId0: number;
let uId1: number;
let uId2: number;

let mId1: number;
let mId2: number;
let mId3: number;
let mId4: number;
let invalidMsgId: number;
let tmp: any;
beforeEach(() => {
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  uId0 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;
  uId1 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
  token2 = tmp.token;
  uId2 = parseInt(tmp.authUserId);

  tmp = h.postRequest(h.DM_CREATE_URL, { uIds: [uId1, uId2] }, token0);
  const dmId0 = parseInt(tmp.dmId);
  tmp = h.postRequest(h.DM_CREATE_URL, { uIds: [uId0] }, token1);
  const dmId1 = parseInt(tmp.dmId);

  tmp = h.postRequest(h.MSG_SEND_DM_URL, { dmId: dmId0, message: MSG + '0' }, token0);
  tmp = h.postRequest(h.MSG_SEND_DM_URL, { dmId: dmId0, message: MSG + '1' }, token1);
  mId1 = parseInt(tmp.messageId);
  tmp = h.postRequest(h.MSG_SEND_DM_URL, { dmId: dmId0, message: MSG + '2' }, token2);
  mId2 = parseInt(tmp.messageId);
  tmp = h.postRequest(h.MSG_SEND_DM_URL, { dmId: dmId1, message: MSG + '3' }, token1);
  mId3 = parseInt(tmp.messageId);
  tmp = h.postRequest(h.MSG_SEND_DM_URL, { dmId: dmId1, message: MSG + '4' }, token0);
  mId4 = parseInt(tmp.messageId);
  invalidMsgId = mId1 + mId2 + mId3 + mId4 + 10;
});
// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------///
describe('Error Handling', () => {
  test('Invalid token', () => {
    const data = { messageId: mId4 };
    h.testErrorThrown(h.MSG_RMV_URL, 'DELETE', 403, data, h.invalidToken);
  });
  test('User is not part of the DM that the message was posted in', () => {
    const data = { messageId: mId4 };
    h.testErrorThrown(h.MSG_RMV_URL, 'DELETE', 403, data, token2);
  });
  test('Member try to delete message they didnt post', () => {
    const data = { messageId: mId1 };
    h.testErrorThrown(h.MSG_RMV_URL, 'DELETE', 403, data, token2);
  });
  test('Global owner who didnt create dm try to delete message they didnt create', () => {
    const data = { messageId: mId3 };
    h.testErrorThrown(h.MSG_RMV_URL, 'DELETE', 403, data, token0);
  });
  test('Invalid message id', () => {
    const data = { messageId: invalidMsgId };
    h.testErrorThrown(h.MSG_RMV_URL, 'DELETE', 400, data, token0);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Member deletes own message', () => {
    const data = h.deleteRequest(h.MSG_RMV_URL, {
      messageId: mId2,
    }, token2);
    expect(data).toStrictEqual({});
  });
  test('Owner deletes own message', () => {
    const data = h.deleteRequest(h.MSG_RMV_URL, {
      messageId: mId3,
    }, token1);
    expect(data).toStrictEqual({});
  });
  test('Owner deletes members message', () => {
    const data = h.deleteRequest(h.MSG_RMV_URL, {
      messageId: mId4,
    }, token1);
    expect(data).toStrictEqual({});
  });
});
