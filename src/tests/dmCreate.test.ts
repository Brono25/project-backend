import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup: Create 3 users.
let uId0: number;
let uId1: number;
let uId2: number;
let invalidUid: number;
let token0: string;
let token1: string;
let token2: string;
let tmp: any;
beforeEach(() => {
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  uId0 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;
  uId1 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
  token2 = tmp.token;
  uId2 = parseInt(tmp.authUserId);
  invalidUid = Math.abs(uId0) + Math.abs(uId1) + Math.abs(uId2) + 10;
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Atleast one invalid Uid', () => {
    const data = {
      uIds: [uId1, uId2, invalidUid],
    };
    h.testErrorThrown(h.DM_CREATE_URL, 'POST', 400, data, token0);
  });
  test('Duplicate User IDs in uIds', () => {
    const data = {
      uIds: [uId1, uId2, uId1],
    };
    h.testErrorThrown(h.DM_CREATE_URL, 'POST', 400, data, token1);
  });
  test('Creator among uIds', () => {
    const data = {
      uIds: [uId1, uId2, uId0],
    };
    h.testErrorThrown(h.DM_CREATE_URL, 'POST', 400, data, token2);
  });
  test('Invalid Token', () => {
    const data = {
      uIds: [uId1, uId2],
    };
    h.testErrorThrown(h.DM_CREATE_URL, 'POST', 403, data, h.invalidToken);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Create DM with two other users', () => {
    const data = h.postRequest(h.DM_CREATE_URL, {
      uIds: [uId1, uId2],
    }, token0);
    expect(data).toStrictEqual({ dmId: expect.any(Number) });
  });
  test('Create DM with only creator', () => {
    const data = h.postRequest(h.DM_CREATE_URL, {
      uIds: [],
    }, token0);
    expect(data).toStrictEqual({ dmId: expect.any(Number) });
  });
  test('Create 100 dms and get 100 unique ID\'s', () => {
    const numberOfDms = 100;
    const dmIdList = new Set();
    for (let n = 0; n < numberOfDms; n++) {
      const data = h.postRequest(h.DM_CREATE_URL, {
        uIds: [uId1, uId2],
      }, token0);
      dmIdList.add(data);
    }
    expect(dmIdList.size === numberOfDms).toStrictEqual(true);
  });
});
