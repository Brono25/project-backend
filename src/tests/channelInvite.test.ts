
import { clearV1 } from '../other';
import * as h from './test.helper';

// Setup
let token0: string;
let token1: string;

let channelId0: any;

let uId0: any;
let uId1: any;

let invalidChannelId: any;
let invalidUId: any;


beforeEach(() => {
  // tokens 0,1
  const tmp0: any = h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });
  token0 = tmp0.token;

  const tmp1: any = h.postRequest(h.REGISTER_URL, {
    email: h.email1,
    password: h.password1,
    nameFirst: h.firstName1,
    nameLast: h.lastName1,
  });
  token1 = tmp1.token;

  // Channel 0
  channelId0 = h.postRequest(h.CHAN_CREATE_URL, {
    token: token0,
    name: h.channelName0,
    isPublic: h.isPublic,
  });
  channelId0 = parseInt(channelId0.channelId);

  // uIds 0 and 1
  uId0 = h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });
  uId0 = parseInt(uId0.authUserId);
  
  uId1 = h.postRequest(h.REGISTER_URL, {
    email: h.email1,
    password: h.password1,
    nameFirst: h.firstName1,
    nameLast: h.lastName1,
  });
  uId1 = parseInt(uId1.authUserId);


  //error inputs
  invalidChannelId = Math.abs(channelId0) + 10;
  invalidUId = Math.abs(uId0) + 10;

});

// Tear down
afterEach(() => {
  clearV1();
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//
describe('Error Handling', () => {

  test('Invalid channel Id', () => {
    const data = h.postRequest(h.CHAN_INV_URL,{
      token: token0,
      channelId: invalidChannelId,
      uId: uId0,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });


  test('Invalid User Id', () => {
    const data = h.postRequest(h.CHAN_INV_URL,{
      token: token0,
      channelId: channelId0,
      uId: invalidUId,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test('User already member of channel', () => {
    const data = h.postRequest(h.CHAN_INV_URL,{
      token: token0,
      channelId: channelId0,
      uId: uId0,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test('authUser not a member', () => {
    const data = h.postRequest(h.CHAN_INV_URL,{
      token: token1,
      channelId: channelId0,
      uId: uId1,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid token', () => {
    const data = h.postRequest(h.CHAN_INV_URL,{
      token: 'invalid token Id',
      channelId: channelId0,
      uId: uId1,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('adds the user to the channel', () => {
    const data = h.postRequest(h.CHAN_INV_URL,{
      token: token0,
      channelId: channelId0,
      uId: uId1,
    });
    expect(data).toStrictEqual({});
  });
});

