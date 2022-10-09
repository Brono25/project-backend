// @ts-nocheck
import {
  channelDetailsV1,
  channelJoinV1,
} from './channel.ts';

import { authRegisterV1 } from './auth.ts';
import { channelsCreateV1 } from './channels.ts';
import { clearV1 } from './other.ts';

// Test data
let firstName1 = 'First Name 1';
let lastName1 = 'Last Name 1';
let email1 = 'email_1@gmail.com';
let password1 = 'password1';

let firstName2 = 'First Name 2';
let lastName2 = 'Last Name 2';
let email2 = 'email_2@gmail.com';
let password2 = 'password2';

let channelName1 = 'Channel 1';
let channelName2 = 'Channel 2';
let channelName3 = 'Channel 3';
let isPublic = true;
let isNotPublic = false;




// SETUP
  let user1Id = null;
  let user2Id = null;
  let channel1Id = null;
  let channel2Id = null;
  let channel3Id = null;
  let invalidUserId = null;
  let invalidChannelId = null;
  beforeEach(() => {
    user1Id = authRegisterV1(email1, password1, firstName1, lastName1).authUserId;
    user2Id = authRegisterV1(email2, password2, firstName2, lastName2).authUserId;
    channel1Id = channelsCreateV1(user1Id, channelName1, isPublic).channelId;
    channel2Id = channelsCreateV1(user1Id, channelName2, isPublic).channelId;
    channelJoinV1(user2Id, channel2Id);
    channel3Id = channelsCreateV1(user1Id, channelName3, isNotPublic).channelId;
    invalidUserId = Math.abs(user1Id) + 10;
    invalidChannelId = Math.abs(channel1Id) + 10;
  });
  // TEARDOWN
  afterEach(() => {clearV1()});



//------------------Error Testing------------------//

describe('Error Handling', () => {

  test('Error Test: Invalid User Id', () => {
    expect(channelDetailsV1(invalidUserId, channel1Id)).toStrictEqual({error: expect.any(String)});
  }); 

  test('Error Test: Invalid Channel Id', () => {
    expect(channelDetailsV1(user1Id, invalidChannelId)).toStrictEqual({error: expect.any(String)});
  }); 

  test('Error Test: User not a member of channel', () => {
    expect(channelDetailsV1(user2Id, channel1Id)).toStrictEqual({error: expect.any(String)});
  });
});   


 
//------------------Function Testing------------------//

describe('Function Testing', () => {

  test('Function Test: Member of a channel with more than one member', () => {
    expect(channelDetailsV1(user1Id, channel2Id)).toStrictEqual(
      {
        name: channelName2,
        isPublic: true,
        ownerMembers: [ 
          {
            uId: user1Id,
            email: email1,
            nameFirst: firstName1,
            nameLast: lastName1,
            handleStr: expect.any(String),
          }
        ],
        allMembers: [ 
          {
            uId: user1Id,
            email: email1,
            nameFirst: firstName1,
            nameLast: lastName1,
            handleStr: expect.any(String),
          }, 
          {
            uId: user2Id,
            email: email2,
            nameFirst: firstName2,
            nameLast: lastName2,
            handleStr: expect.any(String),
          } 
        ],
      }
    );
  }); 

  test('Function Test: Member of a single-member channel', () => {
    expect(channelDetailsV1(user1Id, channel1Id)).toStrictEqual(
      { 
        name: channelName1,
        isPublic: true,
        ownerMembers: [ 
          {
            uId: user1Id,
            email: email1,
            nameFirst: firstName1,
            nameLast: lastName1,
            handleStr: expect.any(String),
          }, 
        ],
        allMembers: [
          {
            uId: user1Id,
            email: email1,
            nameFirst: firstName1,
            nameLast: lastName1,
            handleStr: expect.any(String),
          }
        ],
      }
    );
  }); 

  test('Function Test: Member of a private channel', () => {
    expect(channelDetailsV1(user1Id, channel3Id)).toStrictEqual(
      {
        name: channelName3,
        isPublic: false,
        ownerMembers: [
          {
            uId: user1Id,
            email: email1,
            nameFirst: firstName1,
            nameLast: lastName1,
            handleStr: expect.any(String),
          }
        ],
        allMembers: [
          {
            uId: user1Id,
            email: email1,
            nameFirst: firstName1,
            nameLast: lastName1,
            handleStr: expect.any(String),
          }
        ],
      }
    );
  });  
}); 
