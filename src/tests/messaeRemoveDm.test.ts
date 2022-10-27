import * as h from './test.helper';

// Setup
let tokenGlobalOwner: string;
let token1 : string;
let token2: string;
let uIdGlobal: number;
let uId1: number;
let uId2: number;
let tmp: any;
let mId1: number;
let mId2: number;
let mId3: number;
let mId4: number;
beforeEach(() => {
  // tokens 0,1 and 2
  tmp = h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });
  uIdGlobal = tmp.authUserId;
  tokenGlobalOwner = tmp.token;

  tmp = h.postRequest(h.REGISTER_URL, {
    email: h.email1,
    password: h.password1,
    nameFirst: h.firstName1,
    nameLast: h.lastName1,
  });
  uId1 = tmp.authUserId;
  token1 = tmp.token;

  tmp = h.postRequest(h.REGISTER_URL, {
    email: h.email2,
    password: h.password2,
    nameFirst: h.firstName2,
    nameLast: h.lastName2,
  });
  uId2 = tmp.authUserId;
  token2 = tmp.token;

  // Channels 0 and private
  tmp = h.postRequest(h.DM_CREATE_URL, {
    token: tokenGlobalOwner,
    uIds: [uId1, uId2]
  });
  const dmId0 = parseInt(tmp.dmId);

  tmp = h.postRequest(h.DM_CREATE_URL, {
    token: token1,
    uIds: [uIdGlobal]
  });
  const dmId1 = parseInt(tmp.dmId);

  tmp = h.postRequest(h.MSG_SEND_DM_URL, {
    token: tokenGlobalOwner,
    dmId: dmId0,
    message: 'First message channel 0 by global owner'
  });
  tmp = h.postRequest(h.MSG_SEND_DM_URL, {
    token: token1,
    dmId: dmId0,
    message: 'Second message channel 0 by user 1'
  });
  mId1 = parseInt(tmp.messageId);
  tmp = h.postRequest(h.MSG_SEND_DM_URL, {
    token: token2,
    dmId: dmId0,
    message: 'Third message channel 0 by user 2'
  });
  mId2 = parseInt(tmp.messageId);
  tmp = h.postRequest(h.MSG_SEND_DM_URL, {
    token: token1,
    dmId: dmId1,
    message: 'First message channel 1 by owner user 1'
  });
  mId3 = parseInt(tmp.messageId);
  tmp = h.postRequest(h.MSG_SEND_DM_URL, {
    token: tokenGlobalOwner,
    dmId: dmId1,
    message: 'Second message channel 1 by global owner who is a channel member only'
  });
  mId4 = parseInt(tmp.messageId);
});
// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------///
describe('Error Handling', () => {
  test('User is not part of the DM that the message was posted in', () => {
    const data = h.deleteRequest(h.MSG_RMV_URL, {
      token: token2,
      messageId: mId4,
    });
    expect(data).toStrictEqual({ error: 'Invalid message Id' });
  });
  test('Member try to delete message they didnt post', () => {
    const data = h.deleteRequest(h.MSG_RMV_URL, {
      token: token2,
      messageId: mId1,
    });
    expect(data).toStrictEqual({ error: 'Token doesnt have permission' });
  });
  test('Global owner who didnt create dm try to delete message they didnt create', () => {
    const data = h.deleteRequest(h.MSG_RMV_URL, {
      token: tokenGlobalOwner,
      messageId: mId3,
    });
    expect(data).toStrictEqual({ error: 'Token doesnt have permission' });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Member deletes own message', () => {
    const data = h.deleteRequest(h.MSG_RMV_URL, {
      token: token2,
      messageId: mId2,
    });
    expect(data).toStrictEqual({});
  });
  test('Owner deletes own message', () => {
    const data = h.deleteRequest(h.MSG_RMV_URL, {
      token: token1,
      messageId: mId3,
    });
    expect(data).toStrictEqual({});
  });
  test('Owner deletes members message', () => {
    const data = h.deleteRequest(h.MSG_RMV_URL, {
      token: token1,
      messageId: mId4,
    });
    expect(data).toStrictEqual({});
  });
});
