import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

let uId0: number;
let uId1: number;
let uId2: number;
let token0: string;
let token1: string;
let dmId0: number;
let dmId1: number;
let dmId2: number;
let input: any;
let tmp: any;
// SETUP
beforeEach(() => {
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  uId0 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;
  uId1 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
  uId2 = parseInt(tmp.authUserId);
  // Create DMs
  tmp = h.postRequest(h.DM_CREATE_URL, { uIds: [uId1, uId2] }, token0);
  dmId0 = parseInt(tmp.dmId);
  tmp = h.postRequest(h.DM_CREATE_URL, { uIds: [uId0] }, token1);
  dmId1 = parseInt(tmp.dmId);
  tmp = h.postRequest(h.DM_CREATE_URL, { uIds: [] }, token0);
  dmId2 = parseInt(tmp.dmId);
});

// TEARDOWN
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid Token', () => {
    h.testErrorThrown(h.DM_LIST_URL, 'GET', 403, undefined, h.invalidToken);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('For an owner or member of multiple DMs', () => {
    input = h.getRequest(h.DM_LIST_URL, undefined, token0);
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
