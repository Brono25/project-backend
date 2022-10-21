
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
let channelId0: number;
let channelId1: number;
let channelId2: number;
let invalidUserId: number;
let invalidChannelId: number;
beforeEach(() => {
  // Users 0, 1
  let args: h.Args = [h.email0, h.password0, h.firstName0, h.lastName0];
  userId0 = h.authRegisterReturnGaurd(authRegisterV1(...args));
  args = [h.email1, h.password1, h.firstName1, h.lastName1];
  userId1 = h.authRegisterReturnGaurd(authRegisterV1(...args));
  // Channels 0,1,2
  channelId0 = h.channelsCreateReturnGaurd(channelsCreateV1(userId0, h.channelName0, h.isPublic));
  channelId1 = h.channelsCreateReturnGaurd(channelsCreateV1(userId0, h.channelName1, h.isPublic));

  channelJoinV1(userId1, channelId1);
  channelId2 = h.channelsCreateReturnGaurd(channelsCreateV1(userId0, h.channelName2, h.isNotPublic));
  // Error cases
  invalidUserId = Math.abs(userId0) + Math.abs(userId1) + 10;
  invalidChannelId = Math.abs(channelId0) + Math.abs(channelId1) + Math.abs(channelId2) + 10;
});
// TEARDOWN
afterEach(() => {
  clearV1();
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Error Test: Invalid User Id', () => {
    expect(channelDetailsV1(invalidUserId, channelId0)).toStrictEqual({ error: expect.any(String) });
  });

  test('Error Test: Invalid Channel Id', () => {
    expect(channelDetailsV1(userId0, invalidChannelId)).toStrictEqual({ error: expect.any(String) });
  });

  test('Error Test: User not a member of channel', () => {
    expect(channelDetailsV1(userId1, channelId0)).toStrictEqual({ error: expect.any(String) });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Function Test: Member of a channel with more than one member', () => {
    expect(channelDetailsV1(userId0, channelId1)).toStrictEqual(
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
    expect(channelDetailsV1(userId0, channelId0)).toStrictEqual(
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
    expect(channelDetailsV1(userId0, channelId2)).toStrictEqual(
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
