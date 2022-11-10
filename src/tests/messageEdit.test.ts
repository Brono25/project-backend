import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup
let token0: string;
let token1 : string;
let uId0: number;
let uId1: number;
let mId0: number;
let mId1: number;
let invalidMId: number;
let channelId0: number;
let tmp: any;
beforeEach(() => {
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  uId0 = parseInt(tmp.authUserId);
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;
  uId1 = parseInt(tmp.authUserId);

  tmp = h.postRequest(h.CHAN_CREATE_URL, h.generateChannelsCreateArgs(0, true), token0);
  channelId0 = parseInt(tmp.channelId);
  tmp = h.postRequest(h.MSG_SEND_URL, { channelId: channelId0, message: h.message0 }, token0);
  mId0 = parseInt(tmp.messageId);
  invalidMId = Math.abs(mId0 + 10);
  tmp = h.postRequest(h.DM_CREATE_URL, { uIds: [] }, token1);
  const dmId0 = parseInt(tmp.dmId);
  tmp = h.postRequest(h.MSG_SEND_DM_URL, { dmId: dmId0, message: h.message1 }, token1);
  mId1 = parseInt(tmp.messageId);
});
// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------///
describe('Error Handling', () => {
  test('Invalid token', () => {
    const data = {
      messageId: mId0,
      message: 'Edited message',
    };
    h.testErrorThrown(h.MSG_EDIT_URL, 'PUT', 403, data, h.invalidToken);
  });
  test('Message too long', () => {
    const data = {
      messageId: mId0,
      message: h.invalidLongMessage,
    };
    h.testErrorThrown(h.MSG_EDIT_URL, 'PUT', 400, data, token0);
  });
  test('Invalid message ID', () => {
    const data = {
      messageId: invalidMId,
      message: h.message0,
    };
    h.testErrorThrown(h.MSG_EDIT_URL, 'PUT', 400, data, token1);
  });
  test('User is not a member of channel which has the message', () => {
    const data = {
      messageId: mId0,
      message: h.message0,
    };
    h.testErrorThrown(h.MSG_EDIT_URL, 'PUT', 403, data, token1);
  });
  test('User is not a member of DM which has the message', () => {
    const data = {
      messageId: mId1,
      message: h.message0,
    };
    h.testErrorThrown(h.MSG_EDIT_URL, 'PUT', 403, data, token0);
  });
  test('Is channel member but doesnt have owner permissions', () => {
    h.postRequest(h.CHAN_JOIN_URL, {
      channelId: channelId0,
    }, token1);
    const data = {
      messageId: mId0,
      message: 'edit',
    };
    h.testErrorThrown(h.MSG_EDIT_URL, 'PUT', 403, data, token1);
  });
  test('Is DM member but doesnt have owner permissions', () => {
    tmp = h.postRequest(h.DM_CREATE_URL, {
      uIds: [uId0]
    }, token1);
    tmp = h.postRequest(h.MSG_SEND_DM_URL, {
      dmId: tmp.dmId,
      message: 'Another DM'
    }, token1);
    const mId = tmp.messageId;
    const data = {
      messageId: mId,
      message: 'edit',
    };
    h.testErrorThrown(h.MSG_EDIT_URL, 'PUT', 403, data, token0);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('Edit own channel message', () => {
    const data = h.putRequest(h.MSG_EDIT_URL, {
      messageId: mId0,
      message: 'Edited message Channel',
    }, token0);
    expect(data).toStrictEqual({});
  });
  test('Edit own channel message to empty', () => {
    const data = h.putRequest(h.MSG_EDIT_URL, {
      messageId: mId0,
      message: '',
    }, token0);
    expect(data).toStrictEqual({});
  });
  test('Edit own DM message', () => {
    const data = h.putRequest(h.MSG_EDIT_URL, {
      messageId: mId1,
      message: 'Edited message DM',
    }, token1);
    expect(data).toStrictEqual({});
  });
  test('Edit own DM message to empty', () => {
    const data = h.putRequest(h.MSG_EDIT_URL, {
      messageId: mId1,
      message: '',
    }, token1);
    expect(data).toStrictEqual({});
  });
  test('Owner edits members DM message', () => {
    tmp = h.postRequest(h.DM_CREATE_URL, {
      uIds: [uId0]
    }, token1);
    tmp = h.postRequest(h.MSG_SEND_DM_URL, {
      dmId: tmp.dmId,
      message: 'Another DM'
    }, token0);
    const mId = tmp.messageId;
    const data = h.putRequest(h.MSG_EDIT_URL, {
      messageId: mId,
      message: 'Edited by owner message DM',
    }, token1);
    expect(data).toStrictEqual({});
  });
  test('Owner edits members channel message', () => {
    tmp = h.postRequest(h.CHAN_JOIN_URL, {
      channelId: channelId0,
    }, token1);

    tmp = h.postRequest(h.MSG_SEND_URL, {
      channelId: channelId0,
      message: 'Member just joined'
    }, token1);
    const mId = tmp.messageId;
    const data = h.putRequest(h.MSG_EDIT_URL, {
      messageId: mId,
      message: 'Edited by owner message channel',
    }, token0);
    expect(data).toStrictEqual({});
  });
  test('Gloabal Owner (not owner member) edits members channel message', () => {
    tmp = h.postRequest(h.CHAN_JOIN_URL, {
      channelId: channelId0,
    }, token1);

    tmp = h.postRequest(h.MSG_SEND_URL, {
      channelId: channelId0,
      message: 'Member just joined'
    }, token1);
    const mId = tmp.messageId;
    h.postRequest(h.CHAN_ADD_OWNER_URL, {
      channelId: channelId0,
      uId: uId1,
    }, token0);
    h.postRequest(h.CHAN_RMV_OWNER_URL, {
      channelId: channelId0,
      uId: uId0,
    }, token0);

    const data = h.putRequest(h.MSG_EDIT_URL, {
      messageId: mId,
      message: 'Edited by global owner message channel',
    }, token0);
    expect(data).toStrictEqual({});
  });
});
