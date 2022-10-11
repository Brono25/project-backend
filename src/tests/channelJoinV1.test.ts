
import { channelJoinV1 } from '../channel';
import { authRegisterV1 } from '../auth';
import { channelsCreateV1 } from '../channels';
import { clearV1 } from '../other';

// Test data
const firstName1 = 'First Name 1';
const lastName1 = 'Last Name 1';
const email1 = 'email_1@gmail.com';
const password1 = 'password1';

const firstName2 = 'First Name 2';
const lastName2 = 'Last Name 2';
const email2 = 'email_2@gmail.com';
const password2 = 'password2';

const firstName3 = 'First Name 3';
const lastName3 = 'Last Name 3';
const email3 = 'email_3@gmail.com';
const password3 = 'password3';

const channelName1 = 'Channel 1';
const channelName2 = 'Channel 2';
const isPublic = true;
const isNotPublic = false;

// Setup
let authUserId1 = null;
let invalidAuthUserId = null;
let channelId1 = null;
let invalidChannelId = null;
let authUserId2 = null;
let channelIdPriv = null;
let authUserId3 = null;
beforeEach(() => {
  authUserId1 = authRegisterV1(email1, password1, firstName1, lastName1).authUserId;
  channelId1 = channelsCreateV1(authUserId1, channelName1, isPublic).channelId;
  invalidAuthUserId = Math.abs(authUserId1) + 10;
  invalidChannelId = Math.abs(channelId1) + 10;
  authUserId2 = authRegisterV1(email2, password2, firstName2, lastName2).authUserId;
  channelIdPriv = channelsCreateV1(authUserId2, channelName2, isNotPublic).channelId;
  authUserId3 = authRegisterV1(email3, password3, firstName3, lastName3).authUserId;
});
// Tear down
afterEach(() => { clearV1(); });

// ------------------Error Testing------------------//
describe('Error Handling', () => {
  test('Invalid channel Id', () => {
    expect(channelJoinV1(authUserId1, invalidChannelId)).toStrictEqual({ error: expect.any(String) });
  });

  test('User already member of channel', () => {
    expect(channelJoinV1(authUserId1, channelId1)).toStrictEqual({ error: expect.any(String) });
  });

  test('Private channelId', () => {
    expect(channelJoinV1(authUserId3, channelIdPriv)).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid User Id', () => {
    expect(channelJoinV1(invalidAuthUserId, channelId1)).toStrictEqual({ error: expect.any(String) });
  });
});

// ------------------Function Testing------------------//
describe('Function Testing', () => {
  test('adds a global member to the channel', () => {
    expect(channelJoinV1(authUserId2, channelId1)).toStrictEqual({});
  });

  test('adds a global owner to the channel', () => {
    expect(channelJoinV1(authUserId1, channelIdPriv)).toStrictEqual({});
  });
});
