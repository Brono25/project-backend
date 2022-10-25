
import { authRegisterV1 } from '../auth';
import { channelsCreateV1 } from '../channels';
import { clearV1 } from '../other';
import { ChannelDetails } from '../data.types';
import * as h from './test.helper';
import {
  channelDetailsV2,
  channelJoinV1,
} from '../channel';

clearV1();
// SETUP
let token0: string;
let token1: string;
let token2: string;
let uId0: number;
let uId1: number;
let uId2: number;
let channelId0: number;
let channelId1: number;
let channelId2: number;
let invalidToken: string;
let invalidChannelId: number;
let invalidInput: any;
let input: any;
beforeEach(() => {
  // Create users 0, 1, 2
  const user0: any = h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });
  token0 = user0.token;
  uId0 = parseInt(user0.authUserId);
  const user1: any = h.postRequest(h.REGISTER_URL, {
    email: h.email1,
    password: h.password1,
    nameFirst: h.firstName1,
    nameLast: h.lastName1,
  });
  token1 = user1.token;
  uId1 = parseInt(user1.authUserId);
  const user2: any = h.postRequest(h.REGISTER_URL, {
    email: h.email2,
    password: h.password2,
    nameFirst: h.firstName2,
    nameLast: h.lastName2,
  });
  token2 = user2.token;
  uId2 = parseInt(user2.authUserId);
  // Create channels 0,1,2
  const channel0: any = h.postRequest(h.CHAN_CREATE_URL, {
    token: token0,
    name: h.channelName0,
    isPublic: h.isPublic,
  });
  channelId0 = channel0.channelId;
  const channel1: any = h.postRequest(h.CHAN_CREATE_URL, {
    token: token0,
    name: h.channelName1,
    isPublic: h.isPublic,
  });
  channelId1 = channel1.channelId;
  const channel2: any = h.postRequest(h.CHAN_CREATE_URL, {
    token: token0,
    name: h.channelName2,
    isPublic: h.isNotPublic,
  });
  channelId2 = channel2.channelId;
  // User 1 joins Channel 1
  h.postRequest(h.CHAN_JOIN_URL, {
  token: token1,
  channelId: channel1,
  });
  // Error cases
  invalidToken = h.invalidToken;
  invalidChannelId = Math.abs(channelId0) + Math.abs(channelId1) + Math.abs(channelId2) + 10;
});
// TEARDOWN
afterEach(() => {
  clearV1();
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Error Test: Invalid Token', () => {
    invalidInput = h.getRequest(h.CHAN_DETAIL_URL, {
      token: invalidToken,
      channelId: channelId0,
    });
    expect(invalidInput).toStrictEqual({ error: expect.any(String) });
  });

  test('Error Test: Invalid Channel Id', () => {
    invalidInput = h.getRequest(h.CHAN_DETAIL_URL, {
      token: token0,
      channelId: invalidChannelId,
    });
    expect(invalidInput).toStrictEqual({ error: expect.any(String) });
  });

  test('Error Test: User not a member of any channel', () => {
    invalidInput = h.getRequest(h.CHAN_DETAIL_URL, {
      token: token2,
      channelId: channelId0,
    });
    expect(invalidInput).toStrictEqual({ error: expect.any(String) });
    invalidInput = h.getRequest(h.CHAN_DETAIL_URL, {
      token: token2,
      channelId: channelId1,
    });
    expect(invalidInput).toStrictEqual({ error: expect.any(String) });
    invalidInput = h.getRequest(h.CHAN_DETAIL_URL, {
      token: token2,
      channelId: channelId2,
    })
    expect(invalidInput).toStrictEqual({ error: expect.any(String) });
  });

  test('Error Test: User not a member of channel', () => {
    invalidInput = h.getRequest(h.CHAN_DETAIL_URL, {
      token: token1,
      channelId: channelId0,
    });
    expect(invalidInput).toStrictEqual({ error: expect.any(String) });
    invalidInput = h.getRequest(h.CHAN_DETAIL_URL, {
      token: token1,
      channelId: channelId2,
    });
    expect(invalidInput).toStrictEqual({ error: expect.any(String) });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Function Test: Member of a channel with more than one member', () => {
    input = h.getRequest(h.CHAN_DETAIL_URL, {
      token: token0,
      channelId: channelId1,
    });
    expect(input).toStrictEqual(
      <ChannelDetails>{
        name: h.channelName1,
        isPublic: h.isPublic,
        ownerMembers: [
          {
            uId: uId0,
            email: h.email0,
            nameFirst: h.firstName0,
            nameLast: h.lastName0,
            handleStr: expect.any(String),
          }
        ],
        allMembers: [
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
          }
        ],
      }
    );
  });

  test('Function Test: Member of a single-member channel', () => {
    input = h.getRequest(h.CHAN_DETAIL_URL, {
      token: token0,
      channelId: channelId0,
    });
    expect(input).toStrictEqual(
      <ChannelDetails>{
        name: h.channelName0,
        isPublic: h.isPublic,
        ownerMembers: [
          {
            uId: uId0,
            email: h.email0,
            nameFirst: h.firstName0,
            nameLast: h.lastName0,
            handleStr: expect.any(String),
          },
        ],
        allMembers: [
          {
            uId: uId0,
            email: h.email0,
            nameFirst: h.firstName0,
            nameLast: h.lastName0,
            handleStr: expect.any(String),
          }
        ],
      }
    );
  });

  test('Function Test: Member of a private channel', () => {
    input = h.getRequest(h.CHAN_DETAIL_URL, {
      token: token0,
      channelId: channelId2,
    });
    expect(input).toStrictEqual(
      <ChannelDetails>{
        name: h.channelName2,
        isPublic: h.isNotPublic,
        ownerMembers: [
          {
            uId: uId0,
            email: h.email0,
            nameFirst: h.firstName0,
            nameLast: h.lastName0,
            handleStr: expect.any(String),
          }
        ],
        allMembers: [
          {
            uId: uId0,
            email: h.email0,
            nameFirst: h.firstName0,
            nameLast: h.lastName0,
            handleStr: expect.any(String),
          }
        ],
      }
    );
  });
});
