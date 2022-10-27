import * as h from './test.helper';
import {
  dmCreateV1,
} from '../dm';

h.deleteRequest(h.CLEAR_URL, {});

let uId0: number;
let uId1: number;
let uId2: number;
let token0: string;
let token1: string;
let dm0: any;
let dm1: any;
let dm2: any;
let dmId0: number;
let dmId1: number;
let dmId2: number;
let input: any;
let invalidInput: any;
// SETUP
beforeEach(() => {
  // Create users 0, 1, 2
  const user0: any = h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });
  token0 = user0.token;
  uId0 = parseInt(user0.authUserId);
  const user1: any = h.postRequest(h.REGISTER_URL, {
    email: h.email1,
    password: h.password1,
    nameFirst: h.firstName1,
    nameLast: h.lastName1,
  });
  token1 = user1.token;
  uId1 = parseInt(user1.authUserId);
  const user2: any = h.postRequest(h.REGISTER_URL, {
    email: h.email2,
    password: h.password2,
    nameFirst: h.firstName2,
    nameLast: h.lastName2,
  });
  uId2 = parseInt(user2.authUserId);
  // Create DMs
  dm0 = dmCreateV1(token0, [uId1, uId2]);
  dmId0 = parseInt(dm0.dmId);
  dm1 = dmCreateV1(token1, [uId0]);
  dmId1 = parseInt(dm1.dmId);
  dm2 = dmCreateV1(token0, []);
  dmId2 = parseInt(dm2.dmId);
});

// TEARDOWN
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid Token', () => {
    invalidInput = h.getRequest(h.DM_LIST_URL, {
      token: h.invalidToken,
    });
    expect(invalidInput).toStrictEqual({ error: 'Invalid Token' });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('For an owner or member of multiple DMs', () => {
    input = h.getRequest(h.DM_LIST_URL, {
      token: token0,
    });
    expect(input).toStrictEqual(
      {
        dms: [
          { dmId: dmId0, name: expect.any(String) },
          { dmId: dmId1, name: expect.any(String) },
          { dmId: dmId2, name: expect.any(String) },
        ]
      }
    );
  });
});
