import * as h from './test.helper';
h.deleteRequest(h.CLEAR_URL, {});

// Setup: Create 3 users.
let authUser0: any;
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
  h.postRequest(h.REGISTER_URL, {
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
    const data = h.postRequest(h.LOGOUT_URL, {
      token: 'invalidToken',
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});
// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Authorise logout for first user in database', () => {
    const data = h.postRequest(h.LOGOUT_URL, {
      token: authUserToken0,
    });
    expect(data).toStrictEqual({});
  });

  test('Authorise logout for last user in database', () => {
    const data = h.postRequest(h.LOGOUT_URL, {
      token: authUserToken2,
    });
    expect(data).toStrictEqual({});
  });
});
