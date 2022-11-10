import * as h from './test.helper';
h.deleteRequest(h.CLEAR_URL, {});

// Setup
let token0: string;
let token1 : string;
let uId0: number;
let uId1: number;
let uId2: number;
let tmp: any;
let dmId0: number;
let dmId1: number;
let invalidDmId: number;
beforeEach(() => {
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  uId0 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;
  uId1 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
  uId2 = parseInt(tmp.authUserId);

  tmp = h.postRequest(h.DM_CREATE_URL, { uIds: [uId1, uId2] }, token0);
  dmId0 = parseInt(tmp.dmId);
  tmp = h.postRequest(h.DM_CREATE_URL, { uIds: [uId0] }, token1);
  dmId1 = parseInt(tmp.dmId);
  invalidDmId = dmId0 + dmId1 + 10;
});
// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid DM', () => {
    const data = { dmId: invalidDmId };
    h.testErrorThrown(h.DM_RMV_URL, 'DELETE', 400, data, token1);
  });
  test('Invalid token', () => {
    const data = { dmId: dmId0};
    h.testErrorThrown(h.DM_RMV_URL, 'DELETE', 403, data, h.invalidToken);
  });
  test('Token is not the owner of DM', () => {
    const data = { dmId: dmId0 };
    h.testErrorThrown(h.DM_RMV_URL, 'DELETE', 403, data, token1);
  });
  test('Token is not the owner of DM', () => {
    const data = { dmId: dmId0 };
    h.testErrorThrown(h.DM_RMV_URL, 'DELETE', 403, data, token1);
  });

  test('Token is former owner', () => {
    h.postRequest(h.DM_LEAVE_URL, {
      dmId: dmId1,
    }, token1);
    const data = {dmId: dmId1};
    h.testErrorThrown(h.DM_RMV_URL, 'DELETE', 403, data, token1);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Remove Dm', () => {
    const data: any = h.deleteRequest(h.DM_RMV_URL, {
      dmId: dmId1,
    }, token1);
    expect(data).toStrictEqual({});
  });
});
