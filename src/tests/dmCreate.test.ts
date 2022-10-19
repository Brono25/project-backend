import * as h from './test.helper';
import {
  UserId,
} from '../data.types'
import { token } from 'morgan';

// Setup: Create 3 users.
let uId0: number;
let uId1: number;
let uId2: number;
let invalidUid: number;
let token0: string;
let token1: string;
let token2: string;
beforeEach(() => {
  let tmp: any = h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });
  token0 = tmp.token;
  uId0 = tmp.uId;
  tmp = h.postRequest(h.REGISTER_URL, {
    email: h.email1,
    password: h.password1,
    nameFirst: h.firstName1,
    nameLast: h.lastName1,
  });
  token1 = tmp.token;
  uId1 = tmp.uId;
  tmp = h.postRequest(h.REGISTER_URL, {
    email: h.email2,
    password: h.password2,
    nameFirst: h.firstName2,
    nameLast: h.lastName2,
  });
  token2 = tmp.token;
  uId2 = tmp.uId;
  invalidUid = Math.abs(uId0) + Math.abs(uId1) + Math.abs(uId2) + 10;
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});




// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Atleast one invalid Uid', () => {
    const data = h.postRequest(h.DM_CREATE_URL, {
      token: token0,
      uIds: [uId1, uId2, invalidUid]
    });
    expect(data).toStrictEqual({ error: 'Invalid User ID' });
  });
  test('Duplicate User IDs in uIds', () => {
    const data = h.postRequest(h.DM_CREATE_URL, {
      token: token0,
      uIds: [uId1, uId2, uId1],
    });
    expect(data).toStrictEqual({ error: 'Duplicate uId' });
  });
   test('Duplicate User IDs in uIds', () => {
    const data = h.postRequest(h.DM_CREATE_URL, {
      token: token0,
      uIds: [uId1, uId2, uId0],
    });
    expect(data).toStrictEqual({ error: 'Cannot have creator in uIds' });
  });
  test('Invalid Token', () => {
    const data = h.postRequest(h.DM_CREATE_URL, {
      token: h.invalidToken,
      uIds: [uId1, uId2],
    });
    expect(data).toStrictEqual({ error: 'Invalid Token' });
  });
});