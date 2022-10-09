
// @ts-nocheck
import {
  channelsListAllV1,
  channelsCreateV1,
} from './channels.ts'

import { authRegisterV1 } from './auth.ts';
import { clearV1 } from './other.ts';
import { channelJoinV1 } from './channel.ts';


// Test data
let firstName1 = 'First Name 1';
let lastName1 = 'Last Name 1';
let email1 = 'email_1@gmail.com';
let password1 = 'password1';

let firstName2= 'First Name 2';
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
  let invalidUserId = null;
  let user1ChannelId = null;
  let user1Channel2Id = null;
  let user2ChannelId = null;
  beforeEach(() => {
    user1Id = authRegisterV1(email1, password1, firstName1, lastName1).authUserId;
    user2Id = authRegisterV1(email2, password2, firstName2, lastName2).authUserId;
    invalidUserId = Math.abs(user1Id) + 173;

    user1ChannelId = channelsCreateV1(user1Id, channelName1, isPublic).channelId;
    user1Channel2Id = channelsCreateV1(user1Id, channelName3, isNotPublic).channelId;
    user2ChannelId = channelsCreateV1(user2Id, channelName2, isNotPublic).channelId;
    channelJoinV1(user1Id)
  });
  // TEARDOWN
  afterEach(() => { clearV1() });  



//------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Error Test: Invalid User ID', () => {
    expect(channelsListAllV1(invalidUserId)).toStrictEqual({error: expect.any(String)});
  });
});


//------------------Function Testing------------------//


describe('Function Testing', () => {
  test('Function Test: Valid User ID & Created Channels', () => {
    expect(channelsListAllV1(user1Id)).toStrictEqual({
      channels: [
        {      
          channelId: user1ChannelId,
          name: channelName1,
        }, 
        {
          channelId: user1Channel2Id,
          name: channelName3,
        },
        { 
          channelId: user2ChannelId,
          name: channelName2,
        },
      ],
    });
  }); 

  test('Function Test: Valid User ID & Private Channel', () => {
    expect(channelsListAllV1(user2Id)).toStrictEqual({
      channels: [
        {      
          channelId: user1ChannelId,
          name: channelName1,
        }, 
        {
          channelId: user1Channel2Id,
          name: channelName3,
        },
        { 
          channelId: user2ChannelId,
          name: channelName2,
        },
      ],        
    });
  });
});









