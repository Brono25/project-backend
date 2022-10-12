
import {
  setData,
  getData,
} from './dataStore';

/**
 * Set data back to initial state.
 * @param {}
 * @returns {}
 */
function clearV1() {
  let data = getData();
  data = {
    users: [],
    channels: [],
  };
  setData(data);
  return {};
}

/**
 * @param {string} - users handle
 * @returns {boolean} - is handle unique
 */
function isValidAuthUserId(authUserId) {
  const data = getData();

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

function isValidChannelId(channelId) {
  const data = getData();

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
function isAuthUserMember(authUserId, channelId) {
  const data = getData();
  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      if (channel.allMembers.find(a => a.uId === authUserId)) {
        return true;
      }
    }
  }

  return false;
}

function getUserDetailsFromId(uId) {
  const data = getData();

  for (const user of data.users) {
    if (user.uId === uId) {
      return user;
    }
  }
  return {};
}

function getChannelDetailsFromId(channelId) {
  const data = getData();

  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      return channel;
    }
  }
  return {};
}

export {
  clearV1,
  isValidAuthUserId,
  isValidChannelId,
  isAuthUserMember,
  getUserDetailsFromId,
  getChannelDetailsFromId,
};
