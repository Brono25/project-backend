
import HTTPError from 'http-errors';
import { token } from 'morgan';
import { ChannelDetails } from '../data.types';
import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

let token0: string;
let token1: string;
let token2: string;
let uId0: number;
let uId1: number;

// SETUP
let channelId0: number;
let channelId1: number;
let channelId2: number;
let invalidChannelId: number;
let invalidInput: any;
let input: any;
// SETUP
beforeEach(() => {
  // Create users 0, 1, 2
  const user0: any = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = user0.token;
  uId0 = parseInt(user0.authUserId);
  const user1: any = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = user1.token;
  uId1 = parseInt(user1.authUserId);
  const user2: any = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(2));
  token2 = user2.token;
  // Create channels 0,1,2
  const channel0: any = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(0, true), token0);
  channelId0 = channel0.channelId;
  const channel1: any = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(1, true), token0);
  channelId1 = channel1.channelId;
  const channel2: any = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(2, false), token0);
  channelId2 = channel2.channelId;
  // User 1 joins Channel 1
  h.postRequest(h.CHAN_JOIN_URL, { channelId: channelId1 }, token1);
  // Error cases
  invalidChannelId = Math.abs(channelId0) + Math.abs(channelId1) + Math.abs(channelId2) + 10;
});
// TEARDOWN
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Error Test: Invalid Token', () => {
    const data = { channelId: channelId0 };
    h.testErrorThrown(h.CHAN_DETAIL_URL, 'GET', 403, data, h.invalidToken);
  });

  test('Error Test: Invalid Channel Id', () => {
    const data = { channelId: invalidChannelId };
    h.testErrorThrown(h.CHAN_DETAIL_URL, 'GET', 400, data, token0);
  });

  test('Error Test: User not a member of any channel', () => {
    let data = { channelId: channelId0 };
    h.testErrorThrown(h.CHAN_DETAIL_URL, 'GET', 403, data, token2);
    data = { channelId: channelId1 };
    h.testErrorThrown(h.CHAN_DETAIL_URL, 'GET', 403, data, token2);
    data = { channelId: channelId2 };
    h.testErrorThrown(h.CHAN_DETAIL_URL, 'GET', 403, data, token2);
  });

  test('Error Test: User not a member of channel', () => {
    let data = { channelId: channelId0 };
    h.testErrorThrown(h.CHAN_DETAIL_URL, 'GET', 403, data, token1);
    data = { channelId: channelId2 };
    h.testErrorThrown(h.CHAN_DETAIL_URL, 'GET', 403, data, token1);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Function Test: Member of a channel with more than one member', () => {
    input = h.getRequest(h.CHAN_DETAIL_URL, { channelId: channelId1 }, token0);
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
    input = h.getRequest(h.CHAN_DETAIL_URL, { channelId: channelId0 }, token0);
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
    input = h.getRequest(h.CHAN_DETAIL_URL, { channelId: channelId2 }, token0);
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
