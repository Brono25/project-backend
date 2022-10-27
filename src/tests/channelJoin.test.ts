
// import {ChannelJoinReturn} from '../data.types';
import * as h from './test.helper';
h.deleteRequest(h.CLEAR_URL, {});

// Setup
let token0: string;
let token1 : string;
let token2 : string;

let channelId0: number;
let channelIdPriv: number;
let invalidChannelId: number;

let tmp: any;

beforeEach(() => {
  // tokens 0,1 and 2
  tmp = h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });
  token0 = tmp.token;

  tmp = h.postRequest(h.REGISTER_URL, {
    email: h.email1,
    password: h.password1,
    nameFirst: h.firstName1,
    nameLast: h.lastName1,
  });
  token1 = tmp.token;

  tmp = h.postRequest(h.REGISTER_URL, {
    email: h.email2,
    password: h.password2,
    nameFirst: h.firstName2,
    nameLast: h.lastName2,
  });
  token2 = tmp.token;

  // error inputs
  invalidChannelId = Math.abs(channelId0) + 10;
  // Channels 0 and private
  tmp = h.postRequest(h.CHAN_CREATE_URL, {
    token: token0,
    name: h.channelName0,
    isPublic: h.isPublic,
  });
  channelId0 = parseInt(tmp.channelId);

  tmp = h.postRequest(h.CHAN_CREATE_URL, {
    token: token1,
    name: h.channelName1,
    isPublic: h.isNotPublic,
  });
  channelIdPriv = parseInt(tmp.channelId);
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//
describe('Error Handling', () => {
  test('Invalid Channel ID', () => {
    const data = h.postRequest(h.CHAN_JOIN_URL, {
      token: token0,
      channelId: invalidChannelId,
    });
    expect(data).toStrictEqual({ error: 'Invalid channel Id' });
  });

  test('User already member of channel', () => {
    const data = h.postRequest(h.CHAN_JOIN_URL, {
      token: token0,
      channelId: channelId0,
    });
    expect(data).toStrictEqual({ error: 'User is already a member of the channel' });
  });

  test('Private channelId', () => {
    const data = h.postRequest(h.CHAN_JOIN_URL, {
      token: token2,
      channelId: channelIdPriv,
    });
    expect(data).toStrictEqual({ error: 'Private channel' });
  });

  test('Invalid token', () => {
    const data = h.postRequest(h.CHAN_JOIN_URL, {
      token: 'invalidToken',
      channelId: channelId0,
    });
    expect(data).toStrictEqual({ error: 'Invalid Token' });
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

  // Todo: test with channel details
});
