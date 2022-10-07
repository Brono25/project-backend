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
  let authUserId2 = null;
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
      expect(channelJoinV1(authUserId1, invalidChannelId)).toStrictEqual({ error: expect.any(String) });
    });

    test('User already member of channel', () => {
      expect(channelJoinV1(authUserId1, channelId1)).toStrictEqual({ error: expect.any(String) });
    });

    test('Private channelId', () => {
      expect(channelJoinV1(authUserId1, channelIdPriv)).toStrictEqual({ error: expect.any(String) });
    });

    test('Invalid User Id', () => {
      expect(channelJoinV1(invalidAuthUserId, channelId1)).toStrictEqual({ error: expect.any(String) });
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

  describe('Function Testing', () => {

    test('adds the user to the channel', () => {
      expect(channelInviteV1(authUserId1, channelId1, authUserId2)).toStrictEqual({})
    }); 
  })
});   


//------------------Channel Messages Test------------------//


describe('channelMessagesV1()', () => {
  let userId1;
  let userId2;
  let channelId1;
  let channelId2;

  beforeEach(() => {
    clearV1();
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

  describe('Function Testing', () => {
    
    test('No messages', () => {
      expect(channelMessagesV1(userId1, channelId1, 0)).toStrictEqual(
        { messages: [], start: 0, end: -1 }
      );
    });

    // More tests once messages can be implemented

  });

});




