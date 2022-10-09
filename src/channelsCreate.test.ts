
// @ts-nocheck
import { channelsCreateV1 } from './channels.ts'
import { authRegisterV1 } from './auth.ts';
import { clearV1 } from './other.ts';


// Test data
let firstName1 = 'First Name 1';
let lastName1 = 'Last Name 1';
let email1 = 'email_1@gmail.com';
let password1 = 'password1';
let channelName1 = 'Channel 1';
let isPublic = true;
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
afterEach(() => {clearV1()});

//------------------Error Testing------------------//


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



//------------------Function Testing------------------//

  
describe('Function Testing', () => {
  test('Create channel', () => {
    const args = [authUserId1, channelName1, isPublic];
    expect(channelsCreateV1(...args)).toStrictEqual({channelId: expect.any(Number)});
  }); 

  test('One user create 100 channels and get 100 unique ID\'s', () => {
    const numberOfChannels = 100;
    let channelIdList = new Set();
    for (let n  = 0; n < numberOfChannels ; n++) {
      let args = [authUserId1, n.toString().concat(channelName1), isPublic];
      let channelId = channelsCreateV1(...args);
      channelIdList.add(channelId);
    }
    expect(channelIdList.size === numberOfChannels).toStrictEqual(true);
  });
})


