import HTTPError from 'http-errors';
import {
  setData,
  getData,
} from './dataStore';

import {
  isAuthUserMember,
  getUIdFromToken,
  isValidToken,
  updateUserChannelsJoinedStat,
  updateNumChannelsExistStat,
} from './other';
import {
  ChannelStore,
  DataStore,
  ChannelId,
  Channel,
  UserId,
  ChanCreateReturn,
  Error,
  JOIN,
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
export function channelsCreateV2(
  token: string,
  name: string,
  isPublic: boolean
): ChanCreateReturn {
  isValidToken(token);

  const maxChars = 20;
  const minChars = 1;
  if (name.length > maxChars || name.length < minChars) {
    throw HTTPError(400, 'Channels name must be between 1-20 characters (inclusive)');
  }

  const authUserId = getUIdFromToken(token);
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

  updateUserChannelsJoinedStat(authUserId, JOIN);
  updateNumChannelsExistStat();
  return channelId;
}

// ////////////////////////////////////////////////////// //
//                    channelsListAllV2                  //
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

export function channelsListAllV2(token: string): ChannelsListReturn {
  isValidToken(token);

  // check all created channels
  const channels: Channel[] = [];
  const data: DataStore = getData();

  for (const channel of data.channels) {
    channels.push(<Channel>{ name: channel.name, channelId: channel.channelId });
  }
  return { channels };
}

// ////////////////////////////////////////////////////// //
//                     channelsListV2                     //
// ////////////////////////////////////////////////////// //
/**
 * Returns a list of all channels a user with an active token is a member of.
 *
 * @param {string} - token
 * @returns {Array} - list of channels
 */

export function channelsListV2(token: string): ChannelsListReturn {
  isValidToken(token);

  const data: DataStore = getData();
  const usersChannels: Channel[] = [];
  const uId: number = getUIdFromToken(token);

  for (const channel of data.channels) {
    if (isAuthUserMember(uId, channel.channelId)) {
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
