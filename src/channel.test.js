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

let firstName2= 'First Name 2';
let lastName2 = 'Last Name 2';
let email2 = 'email_2@gmail.com';
let password2 = 'password2';

let channelName1 = 'Channel 1';
let channelName2 = 'Channel 2';
let isPublic = true;
let isNotPublic = false;



//------------------Channel Details Test------------------//


describe('channelDetailsV1()', () => {
 
  describe('Error Handling', () => {

    test('do error testing', () => {
    
    }); 

  });   

  describe('Function Testing', () => {

    test('do function testing', () => {
    
    }); 

  })  
 
});





//------------------Channel Join Test------------------//


describe('channelJoinV1()', () => {
 
  // Setup
  let authUserId1 = null;
  let invalidAuthUserId = null;
  let channelId1 = null;
  let invalidChannelId = null;
  let authUserId2= null;
  let channelIdPriv = null;
  beforeEach(() => {
    authUserId1 = authRegisterV1(email1, password1, firstName1, lastName1).uId;
    channelId1 = channelsCreateV1(authUserId1, channelName1, isPublic).channelId;
    invalidAuthUserId = Math.abs(authUserId1) + 10;
    invalidChannelId = Math.abs(channelId1) + 10;
    authUserId2 = authRegisterV1(email2, password2, firstName2, lastName2).uId;
    channelIdPriv = channelsCreateV1(authUserId2, channelName2, isNotPublic).channelId;
  });
  // Tear down
  afterEach(() => {
    clearV1()
  });
  describe('Error Handling', () => {
  
    test('Invalid channel Id', () => {
      expect(channelJoinV1(authUserId1, invalidChannelId)).toStrictEqual({error: expect.any(String)});
    });
    
    test('User already member of channel', () => {
      expect(channelJoinV1(authUserId1, channelId1)).toStrictEqual({error: expect.any(String)});
    });
    
    test('Private channelId', () => {
      expect(channelJoinV1(authUserId1, channelIdPriv)).toStrictEqual({error: expect.any(String)});
    });
    
    test('Invalid User Id', () => {
      expect(channelJoinV1(invalidAuthUserId, channelId1)).toStrictEqual({error: expect.any(String)});
    });  

  });   

  describe('Function Testing', () => {

    test('adds the user to the channel', () => {
      expect(channelJoinV1(authUserId2, channelId1)).toStrictEqual({})
    }); 
  })   
});




//------------------Channel Invite Test------------------//


describe('channelInviteV1()', () => {
 
  describe('Error Handling', () => {

    test('do error testing', () => {
    
    }); 

  });   

  describe('Function Testing', () => {

    test('do function testing', () => {
    
    }); 

  })  
 
});





//------------------Channel Messages Test------------------//


describe('channelMessagesV1()', () => {
 
  describe('Error Handling', () => {

    test('do error testing', () => {
    
    }); 

  });   

  describe('Function Testing', () => {

    test('do function testing', () => {
    
    }); 

  })  
 
});




