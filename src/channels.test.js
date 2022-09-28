

import {
  channelsListAllV1,
  channelsCreateV1,
  channelsListV1,
} from './channels'

import { authRegisterV1 } from './auth';
import { clearV1 } from './other';



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
let isPublic = true;
let isNotPublic = false;


let invalidEmptyChannelName = '';
let invalidLongChannelName = 'ChannelsNamesMoreThanTwentyCharactersAreInvalid'

// Setup
let authUserId1 = null;
let invalidAuthUserId = null;
beforeEach(() => {
  authUserId1 = authRegisterV1(email1, password1, firstName1, lastName1).authUserId; 
  invalidAuthUserId = Math.abs(authUserId1) + 10;
});

// Tear down
afterEach(() => {
 clearV1();
});



//------------------Channels Create Test------------------//


describe('channelsCreateV1()', () => {

  describe('Error Handling', () => {
    test('Channel name too long', () => {
      const args = [authUserId1, invalidLongChannelName, isPublic];
      expect(channelsCreateV1(...args)).toStrictEqual({error: expect.any(String)});
    }); 
    test('Channel name empty', () => {
      const args = [authUserId1, invalidEmptyChannelName, isPublic];
      expect(channelsCreateV1(...args)).toStrictEqual({error: expect.any(String)});
    }); 
    test('Invalid user ID', () => {
      const args = [invalidAuthUserId, channelName1, isPublic];
      expect(channelsCreateV1(...args)).toStrictEqual({error: expect.any(String)});
    }); 
  }); 
    
  describe('Function Testing', () => {
    test('Create channel', () => {
      const args = [authUserId1, channelName1, isPublic];
      expect(channelsCreateV1(...args)).toStrictEqual({channelId: expect.any(Number)});
    }); 
  })
  
});








//------------------Channels List All Test------------------//


describe('channelsListAllV1()', () => {

  describe('Error Handling', () => {
    test('do error testing', () => {
    
    }); 
  });   

  describe('Function Testing', () => {
    test('do function testing', () => {
    
    }); 
  })
    
});








//------------------Channels List Test------------------//


describe('channelsListV1()', () => {
 
  describe('Error Handling', () => {

    test('do error testing', () => {
    
    }); 

  });   

  describe('Function Testing', () => {

    test('do function testing', () => {
    
    }); 

  })  
 
});


