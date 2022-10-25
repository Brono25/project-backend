import * as h from './test.helper';

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
    const data = h.putRequest(h.USER_PROF_SET_NAME_URL, {
      token: 'invalidToken',
      nameFirst: h.firstName0,
      nameLast: h.lastName0,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Invalid first name', () => {
    const data = h.putRequest(h.USER_PROF_SET_NAME_URL, {
      token: authUserToken0,
      nameFirst: h.invalidLongFirstName,
      nameLast: h.lastName0,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid last name', () => {
    const data = h.putRequest(h.USER_PROF_SET_NAME_URL, {
      token: authUserToken0,
      nameFirst: h.firstName0,
      nameLast: h.invalidLongLastName,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Change name for user0', () => {
    let data: any = h.putRequest(h.USER_PROF_SET_NAME_URL, {
      token: authUserToken0,
      nameFirst: 'New First Name 0',
      nameLast: 'New Last Name 0',
    });
    expect(data).toStrictEqual({});
    data = h.getRequest(h.USER_ALL_URL, {
      token: authUserToken0,
    });
    expect(data.users[0].nameFirst).toStrictEqual('New First Name 0');
    expect(data.users[0].nameLast).toStrictEqual('New Last Name 0');
  });

  test('Change name for user2', () => {
    let data: any = h.putRequest(h.USER_PROF_SET_NAME_URL, {
      token: authUserToken2,
      nameFirst: 'New First Name 2',
      nameLast: 'New Last Name 2',
    });
    expect(data).toStrictEqual({});
    data = h.getRequest(h.USER_ALL_URL, {
      token: authUserToken2,
    });
    expect(data.users[2].nameFirst).toStrictEqual('New First Name 2');
    expect(data.users[2].nameLast).toStrictEqual('New Last Name 2');
  });
});
