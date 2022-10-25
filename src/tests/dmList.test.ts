import * as h from './test.helper';
import { dmDetailsV1 } from './dm.ts';

// SETUP
let uId0: number;
let uId1: number;
let uId2: number;
let token0: string;
let token1: string;
let token2: string;
let invalidToken: string;
let dm0: any;
let dm1: any;
let dm2: any;
let input: any;
let invalidInput: any;
let dms: any;
beforeEach(() => {
    input = null;
    invalidInput = null;
    dms = [];
    // Create users 0, 1, 2
    let user0: any = h.postRequest(h.REGISTER_URL, {
        email: h.email0,
        password: h.password0,
        nameFirst: h.firstName0,
        nameLast: h.lastName0,
    });
    token0 = user0.token;
    uId0 = parseInt(user0.authUserId);
    let user1: any = h.postRequest(h.REGISTER_URL, {
        email: h.email1,
        password: h.password1,
        nameFirst: h.firstName1,
        nameLast: h.lastName1,
    });
    token1 = user1.token;
    uId1 = parseInt(user1.authUserId);
    let user2: any = h.postRequest(h.REGISTER_URL, {
        email: h.email2,
        password: h.password2,
        nameFirst: h.firstName2,
        nameLast: h.lastName2,
    });
    token2 = user2.token;
    uId2 = parseInt(user2.authUserId);
    // Create DMs
    dm0 = h.postRequest(h.DM_CREATE_URL, {
        token: token0,
        uIds: [uId1, uId2],
    });
    dmId0 = parseInt(dm0.dmId);
    dm1 = h.postRequest(h.DM_CREATE_URL, {
        token: token1,
        uIds: [uId0],
    });
    dmId1 = parseInt(dm1.dmId);
    dm2 = h.postRequest(h.DM_CREATE_URL, {
        token: token0,
        uIds: [],
    });
    dmId2 = parseInt(dm2.dmId);
    dm3 = h.postRequest(h.DM_CREATE_URL, {
        token: token2,
        uIds: [],
    });
    dmId3 = parseInt(dm3.dmId);
    // Error cases
    invalidToken = h.invalidToken;
});

// TEARDOWN
afterEach(() => {
    h.deleteRequest(h.CLEAR_URL, {});
});
  
// ------------------Error Testing------------------//

describe('Error Handling', () => {
    test('Invalid Token', () => {
        invalidInput = h.postRequest(h.DM_LIST_URL, {
            token: h.invalidToken,
        });
        expect(invalidInput).toStrictEqual({ error: 'error: Invalid Token' });
    });
});
  
  // ------------------Function Testing------------------//
  
describe('Function Testing', () => {
    test('For a user for multiple DMs', () => {
        input = h.getRequest(h.DM_LIST_URL, {
            token: token0,
        });
        expect(input).toStrictEqual( 
            dms = [
                {dmId: dmId0, name: expect.any(String)},
                {dmId: dmId1, name: expect.any(String)},
                {dmId: dmId2, name: expect.any(String)},
            ]
        );
    });
    test('For a DM with no members', () => {
        input = h.getRequest(h.DM_LIST_URL, {
            token: token2,
        });
        expect(input).toStrictEqual(
            dms = [
                {dmId: dmId3, name: expect.any(String)},
            ]
        );
    });
});
  
  