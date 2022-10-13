
import {
  setData,
  getData,
} from './dataStore';

import {
  isValidAuthUserId,
  isAuthUserMember,
} from './other';
import {
  Channel,
  Data,
  ChannelId,
  UserId,
  Error
} from './data.types';

type ChannelsList = {
  name: string;
  channelId: number
}[];
type ChannelsListReturn = { channels: ChannelsList} | Error;

// ------------------Channels Helper functions------------------
/**
 * The channel ID is the same as its index in the
 * data.channels array. This is to make fetching channel details
 * from their the channel ID easy and ensures unique ID's.
 *
 * @param {}
 * @returns {number} - unique channel id
 */
function generateChannelId() {
  const data: Data = getData();
  const id: number = data.channels.length;
  return id;
}

// ------------------Channels Main functions------------------
/**
 * Returns a list of all channels if user is valid.
 *
 * @param {number, string, boolean} - user ID, channel name, is public
 * @returns {number} - channel ID
 */
function channelsCreateV1(authUserId: number, name: string, isPublic: boolean): ChannelId | Error {
  const maxChars = 20;
  const minChars = 1;
  if (name.length > maxChars || name.length < minChars) {
    return { error: 'Channels name must be between 1-20 characters (inclusive)' };
  }
  if (!isValidAuthUserId(authUserId)) {
    return { error: 'Invalid User ID' };
  }

  const userId: UserId = { uId: authUserId };
  const channelId = generateChannelId();
  const channel: Channel = {
    channelId: channelId,
    name: name,
    isPublic: isPublic,
    ownerMembers: [userId],
    allMembers: [userId],
    messages: [],
  };

  const data = getData();
  data.channels.push(channel);
  setData(data);

  return {
    channelId: channelId,
  };
}

/**
 * Returns a list of all channels if user is valid.
 *
 * @param {string} - user ID
 * @returns {Array} - list of channels
 */
function channelsListAllV1(authUserId: number): ChannelsListReturn {
  // check if authUserId is valid
  if (isValidAuthUserId(authUserId) === false) {
    return { error: 'Invalid user ID' };
  }

  // check all created channels
  const channels: ChannelsList;
  const data: Data = getData();

  for (const channel of data.channels) {
    channels.push(<Channel>{ name: channel.name, channelId: channel.channelId });
  }
  return { channels };
}

/**
 * Returns a list of all channels a user is a member of
 *
 * @param {string} - user ID
 * @returns {Array} - list of channels
 */

function channelsListV1(authUserId: number): ChannelsListReturn {
  if (!isValidAuthUserId(authUserId)) {
    return { error: 'Invalid User ID' };
  }

  const data: Data = getData();
  const usersChannels: ChannelsList = [];

  for (const channel of data.channels) {
    if (isAuthUserMember(authUserId, channel.channelId)) {
      usersChannels.push({ name: channel.name, channelId: channel.channelId });
    }
  }
  return { channels: usersChannels };
}

export {
  channelsListAllV1,
  channelsCreateV1,
  channelsListV1,
};
