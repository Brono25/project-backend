
//import {ChannelJoinReturn} from '../data.types';
import * as h from './test.helper';

import { clearV1 } from '../other';
clearV1();

// Setup

let channelId0: any;
let channelIdPriv: any;

let token0: string;
let token1 : string;
let token2 : string;

let invalidChannelId: any;

beforeEach(() => {
  //tokens 0,1 and 2
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

  const tmp2: any = h.postRequest(h.REGISTER_URL, {
    email: h.email2,
    password: h.password2,
    nameFirst: h.firstName2,
    nameLast: h.lastName2,
  });
  token2 = tmp2.token;


//error inputs
invalidChannelId = Math.abs(channelId0) + 10;
});

// Channels 0 and private
channelId0 = h.postRequest(h.CHAN_CREATE_URL, {
  token: token0,
  name: h.channelName0,
  isPublic: h.isPublic,
});
channelId0 = parseInt(channelId0.channelId);

channelIdPriv = h.postRequest(h.CHAN_CREATE_URL, {
  token: token1,
  name: h.channelName1,
  isPublic: h.isNotPublic,
});
channelIdPriv = parseInt(channelIdPriv.channelId);

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//
describe('Error Handling', () => {
  test('Invalid Channel ID', () => {
    const data = h.postRequest(h.CHAN_JOIN_URL,{
      token: token0,
      channelId: invalidChannelId,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test('User already member of channel', () => {
    const data = h.postRequest(h.CHAN_JOIN_URL, {
      token: token0,
      channelId: channelId0,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test('Private channelId', () => {
    const data = h.postRequest(h.CHAN_JOIN_URL, {
      token: token2,
      channelId: channelIdPriv,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid token', () => {
    const data = h.postRequest(h.CHAN_JOIN_URL, {
      token: 'invalidToken',
      channelId : channelId0,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

});

// ------------------Function Testing------------------//
describe('Function Testing', () => {
  test('adds a global member to the channel', () => {
    const data = h.postRequest(h.CHAN_JOIN_URL, {
      token: token2,
      channelId: channelId0,
    });
    expect(data).toStrictEqual({});
  });
  
  test('adds a global owner to the channel', () => {
    const data = h.postRequest(h.CHAN_JOIN_URL, {
      token: token0,
      channelId: channelIdPriv,
    });
    expect(data).toStrictEqual({});
  });

  //Todo: test with channel details 

});
