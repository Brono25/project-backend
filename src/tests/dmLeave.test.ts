
import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup: Create 3 users.
let uId0: number;
let uId1: number;
let uId2: number;
let token0: string;
let token1: string;
let invalidDmId: number;
let dmId0: number;
let dmId1: number;

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
  // create a dm (members: user0, user1, user2)
  tmp = h.postRequest(h.DM_CREATE_URL, { uIds: [uId1, uId2] }, token0);
  dmId0 = parseInt(tmp.dmId);
  tmp = h.postRequest(h.DM_CREATE_URL, { uIds: [] }, token0);
  dmId1 = parseInt(tmp.dmId);
  invalidDmId = dmId0 + dmId1 + 10;
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid dmId', () => {
    const data = {
      dmId: invalidDmId,
    };
    h.testErrorThrown(h.DM_LEAVE_URL, 'POST', 400, data, token0);
  });
  test('Token owner is not a member of the dm', () => {
    const data = {dmId: dmId1};
    h.testErrorThrown(h.DM_LEAVE_URL, 'POST', 403, data, token1);
  });
  test('Invalid Token', () => {
    const data = { dmId: dmId1};
    h.testErrorThrown(h.DM_LEAVE_URL, 'POST', 403, data, h.invalidToken);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('the user is removed as a member of this DM.', () => {
    let data: any = h.postRequest(h.DM_LEAVE_URL, {
      dmId: dmId0,
    }, token0);
    expect(data).toStrictEqual({});
    data = h.getRequest(h.DM_DETAILS_URL, {
      dmId: dmId0,
    }, token1);
    expect(data.members.some((a: any) => a.uId === uId0)).toStrictEqual(false);
  });
});
