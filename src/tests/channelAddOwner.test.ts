import * as h from './test.helper';

// SETUP
let user: any;
let token0: string;
let token1: string;
let token2: string;
let invalidToken: string;
let uId0: number;
let uId1: number;
let uId2: number;
let invalidUserId: number;
let channel: any;
let channelId0: number;
let channelId1: number;
let channelId2: number;
let invalidChannelId: number;
beforeEach(() => {
    // Create 3 users
    user = h.postRequest(h.REGISTER_URL, {
        email: h.email0,
        password: h.password0,
        nameFirst: h.firstName0,
        nameLast: h.lastName0,
    });
    token0 = user.token;
    uId0 = parseInt(user.authUserId);
    user = h.postRequest(h.REGISTER_URL, {
        email: h.email1,
        password: h.password1,
        nameFirst: h.firstName1,
        nameLast: h.lastName1,
    });
    token1 = user.token;
    uId1 = parseInt(user.authUserId);
    user = h.postRequest(h.REGISTER_URL, {
        email: h.email2,
        password: h.password2,
        nameFirst: h.firstName2,
        nameLast: h.lastName2,
    });
    token2 = user.token;
    uId2 = parseInt(user.authUserId);
    // Create channels 0, 1, 2
    channel = h.postRequest(h.CHAN_CREATE_URL, {
        token: token0,
        name: h.channelName0,
        isPublic: h.isPublic,
    });
    channelId0 = parseInt(channel.channelId);
    h.postRequest(h.CHAN_JOIN_URL, {
        token: token1,
        channelId: channelId0,
    });
    h.postRequest(h.CHAN_JOIN_URL, {
        token: token2,
        channelId: channelId0,
    });
    channel = h.postRequest(h.CHAN_CREATE_URL, {
        token: token0,
        name: h.channelName1,
        isPublic: h.isNotPublic,
    });
    channelId1 = parseInt(channel.channelId);
    channel = h.postRequest(h.CHAN_CREATE_URL, {
        token: token2,
        name: h.channelName2,
        isPublic: h.isPublic,
    });
    channelId2 = parseInt(channel.channelId);
    // Error cases
    invalidToken = h.invalidToken;
    invalidUserId = Math.abs(uId0) + Math.abs(uId1) + Math.abs(uId2) + 10;
    invalidChannelId = Math.abs(channelId0) + Math.abs(channelId1) + Math.abs(channelId2) + 10;
});

// TEARDOWN
afterEach(() => {
    h.deleteRequest(h.CLEAR_URL, {});
});
// member of 2 member channel
// already owner
// no owner permission, valid channelId
// completely unrelated channel, with no common user

// ------------------Error Testing------------------//
describe('Error Handling', () => {
    test('Invalid Token', () => {
        const input = h.postRequest(h.CHAN_ADD_OWNER_URL, {
          token: invalidToken,
          channelId: channelId0,
          uId: uId1,
        });
        expect(input).toStrictEqual({ error: 'Invalid Token' });
    });
    test('Invalid Channel ID', () => {
      const input = h.postRequest(h.CHAN_ADD_OWNER_URL, {
        token: token0,
        channelId: invalidChannelId,
        uId: uId1,
      });
      expect(input).toStrictEqual({ error: 'Invalid Channel Id' });
    });
    test('Invalid User ID', () => {
        const input = h.postRequest(h.CHAN_ADD_OWNER_URL, {
          token: token0,
          channelId: invalidChannelId,
          uId: invalidUserId,
        });
        expect(input).toStrictEqual({ error: 'Invalid User Id' });
    });
    test('Invalid User: Not a member of channel', () => {
        const input = h.postRequest(h.CHAN_ADD_OWNER_URL, {
          token: token1,
          channelId: channelId2,
          uId: uId1,
        });
        expect(input).toStrictEqual({ error: expect.any(String) });
    });
    test('Invalid User: Already an owner', () => {
        const input = h.postRequest(h.CHAN_ADD_OWNER_URL, {
          token: token0,
          channelId: channelId0,
          uId: uId0,
        });
        expect(input).toStrictEqual({ error: expect.any(String) });
    });
    test('Invalid User: No owner permission', () => {
        const input = h.postRequest(h.CHAN_ADD_OWNER_URL, {
          token: token2,
          channelId: channelId0,
          uId: uId1,
        });
        expect(input).toStrictEqual({ error: expect.any(String) });
    });
});

// ------------------Function Testing------------------//
describe('Function Testing', () => {
    test('Make a regular member an owner', () => {
        const input: any = h.postRequest(h.CHAN_ADD_OWNER_URL, {
          token: token1,
          channelId: channelId0,
          uId: uId1,
        });
        expect(input).toStrictEqual({});
    });
    /*
    test('Make a member with owner permissions an owner', () => {
        const input: any = h.postRequest(h.CHAN_ADDOWNER_URL, {
          token: token1,
          channelId: channelId0,
          uId: uId1,
        });
        expect(input).toStrictEqual({});
    });
    */
});
