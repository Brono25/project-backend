import * as h from './test.helper';

// Setup: Create 3 users and register them to a channel (using channel join)
let authUser0: any;
let authUser2: any;
let authUser1: any;
let authUserId0: number;
let authUserId1: number;
let authUserId2: number;
let authUserToken0: string;
let authUserToken1: string;
let authUserToken2: string;
beforeEach(() => {
  authUser0 = h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });
  authUserId0 = authUser0.authUserId;
  authUserToken0 = authUser0.token;
  authUser1 = h.postRequest(h.REGISTER_URL, {
    email: h.email1,
    password: h.password1,
    nameFirst: h.firstName1,
    nameLast: h.lastName1,
  });
  authUserId1 = authUser1.authUserId;
  authUserToken1 = authUser1.token;
  authUser2 = h.postRequest(h.REGISTER_URL, {
    email: h.email2,
    password: h.password2,
    nameFirst: h.firstName2,
    nameLast: h.lastName2,
  });
  authUserId2 = authUser2.authUserId;
  authUserToken2 = authUser2.token;
});

// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
    test('Incorrect token', () => {
      const data = h.postRequest(h.LOGOUT_URL, {
        token: 'invalidToken',
        channelId: 'change this later',
      });
      expect(data).toStrictEqual({ error: expect.any(String) });
    });

    test('Invalid channelId', () => {
        const data = h.postRequest(h.LOGOUT_URL, {
          token: 'invalidToken',
        });
        expect(data).toStrictEqual({ error: expect.any(String) });
    });

    test('User is not a member of channel', () => {
        const data = h.postRequest(h.LOGOUT_URL, {
          token: 'invalidToken',
        });
        expect(data).toStrictEqual({ error: expect.any(String) });
      });
  
});

// test when only one channel member, test when more than one channel member

// NOTE: if user is an owner also remove from owner list. Create helper function to check if user is an owner of the channel.