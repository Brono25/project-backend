import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup
let token0: string;
let token1: string;
let uId0: number;
let uId1: number;
let uId2: number;
let invalidUId: number;

let tmp: any;

beforeEach(() => {
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  uId0 = parseInt(tmp.authUserId);

  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;
  uId1 = parseInt(tmp.authUserId);

  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
  uId2 = parseInt(tmp.authUserId);

  invalidUId = Math.abs(uId1 + uId2 + 10);
});
// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------///
describe('Error Handling', () => {
  test('Invalid token', () => {
    const data = {
      uId: uId1,
      permissionId: 1,
    };
    h.testErrorThrown(h.ADMIN_USER_PERM_CHANGE, 'POST', 403, data, h.invalidToken);
  });

  test('Invalid uId', () => {
    const data = {
      uId: invalidUId,
      permissionId: 1,
    };
    h.testErrorThrown(h.ADMIN_USER_PERM_CHANGE, 'POST', 400, data, token0);
  });

  test('uId refers to a user who is the only global owner and they are being demoted to a user', () => {
    const data = {
      uId: uId0,
      permissionId: 2,
    };
    h.testErrorThrown(h.ADMIN_USER_PERM_CHANGE, 'POST', 400, data, token0);
  });

  test('invalid permissionId (not numeric)', () => {
    const data = {
      uId: uId1,
      permissionId: 'a',
    };
    h.testErrorThrown(h.ADMIN_USER_PERM_CHANGE, 'POST', 400, data, token0);
  });

  test('invalid permissionId (numeric but neither 1 or 2)', () => {
    const data = {
      uId: uId1,
      permissionId: 22,
    };
    h.testErrorThrown(h.ADMIN_USER_PERM_CHANGE, 'POST', 400, data, token0);
  });

  test('the user already has the permissions level of permissionId', () => {
    const data = {
      uId: uId1,
      permissionId: 2,
    };
    h.testErrorThrown(h.ADMIN_USER_PERM_CHANGE, 'POST', 400, data, token0);
  });

  test('the authorised user is not a global owner', () => {
    const data = {
      uId: uId0,
      permissionId: 2,
    };
    h.testErrorThrown(h.ADMIN_USER_PERM_CHANGE, 'POST', 403, data, token1);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('change permission of a member to owner', () => {
    const a: any = h.postRequest(h.ADMIN_USER_PERM_CHANGE, {
      uId: uId1,
      permissionId: 1,
    }, token0);
    expect(a).toStrictEqual({});
    const b: any = h.postRequest(h.ADMIN_USER_PERM_CHANGE, {
      uId: uId2,
      permissionId: 1,
    }, token0);
    expect(b).toStrictEqual({});
  });

  test('change permission of an owner to member', () => {
    const a: any = h.postRequest(h.ADMIN_USER_PERM_CHANGE, {
      uId: uId1,
      permissionId: 1,
    }, token0);
    expect(a).toStrictEqual({});
    const b: any = h.postRequest(h.ADMIN_USER_PERM_CHANGE, {
      uId: uId0,
      permissionId: 2,
    }, token1);
    expect(b).toStrictEqual({});
  });
});
