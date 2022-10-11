
// @ts-nocheck
import { channelInviteV1 } from '../src/channel.ts';
import { authRegisterV1 } from '../src/auth.ts';
import { channelsCreateV1 } from '../src/channels.ts';
import { clearV1 } from '../src/other.ts';

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
let isPublic = true;
let isNotPublic = false;


 // Setup
  let authUserId1 = null;
  let invalidAuthUserId = null;
  let channelId1 = null;
  let invalidChannelId = null;
  let authUserId2= null;
  let channelIdPriv = null;
  beforeEach(() => {
    authUserId1 = authRegisterV1(email1, password1, firstName1, lastName1).authUserId;
    channelId1 = channelsCreateV1(authUserId1, channelName1, isPublic).channelId;
    invalidAuthUserId = Math.abs(authUserId1) + 10;
    invalidChannelId = Math.abs(channelId1) + 10;
    authUserId2 = authRegisterV1(email2, password2, firstName2, lastName2).authUserId;
    channelIdPriv = channelsCreateV1(authUserId2, channelName2, isNotPublic).channelId;
  });
  // Tear down
  afterEach(() => {clearV1()});


//------------------Error Testing------------------//
describe('Error Handling', () => {

  test('Invalid channel Id', () => {
    expect(channelInviteV1(authUserId1, invalidChannelId, authUserId2)).toStrictEqual({error: expect.any(String)});
  });
  
  test('User already member of channel', () => {
    expect(channelInviteV1(authUserId1, channelId1, authUserId1)).toStrictEqual({error: expect.any(String)});
  });
  
  test('Invalid User Id', () => {
    expect(channelInviteV1(invalidAuthUserId, channelId1, authUserId2)).toStrictEqual({error: expect.any(String)});
  });  

  test('Invalid User Id', () => {
    expect(channelInviteV1(authUserId1, channelId1, invalidAuthUserId)).toStrictEqual({error: expect.any(String)});
  });

  test('authUser not a member', () => {
    expect(channelInviteV1(authUserId2, channelId1, authUserId2)).toStrictEqual({error: expect.any(String)});
  })

});




//------------------Function Testing------------------//

describe('Function Testing', () => {

  test('adds the user to the channel', () => {
    expect(channelInviteV1(authUserId1, channelId1, authUserId2)).toStrictEqual({})
  }); 
})
