import * as h from './test.helper';

// Setup
let tokenGlobalOwner: string;
let tokenChanMember : string;
let tokenChanOwner : string;
let uIdGlobalOwner: number;
let uIdChanMember: number;
let uIdChanOwner: number;
let channelId0: number;
let channelId1: number;
let invalidChannelId: number;
let invalidUid: number;
let tmp: any;
beforeEach(() => {
  // tokens 0,1 and 2
  tmp = h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });
  uIdGlobalOwner = tmp.uId;
  tokenGlobalOwner = tmp.token;

  tmp = h.postRequest(h.REGISTER_URL, {
    email: h.email1,
    password: h.password1,
    nameFirst: h.firstName1,
    nameLast: h.lastName1,
  });
  uIdChanOwner = tmp.uId;
  tokenChanOwner = tmp.token;

  tmp = h.postRequest(h.REGISTER_URL, {
    email: h.email2,
    password: h.password2,
    nameFirst: h.firstName2,
    nameLast: h.lastName2,
  });
  uIdChanMember = tmp.uId;
  tokenChanMember = tmp.token;

  // Channels 0 and private
  tmp = h.postRequest(h.CHAN_CREATE_URL, {
    token: tokenChanOwner,
    name: h.channelName0,
    isPublic: h.isPublic,
  });

  channelId0 = parseInt(tmp.channelId);
  invalidChannelId = Math.abs(channelId0) + 10;
  invalidUid = Math.abs(uIdChanMember) + Math.abs(uIdChanOwner) + Math.abs(uIdGlobalOwner) + 10;
  // add user1
  h.postRequest(h.CHAN_JOIN_URL, {
    token: tokenChanMember,
    channelId: channelId0,
  });
  h.postRequest(h.CHAN_JOIN_URL, {
    token: tokenGlobalOwner,
    channelId: channelId0,
  });
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('Invalid Channel Id', () => {
    const data = h.postRequest(h.CHAN_ADD_OWNER_URL, {
      token: tokenChanOwner,
      channelId: invalidChannelId,
      uId: uIdChanMember,
    });
    expect(data).toStrictEqual({ error: 'Invalid channel Id' });
  });
  test('Invalid Channel uId', () => {
    const data = h.postRequest(h.CHAN_ADD_OWNER_URL, {
      token: tokenChanOwner,
      channelId: channelId0,
      uId: invalidUid,
    });
    expect(data).toStrictEqual({ error: 'Invalid uId' });
  });
  test('Invalid Channel uId', () => {
    const data = h.postRequest(h.CHAN_ADD_OWNER_URL, {
      token: tokenChanOwner,
      channelId: channelId0,
      uId: invalidUid,
    });
    expect(data).toStrictEqual({ error: 'Invalid uId' });
  });
});
