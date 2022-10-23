
import { authRegisterV1 } from '../auth';
import { channelsCreateV1 } from '../channels';
import { clearV1 } from '../other';
import { ChannelDetails } from '../data.types';
import * as h from './test.helper';
import {
  channelDetailsV1,
  channelJoinV1,
} from '../channel';

// SETUP
let userId0: number;
let userId1: number;
let userId2: number;
let token0: string;
let token1: string;
let token2: string;
let channelId0: number;
let channelId1: number;
let channelId2: number;
let invalidUserId: number;
let invalidToken: string;
let invalidChannelId: number;
beforeEach(() => {
  // Create users 0, 1, 2
  const user0: any = h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });
  token0 = user0.token;
  const user1: any = h.postRequest(h.REGISTER_URL, {
    email: h.email1,
    password: h.password1,
    nameFirst: h.firstName1,
    nameLast: h.lastName1,
  });
  token1 = user1.token;
  const user2: any = h.postRequest(h.REGISTER_URL, {
    email: h.email2,
    password: h.password2,
    nameFirst: h.firstName2,
    nameLast: h.lastName2,
  });
  token1 = user2.token;
  
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
    expect(channelDetailsV1(invalidToken, channelId0)).toStrictEqual({ error: expect.any(String) });
  });
  /*
  test('Error Test: Invalid User Id', () => {
    expect(channelDetailsV1(invalidUserId, channelId0)).toStrictEqual({ error: expect.any(String) });
  });
  */
  test('Error Test: Invalid Channel Id', () => {
    expect(channelDetailsV1(token0, invalidChannelId)).toStrictEqual({ error: expect.any(String) });
  });

  test('Error Test: User not a member of any channel', () => {
    expect(channelDetailsV1(token2, channelId0)).toStrictEqual({ error: expect.any(String) });
    expect(channelDetailsV1(token2, channelId1)).toStrictEqual({ error: expect.any(String) });
    expect(channelDetailsV1(token2, channelId2)).toStrictEqual({ error: expect.any(String) });
  });

  test('Error Test: User not a member of channel', () => {
    expect(channelDetailsV1(token1, channelId0)).toStrictEqual({ error: expect.any(String) });
    expect(channelDetailsV1(token1, channelId2)).toStrictEqual({ error: expect.any(String) });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Function Test: Member of a channel with more than one member', () => {
    expect(channelDetailsV1(token0, channelId1)).toStrictEqual(
      <ChannelDetails>{
        name: h.channelName1,
        isPublic: h.isPublic,
        ownerMembers: [
          {
            uId: userId0,
            email: h.email0,
            nameFirst: h.firstName0,
            nameLast: h.lastName0,
            handleStr: expect.any(String),
          }
        ],
        allMembers: [
          {
            uId: userId0,
            email: h.email0,
            nameFirst: h.firstName0,
            nameLast: h.lastName0,
            handleStr: expect.any(String),
          },
          {
            uId: userId1,
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
    expect(channelDetailsV1(token0, channelId0)).toStrictEqual(
      <ChannelDetails>{
        name: h.channelName0,
        isPublic: h.isPublic,
        ownerMembers: [
          {
            uId: userId0,
            email: h.email0,
            nameFirst: h.firstName0,
            nameLast: h.lastName0,
            handleStr: expect.any(String),
          },
        ],
        allMembers: [
          {
            uId: userId0,
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
    expect(channelDetailsV1(token0, channelId2)).toStrictEqual(
      <ChannelDetails>{
        name: h.channelName2,
        isPublic: h.isNotPublic,
        ownerMembers: [
          {
            uId: userId0,
            email: h.email0,
            nameFirst: h.firstName0,
            nameLast: h.lastName0,
            handleStr: expect.any(String),
          }
        ],
        allMembers: [
          {
            uId: userId0,
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
