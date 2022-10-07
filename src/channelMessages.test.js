import {
  channelDetailsV1,
  channelJoinV1,
  channelInviteV1,
  channelMessagesV1,
} from './channel';

import { authRegisterV1 } from './auth';
import { channelsCreateV1 } from './channels';
import { clearV1 } from './other';

// Test data
let firstName1 = 'First Name 1';
let lastName1 = 'Last Name 1';
let email1 = 'email_1@gmail.com';
let password1 = 'password1';

let firstName2 = 'First Name 2';
let lastName2 = 'Last Name 2';
let email2 = 'email_2@gmail.com';
let password2 = 'password2';


let firstName3= 'First Name 3';
let lastName3 = 'Last Name 3';
let email3 = 'email_3@gmail.com';
let password3 = 'password3';

let channelName1 = 'Channel 1';
let channelName2 = 'Channel 2';
let isPublic = true;
let isNotPublic = false;


let userId1;
let userId2;
let channelId1;
let channelId2;

//Setup
beforeEach(() => {
  // Register users
  userId1 = authRegisterV1(
    email1, password1, firstName1, lastName1
  ).authUserId;
  userId2 = authRegisterV1(
    email2, password2, firstName2, lastName2
  ).authUserId;
  // Create channels
  channelId1 = channelsCreateV1(userId1, channelName1, false).channelId;
  channelId2 = channelsCreateV1(userId2, channelName2, false).channelId;
});

// Tear down
afterEach(() => { clearV1() });




//------------------Error Testing------------------//


describe('Error Handling', () => {

  test('Invalid authUserId', () => {
    expect(channelMessagesV1(userId1 + userId2, channelId1, 0)).toStrictEqual(
      { error: expect.any(String) }
    );
  });

  test('Invalid channelId', () => {
    expect(
      channelMessagesV1(userId1, channelId2 + channelId1, 0)).toStrictEqual(
      { error: expect.any(String) }
    );
  });

  test('Valid channelId, authUserId not a member', () => {
    expect(channelMessagesV1(userId1, channelId2, 0)).toStrictEqual(
      { error: expect.any(String) }
    );
  });

  test('start greater than num messages', () => {
    expect(channelMessagesV1(userId1, channelId1, 10)).toStrictEqual(
      { error: expect.any(String) }
    );
  });

});

//------------------Function Testing------------------//
describe('Function Testing', () => {
  
    

});




