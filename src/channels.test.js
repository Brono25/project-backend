

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
let channelName2 = 'Channel 2';
let channelName3 = 'Channel 3';
let isPublic = true;
let isNotPublic = false;


let invalidEmptyChannelName = '';
let invalidLongChannelName = 'ChannelsNamesMoreThanTwentyCharactersAreInvalid'





//------------------Channels Create Test------------------//


describe('channelsCreateV1()', () => {
  // Setup
  let authUserId1 = null;
  let invalidAuthUserId = null;
  beforeEach(() => {
    authUserId1 = authRegisterV1(email1, password1, firstName1, lastName1).authUserId; 
    invalidAuthUserId = Math.abs(authUserId1) + 10;
  });
  // Tear down
  afterEach(() => {clearV1()});

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
  // Setup
  

  // SETUP
  let user1Id = null;
  let user2Id = null;
  let invalidUserId = null;
  beforeEach(() => {
    user1Id = authRegisterV1(email1, password1, firstName1, lastName1).authUserId;
    user2Id = authRegisterV1(email2, password2, firstName2, lastName2).authUserId;
    invalidUserId = Math.abs(user1Id) + 173;

    const user1Channel = channelsCreateV1(user1Id, channelName1, isPublic);
    const user1Channel2 = channelsCreateV1(user1Id, channelName3, isNotPublic);
    const user2Channel = channelsCreateV1(user1Id, channelName2, isNotPublic);
  });

  afterEach(() => {
    clearV1();
  });  

  // TEARDOWN
  describe('Error Handling', () => {
    test('Error Test: Invalid User ID', () => {
      expect(channelsListAllV1(invalidUserId)).toStrictEqual({error: expect.any(string)});
    });
  });
  describe('Function Testing', () => {
    test('Function Test: Valid User ID & Created Channels', () => {
      expect(channelsListAllV1(user1Id)).toStrictEqual({
        channels: [
          {user1Channel}, 
          {user1Channel2},
        ]
      });
    }); 

    test('Function Test: Valid User ID & Private Channel', () => {
      expect(channelsListAllV1(user2Id)).toStrictEqual({
        channels: [
          {user2Channel},
        ]
      });
    });
  });
});








//------------------Channels List Test------------------//


describe('channelsListV1()', () => {
  // Setup
  let authUserId1 = null;
  let invalidAuthUserId = null;
  let channelId1 = null;
  beforeEach(() => {
    authUserId1 = authRegisterV1(email1, password1, firstName1, lastName1).authUserId;
    channelId1 = channelsCreateV1(authUserId1, channelName1, isPublic).channelId;
    invalidAuthUserId = Math.abs(authUserId1) + 10;
  });
  // Tear down
  afterEach(() => {
    clearV1()
  });
  describe('Error Handling', () => {
    test('Invalid user ID', () => {
      expect(channelsListV1(invalidAuthUserId)).toStrictEqual({error: expect.any(String)});
    }); 

  });   

  describe('Function Testing', () => {

    test('List channel', () => {
      expect(channelsListV1(authUserId1)).toStrictEqual({channels: [
    {
      channelId: channelId1,
      name: channelName1,
      isPublic: true,
      ownerMembers: [ {authUserId: authUserId1}, ],
      allMembers:   [ {authUserId: authUserId1}, ],
      messages: [],
  }
  ]})
    }); 
  })   
});


