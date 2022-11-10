import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup: Create 3 users.

let token0: string;
let token2: string;
let tmp: any;
beforeEach(() => {
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
  token2 = tmp.token;
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Incorrect token', () => {
    const data = {
      nameFirst: h.firstName0,
      nameLast: h.lastName0,
    };
    h.testErrorThrown(h.USER_PROF_SET_NAME_URL, 'PUT', 403, data, h.invalidToken);
  });
  test('Invalid first name', () => {
    const data = {
      nameFirst: h.invalidLongFirstName,
      nameLast: h.lastName0,
    };
    h.testErrorThrown(h.USER_PROF_SET_NAME_URL, 'PUT', 400, data, token0);
  });

  test('Invalid last name', () => {
    const data = {
      nameFirst: h.firstName0,
      nameLast: h.invalidLongLastName,
    };
    h.testErrorThrown(h.USER_PROF_SET_NAME_URL, 'PUT', 400, data, token0);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Change name for user0', () => {
    let data: any = h.putRequest(h.USER_PROF_SET_NAME_URL, {
      nameFirst: 'New First Name 0',
      nameLast: 'New Last Name 0',
    }, token0);
    expect(data).toStrictEqual({});
    data = h.getRequest(h.USER_ALL_URL, undefined, token0);
    expect(data.users[0].nameFirst).toStrictEqual('New First Name 0');
    expect(data.users[0].nameLast).toStrictEqual('New Last Name 0');
  });

  test('Change name for user2', () => {
    let data: any = h.putRequest(h.USER_PROF_SET_NAME_URL, {
      nameFirst: 'New First Name 2',
      nameLast: 'New Last Name 2',
    }, token2);
    expect(data).toStrictEqual({});
    data = h.getRequest(h.USER_ALL_URL, undefined, token2);
    expect(data.users[2].nameFirst).toStrictEqual('New First Name 2');
    expect(data.users[2].nameLast).toStrictEqual('New Last Name 2');
  });
});
