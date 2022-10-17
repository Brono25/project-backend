
import {
  setData,
  getData,
} from './dataStore';

import {
  isValidAuthUserId,
  isAuthUserMember,
  isActiveToken,
  findTokenOwner,
} from './other';
import {
  ChannelStore,
  DataStore,
  ChannelId,
  Channel,
  UserId,
  ChanCreateReturn,
  Error,
} from './data.types';

// ////////////////////////////////////////////////////// //
//                      channelsCreateV1                  //
// ////////////////////////////////////////////////////// //
/**
 * Returns a list of all channels if user is valid.
 *
 * @param {number, string, boolean} - user ID, channel name, is public
 * @returns {number} - channel ID
 */
function channelsCreateV1(authUserId: number,
  name: string,
  isPublic: boolean
): ChannelId | Error {
  const maxChars = 20;
  const minChars = 1;
  if (name.length > maxChars || name.length < minChars) {
    return { error: 'Channels name must be between 1-20 characters (inclusive)' };
  }
  if (!isValidAuthUserId(authUserId)) {
    return { error: 'Invalid User ID' };
  }

  const userId: UserId = { uId: authUserId };
  const channelId: ChannelId = generateChannelId();
  const channel: ChannelStore = {
    channelId: channelId.channelId,
    name: name,
    isPublic: isPublic,
    ownerMembers: [userId],
    allMembers: [userId],
    messages: [],
  };

  const data: DataStore = getData();
  data.channels.push(channel);
  setData(data);

  return channelId;
}

export function channelsCreateV2(
  token: string,
  name: string,
  isPublic: boolean
): ChanCreateReturn {
  const maxChars = 20;
  const minChars = 1;
  if (name.length > maxChars || name.length < minChars) {
    return { error: 'Channels name must be between 1-20 characters (inclusive)' };
  }
  if (!isActiveToken(token)) {
    return { error: 'Invalid Token' };
  }
  const authUserId = findTokenOwner(token);
  const userId: UserId = { uId: authUserId };
  const channelId: ChannelId = generateChannelId();
  const channel: ChannelStore = {
    channelId: channelId.channelId,
    name: name,
    isPublic: isPublic,
    ownerMembers: [userId],
    allMembers: [userId],
    messages: [],
  };

  const data: DataStore = getData();
  data.channels.push(channel);
  setData(data);

  return channelId;
}

// ////////////////////////////////////////////////////// //
//                    channelsListAllV1                   //
// ////////////////////////////////////////////////////// //

/**
 * Returns a list of all channels if user is valid.
 *
 * @param {string} - user ID
 * @returns {Array} - list of channels
 */
type ChannelsListReturn = {
  channels: {
    name: string;
    channelId: number
  }[];
} | Error;

function channelsListAllV1(authUserId: number): ChannelsListReturn {
  if (isValidAuthUserId(authUserId) === false) {
    return { error: 'Invalid user ID' };
  }

  // check all created channels
  const channels: Channel[] = [];
  const data: DataStore = getData();

  for (const channel of data.channels) {
    channels.push(<Channel>{ name: channel.name, channelId: channel.channelId });
  }
  return { channels };
}

// ////////////////////////////////////////////////////// //
//                     channelsListV1                     //
// ////////////////////////////////////////////////////// //
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

  const data: DataStore = getData();
  const usersChannels: Channel[] = [];

  for (const channel of data.channels) {
    if (isAuthUserMember(authUserId, channel.channelId)) {
      usersChannels.push({ name: channel.name, channelId: channel.channelId });
    }
  }
  return { channels: usersChannels };
}

// ------------------Channels Helper functions------------------
/**
 * The channel ID is the same as its index in the
 * data.channels array. This is to make fetching channel details
 * from their the channel ID easy and ensures unique ID's.
 *
 * @param {}
 * @returns {ChannelId} - unique channel id
 */
function generateChannelId(): ChannelId {
  const data: DataStore = getData();
  const id: number = data.channels.length;
  return { channelId: id };
}

export {
  channelsListAllV1,
  channelsCreateV1,
  channelsListV1,
};
