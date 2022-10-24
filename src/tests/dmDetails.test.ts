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
let dm1: any;
let dm2: any;
let dmId1: number;
let dmId2: number;
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
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid dmId', () => {
    const data = h.getRequest(h.DM_DETAILS__URL, {
      token: authUserToken0,
      dmId: 0,
    });
    expect(data).toStrictEqual({ error: 'Invalid dmId' });
  });
  test('Token owner is not a member of the dm', () => {
    const data = h.getRequest(h.DM_DETAILS__URL, {
      token: authUserToken1,
      dmId: dmId2,
    });
    expect(data).toStrictEqual({ error: 'Token owner is not a member of the dm' });
  });
  test('Invalid Token', () => {
    const data = h.getRequest(h.DM_DETAILS__URL, {
      token: h.invalidToken,
      dmId: dmId2,
    });
    expect(data).toStrictEqual({ error: 'Invalid token' });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Details of dm1', () => {
    const data = h.getRequest(h.DM_DETAILS__URL, {
      token: authUserToken0,
      dmId: dmId1,
    });
    expect(data).toStrictEqual({
      name: expect.any(String),
      members: [
        {
          uId: authUserId0,
          email: h.email0,
          nameFirst: h.firstName0,
          nameLast: h.lastName0,
          handleStr: expect.any(String),
        },
        {
          uId: authUserId1,
          email: h.email1,
          nameFirst: h.firstName1,
          nameLast: h.lastName1,
          handleStr: expect.any(String),
        },
        {
          uId: authUserId2,
          email: h.email2,
          nameFirst: h.firstName2,
          nameLast: h.lastName2,
          handleStr: expect.any(String),
        },
      ],
    });
  });
});
