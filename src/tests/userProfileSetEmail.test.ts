import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup: Create 3 users.
let authUser0: any;
let authUser2: any;
let token0: string;
let token2: string;

beforeEach(() => {
  authUser0 = h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });

  authUser2 = h.postRequest(h.REGISTER_URL, {
    email: h.email2,
    password: h.password2,
    nameFirst: h.firstName2,
    nameLast: h.lastName2,
  });

  token0 = authUser0.token;
  token2 = authUser2.token;
});
// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid email', () => {
    const data = h.putRequest(h.USER_PROF_SET_EMAIL_URL, {
      token: token2,
      email: h.invalidEmail,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Email address already in use', () => {
    const data = h.putRequest(h.USER_PROF_SET_EMAIL_URL, {
      token: token0,
      email: h.email2,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Attempt to assign uppercase email when lower case email is already taken', () => {
    const data = h.putRequest(h.USER_PROF_SET_EMAIL_URL, {
      token: token0,
      email: h.email0AltCase,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid token', () => {
    const data = h.putRequest(h.USER_PROF_SET_EMAIL_URL, {
      token: h.invalidToken,
      email: h.email0,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('change email', () => {
    let data: any = h.putRequest(h.USER_PROF_SET_EMAIL_URL, {
      token: token0,
      email: 'email_new_@gmail.com',
    });
    expect(data).toStrictEqual({});
    data = h.getRequest(h.USER_ALL_URL, {
      token: token0,
    });
    expect(data.users[0].email).toStrictEqual('email_new_@gmail.com');
  });
});
