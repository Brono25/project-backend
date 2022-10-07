

import {
  channelsCreateV1,
  channelsListV1,
} from './channels'

import { authRegisterV1 } from './auth';
import { clearV1 } from './other';
import { channelInviteV1 } from './channel';


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
let channelName4 = 'Channel 4';
let isPublic = true;
let isNotPublic = false;

let authUserId1 = null;
let authUserId2 = null;
let invalidAuthUserId = null;
let publicChannelId1 = null;
let publicChannelId2 = null;
let privateChannelId1 = null
let privateChannelId2 = null
// Setup
beforeEach(() => {
  authUserId1 = authRegisterV1(email1, password1, firstName1, lastName1).authUserId;
  authUserId2 = authRegisterV1(email2, password2, firstName2, lastName2).authUserId;
  
  // User 1's owner of channels
  publicChannelId1 = channelsCreateV1(authUserId1, channelName1, isPublic).channelId;
  publicChannelId2 = channelsCreateV1(authUserId1, channelName2, isPublic).channelId;
  privateChannelId1 = channelsCreateV1(authUserId1, channelName3, isNotPublic).channelId;
  privateChannelId2 = channelsCreateV1(authUserId1, channelName4, isNotPublic).channelId;
  
  //User 2 member of channels
  channelInviteV1(authUserId1, privateChannelId1, authUserId2)
  channelInviteV1(authUserId1, publicChannelId1, authUserId2);
  channelInviteV1(authUserId1, publicChannelId2, authUserId2);
  
  invalidAuthUserId = Math.abs(authUserId1) + 10;
});
// Tear down
afterEach(() => { clearV1()});



//------------------Error Testing------------------//



describe('Error Handling', () => {
  test('Invalid user ID', () => {
    let authUserId1 = authRegisterV1(email1, password1, firstName1, lastName1).authUserId;
    let invalidAuthUserId = Math.abs(authUserId1) + 10;
    expect(channelsListV1(invalidAuthUserId)).toStrictEqual({error: expect.any(String)});
  }); 
});   


//------------------Function Testing------------------//

describe('Function Testing', () => {

  test('List channels for public', () => {
    expect(channelsListV1(authUserId1)).toStrictEqual({channels: [
    {
    channelId: publicChannelId1,
    name: channelName1,
    },
    {
    channelId: publicChannelId2,
    name: channelName2,
    },
    {
    channelId: privateChannelId1,
    name: channelName3,
    },
    {
    channelId: privateChannelId2,
    name: channelName4,
    },
    ]})
  });  
  test('List channels for private', () => {

    expect(channelsListV1(authUserId2)).toStrictEqual({channels: [
    {
    channelId: publicChannelId1,
    name: channelName1,
    },
    {
    channelId: publicChannelId2,
    name: channelName2,
    },
    {
    channelId: privateChannelId1,
    name: channelName3,
    },
    ]})
  }); 
})   

