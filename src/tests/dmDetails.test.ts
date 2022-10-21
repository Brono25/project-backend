import * as h from './test.helper';

// Setup: Create 3 users.
let authUser0: any;
let authUser1: any;
let authUser2: any;
let authUserId0: number;
let authUserId1: number;
let authUserId2: number;
let authUserToken0: string;
let authUserToken1: string;
let authUserToken2: string;
let dm1: any;
let dm2: any;
let dmId1: number;
let dmId2: number;
let invalidDmId: number;
beforeEach(() => {
  authUser0 = h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });
  authUserId0 = parseInt(authUser0.authUserId);
  authUserToken0 = authUser0.token;
  authUser1 = h.postRequest(h.REGISTER_URL, {
    email: h.email1,
    password: h.password1,
    nameFirst: h.firstName1,
    nameLast: h.lastName1,
  });
  authUserId1 = parseInt(authUser1.authUserId);
  authUserToken1 = authUser1.token;
  authUser2 = h.postRequest(h.REGISTER_URL, {
    email: h.email2,
    password: h.password2,
    nameFirst: h.firstName2,
    nameLast: h.lastName2,
  });
  authUserToken2 = authUser2.token;
  authUserId2 = parseInt(authUser2.authUserId);
  // create a dm (members: user0, user1, user2)
  dm1 = h.postRequest(h.DM_CREATE_URL, {
    token: authUserToken0,
    uIds: [authUserId1, authUserId2],
  });
  dmId1 = parseInt(dm1.dmId);

  // create a dm with only one creator (members: user0)
  dm2 = h.postRequest(h.DM_CREATE_URL, {
    token: authUserToken0,
    uIds: [],
  });
  dmId2 = parseInt(dm2.dmId);

  invalidDmId = Math.abs(dmId1) + Math.abs(dmId2) + 10;
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid dmId', () => {
    let data = h.getRequest(h.DM_DETAILS__URL, {
      token: authUserToken0,
      dmId: invalidDmId,
    });
    expect(data).toStrictEqual({ error: 'Invalid dmId' });
  });
  test('Token owner is not a member of the dm', () => {
    let data = h.getRequest(h.DM_DETAILS__URL, {
      token: authUserToken1,
      dmId: dmId2,
    });
    expect(data).toStrictEqual({ error: 'Token owner is not a member of the dm' });
  });
  test('Invalid Token', () => {
    let data = h.getRequest(h.DM_DETAILS__URL, {
      token: h.invalidToken,
      dmId: dmId2,
    });
    expect(data).toStrictEqual({ error: 'Invalid Token' });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Details of dm1', () => {
    let data = h.getRequest(h.DM_DETAILS__URL, {
      token: authUserToken0,
      dmId: dmId1,
    });
    expect(data).toStrictEqual({
      name: expect.any(String),
      members: [authUserId0, authUserId1, authUserId2],
    });
  });
});
