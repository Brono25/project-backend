import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup: Create 3 users.

let token0: string;
let token2: string;
let uId0: number;
let uId1: number;
let uId2: number;
let tmp: any;
beforeEach(() => {
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  uId0 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  uId1 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
  token2 = tmp.token;
  uId2 = parseInt(tmp.authUserId);
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Incorrect token', () => {
    h.testErrorThrown(h.USER_ALL_URL, 'GET', 403, undefined, h.invalidToken);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('List all three users using token of user0', () => {
    const data = h.getRequest(h.USER_ALL_URL, undefined, token0);
    expect(data).toStrictEqual({
      users: [
        {
          uId: uId0,
          email: h.email0,
          nameFirst: h.firstName0,
          nameLast: h.lastName0,
          handleStr: expect.any(String),
        },
        {
          uId: uId1,
          email: h.email1,
          nameFirst: h.firstName1,
          nameLast: h.lastName1,
          handleStr: expect.any(String),
        },
        {
          uId: uId2,
          email: h.email2,
          nameFirst: h.firstName2,
          nameLast: h.lastName2,
          handleStr: expect.any(String),
        }
      ]
    });
  });

  test('List all three users using token of user2', () => {
    const data = h.getRequest(h.USER_ALL_URL, undefined, token2);
    expect(data).toStrictEqual({
      users: [
        {
          uId: uId0,
          email: h.email0,
          nameFirst: h.firstName0,
          nameLast: h.lastName0,
          handleStr: expect.any(String),
        },
        {
          uId: uId1,
          email: h.email1,
          nameFirst: h.firstName1,
          nameLast: h.lastName1,
          handleStr: expect.any(String),
        },
        {
          uId: uId2,
          email: h.email2,
          nameFirst: h.firstName2,
          nameLast: h.lastName2,
          handleStr: expect.any(String),
        }
      ]
    });
  });
});
