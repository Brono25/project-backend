import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup: Create 3 users.

let token0: string;
let token1: string;
let tmp: any;
beforeEach(() => {
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;
});
// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid email', () => {
    const data = { email: h.invalidEmail };
    h.testErrorThrown(h.USER_PROF_SET_EMAIL_URL, 'PUT', 400, data, token1);
  });
  test('Email address already in use', () => {
    const data = { email: h.email1 };
    h.testErrorThrown(h.USER_PROF_SET_EMAIL_URL, 'PUT', 400, data, token0);
  });
  test('Attempt to assign uppercase email when lower case email is already taken', () => {
    const data = { email: h.email0AltCase };
    h.testErrorThrown(h.USER_PROF_SET_EMAIL_URL, 'PUT', 400, data, token0);
  });

  test('Invalid token', () => {
    const data = { email: h.email1 };
    h.testErrorThrown(h.USER_PROF_SET_EMAIL_URL, 'PUT', 403, data, h.invalidToken);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('change email', () => {
    let data: any = h.putRequest(h.USER_PROF_SET_EMAIL_URL, {
      email: 'email_new_@gmail.com',
    }, token0);
    expect(data).toStrictEqual({});
    data = h.getRequest(h.USER_ALL_URL, undefined, token0);
    expect(data.users[0].email).toStrictEqual('email_new_@gmail.com');
  });
});
