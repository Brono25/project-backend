import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup: Create 3 users.
let token0: string;
let token1 : string;
let uId0: number;
let uId1: number;
let uId2: number;
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
    const data = {dmId: invalidDmId};
    h.testErrorThrown(h.DM_DETAILS_URL, 'GET', 400, data, token0);
  });
  test('Token owner is not a member of the dm', () => {
    const data = {dmId: dmId1 };
    h.testErrorThrown(h.DM_DETAILS_URL, 'GET', 403, data, token1);
  });
  test('Invalid Token', () => {
    const data = { dmId: dmId1 };
    h.testErrorThrown(h.DM_DETAILS_URL, 'GET', 403, data, h.invalidToken);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Details of dm1', () => {
    const data = h.getRequest(h.DM_DETAILS_URL, {
      dmId: dmId0,
    }, token0);
    expect(data).toStrictEqual({
      name: expect.any(String),
      members: [
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
        },
      ],
    });
  });
});
