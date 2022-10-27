import * as h from './test.helper';
h.deleteRequest(h.CLEAR_URL, {});

// Setup
let tokenGlobalOwner: string;
let token1 : string;
let uIdGlobal: number;
let uId1: number;
let uId2: number;
let tmp: any;
let dmId0: number;
let dmId1: number;
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

  // Channels 0 and private
  tmp = h.postRequest(h.DM_CREATE_URL, {
    token: tokenGlobalOwner,
    uIds: [uId1, uId2]
  });
  dmId0 = parseInt(tmp.dmId);

  tmp = h.postRequest(h.DM_CREATE_URL, {
    token: token1,
    uIds: [uIdGlobal]
  });
  dmId1 = parseInt(tmp.dmId);
});
// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid DM', () => {
    const data = h.deleteRequest(h.DM_RMV_URL, {
      token: token1,
      dmId: -1,
    });
    expect(data).toStrictEqual({ error: 'Invalid dmId' });
  });
  test('Invalid token', () => {
    const data = h.deleteRequest(h.DM_RMV_URL, {
      token: h.invalidToken,
      dmId: dmId0,
    });
    expect(data).toStrictEqual({ error: 'Invalid token' });
  });
  test('Token is not the owner of DM', () => {
    const data = h.deleteRequest(h.DM_RMV_URL, {
      token: token1,
      dmId: dmId0,
    });
    expect(data).toStrictEqual({ error: 'Token is not the owner' });
  });
  test('Token is not the owner of DM', () => {
    const data = h.deleteRequest(h.DM_RMV_URL, {
      token: token1,
      dmId: dmId0,
    });
    expect(data).toStrictEqual({ error: 'Token is not the owner' });
  });

  test('Token is former owner', () => {
    h.postRequest(h.DM_LEAVE_URL, {
      token: token1,
      dmId: dmId1,
    });
    const data = h.deleteRequest(h.DM_RMV_URL, {
      token: token1,
      dmId: dmId1,
    });
    expect(data).toStrictEqual({ error: 'Token is not a member' });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Remove Dm', () => {
    const data = h.deleteRequest(h.DM_RMV_URL, {
      token: token1,
      dmId: dmId1,
    });
    expect(data).toStrictEqual({});
  });
});
