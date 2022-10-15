
/* import MD5 from 'crypto-md5'; */
const MD5 = require('crypto-md5');
import {
  setData,
  getData,
} from './dataStore';

import {
  DataStore,
  ChannelStore,
  UserStore,
  Token,
} from './data.types';

function getTimeInSecs() {
  const time: number = Math.floor(Date.now() / 1000);
  return time;
}

/**
 * Set data back to initial state.
 * @param {}
 * @returns {}
 */
function generateToken(email: string) {
  const time = getTimeInSecs().toString();
  const token: Token = { token: MD5(time + email.toString().toString()) };
  return token;
}

/**
 * Set data back to initial state.
 * @param {}
 * @returns {}
 */
function clearV1() {
  let data: DataStore = getData();
  data = {
    users: [],
    channels: [],
    activeTokens: [],
    messageIds: [],
  };
  setData(data);
  return {};
}

/**
 * @param {string} - users handle
 * @returns {boolean} - is handle unique
 */
function isValidAuthUserId(authUserId: number) {
  const data: DataStore = getData();

  if (!data.users.length) {
    return false;
  }
  for (const user of data.users) {
    if (user.uId === authUserId) {
      return true;
    }
  }
  return false;
}

/**
 * @param {number} - channel id
 * @returns {boolean} - does channel exist
 */

function isValidChannelId(channelId: number) {
  const data: DataStore = getData();

  if (!data.channels.length) {
    return false;
  }
  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      return true;
    }
  }
  return false;
}

/**
 * @param {number, number} - authorised user's id and channel id
 * @returns {boolean} - is user already member of channel
 */
function isAuthUserMember(authUserId: number, channelId: number) {
  const data: DataStore = getData();
  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      if (channel.allMembers.find(a => a.uId === authUserId)) {
        return true;
      }
    }
  }
  return false;
}

function getUserStoreFromId(uId: number): UserStore {
  const data: DataStore = getData();
  const user: UserStore = data.users.find(a => a.uId === uId);
  return user;
}

function getChannelStoreFromId(channelId: number):ChannelStore {
  const data: DataStore = getData();
  const channel: ChannelStore = data.channels.find(a => a.channelId === channelId);
  return channel;
}
/**
 * @param {number} - uId
 * @returns {boolean} - is user a global owner
 */
function isGlobalOwner (authUserId: number) {
  const user: UserStore = getUserStoreFromId(authUserId);
  if (user.globalPermission === 'owner') {
    return true;
  }
  return false;
}

export {
  clearV1,
  isValidAuthUserId,
  isValidChannelId,
  isAuthUserMember,
  getUserStoreFromId,
  getChannelStoreFromId,
  isGlobalOwner,
  generateToken,
};
