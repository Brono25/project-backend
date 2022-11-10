import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup: Create 3 users.
let authUser0: any;
let authUser2: any;
let authUserToken0: string;
let authUserToken2: string;
beforeEach(() => {
  authUser0 = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  authUserToken0 = authUser0.token;
  h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  authUser2 = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
  authUserToken2 = authUser2.token;
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid token', () => {
    h.testErrorThrown(h.LOGOUT_URL, 'POST', 403, undefined, h.invalidToken);
  });
});
// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Authorise logout for first user in database', () => {
    const data = h.postRequest(h.LOGOUT_URL, {}, authUserToken0);
    expect(data).toStrictEqual({});
  });

  test('Authorise logout for last user in database', () => {
    const data = h.postRequest(h.LOGOUT_URL, {}, authUserToken2);
    expect(data).toStrictEqual({});
  });
});
