import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup: Create 3 users.
let authUser0: any;
let authUser1: any;
let authUser2: any;
let authUserToken0: string;
let authUserToken2: string;
beforeEach(() => {
  authUser0 = h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });
  authUserToken0 = authUser0.token;
  authUser1 = h.postRequest(h.REGISTER_URL, {
    email: h.email1,
    password: h.password1,
    nameFirst: h.firstName1,
    nameLast: h.lastName1,
  });
  authUser2 = h.postRequest(h.REGISTER_URL, {
    email: h.email2,
    password: h.password2,
    nameFirst: h.firstName2,
    nameLast: h.lastName2,
  });
  authUserToken2 = authUser2.token;
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Incorrect token', () => {
    const data = h.getRequest(h.USER_ALL_URL, {
      token: 'invalidToken',
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('List all three users using token of user0', () => {
    const data = h.getRequest(h.USER_ALL_URL, {
      token: authUserToken0,
    });
    expect(data).toStrictEqual({
      users: [
        {
          uId: authUser0.authUserId,
          email: h.email0,
          nameFirst: h.firstName0,
          nameLast: h.lastName0,
          handleStr: expect.any(String),
        },
        {
          uId: authUser1.authUserId,
          email: h.email1,
          nameFirst: h.firstName1,
          nameLast: h.lastName1,
          handleStr: expect.any(String),
        },
        {
          uId: authUser2.authUserId,
          email: h.email2,
          nameFirst: h.firstName2,
          nameLast: h.lastName2,
          handleStr: expect.any(String),
        }
      ]
    });
  });

  test('List all three users using token of user2', () => {
    const data = h.getRequest(h.USER_ALL_URL, {
      token: authUserToken2,
    });
    expect(data).toStrictEqual({
      users: [
        {
          uId: authUser0.authUserId,
          email: h.email0,
          nameFirst: h.firstName0,
          nameLast: h.lastName0,
          handleStr: expect.any(String),
        },
        {
          uId: authUser1.authUserId,
          email: h.email1,
          nameFirst: h.firstName1,
          nameLast: h.lastName1,
          handleStr: expect.any(String),
        },
        {
          uId: authUser2.authUserId,
          email: h.email2,
          nameFirst: h.firstName2,
          nameLast: h.lastName2,
          handleStr: expect.any(String),
        }
      ]
    });
  });
});
