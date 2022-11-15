import HTTPError from 'http-errors';
import {
  setData,
  getData,
} from './dataStore';

import {
  isValidAuthUserId,
  isValidChannelId,
  isAuthUserMember,
  getChannelStoreFromId,
  getUserStoreFromId,
  isGlobalOwner,
  getUIdFromToken,
  isValidToken,
  isTokenMemberOfChannel,
  isUIdOwnerOfChannel,
  isTokenOwnerOfChannel,
  doesTokenHaveChanOwnerPermissions,
  updateUserChannelsJoinedStat,
} from './other';

import {
  DataStore,
  ChannelStore,
  ChannelDetails,
  User,
  UserStore,
  Message,
  Error,
  channelInviteReturn,
  ChannelJoinReturn,
  ChanAddOwnerReturn,
  PageMessages,
  PAGE_SIZE,
  NO_MORE_PAGES,
  ChannelLeaveReturn,
  LEAVE,
  JOIN,
} from './data.types';

// ////////////////////////////////////////////////////// //
//                      channelDetails                    //
// ////////////////////////////////////////////////////// //

export function channelDetailsV2(token: string, channelId: number) : ChannelDetails | Error {
  isValidToken(token);
  isValidChannelId(channelId);

  if (!isTokenMemberOfChannel(token, channelId)) {
    throw HTTPError(403, 'Invalid channel id');
  }

  const channelStore: ChannelStore = getChannelStoreFromId(channelId);
  const ownerMembersDetailsList: User[] = getChannelOwners(channelId);
  const getChannelMembersList: User[] = getChannelMembers(channelId);

  const channelDetails: ChannelDetails = {
    name: channelStore.name,
    isPublic: channelStore.isPublic,
    ownerMembers: ownerMembersDetailsList,
    allMembers: getChannelMembersList,
  };

  return channelDetails;
}

// ////////////////////////////////////////////////////// //
//                      channelJoinV2                     //
// ////////////////////////////////////////////////////// //
/**
 * Given a channelId of a channel that the authorised user can
 * join, adds them to that channel.
 * @param {string, number} - token and channel id
 * @returns {}
 */
export function channelJoinV2(
  token: string,
  channelId: number
): ChannelJoinReturn {
  isValidToken(token);
  isValidChannelId(channelId);

  const authUserId = getUIdFromToken(token);

  if (isAuthUserMember(authUserId, channelId)) {
    throw HTTPError(400, 'User is not a member');
  } else if (isChannelPrivate(channelId) &&
  !isAuthUserMember(authUserId, channelId) &&
  !isGlobalOwner(authUserId)) {
    throw HTTPError(400, 'Channel is private');
  }

  const data: DataStore = getData();
  const index = data.channels.findIndex(a => a.channelId === channelId);
  data.channels[index].allMembers.push({ uId: authUserId });
  setData(data);
  updateUserChannelsJoinedStat(authUserId, JOIN);
  return {};
}
// ////////////////////////////////////////////////////// //
//                      channelLeaveV1                    //
// ////////////////////////////////////////////////////// //
/**
 * Given a channelId of a channel that the authorised user can
 * leave, removes them from that channel.
 * @param {string, number} - token and channel id
 * @returns {}
 */
export function channelLeaveV1(
  token: string,
  channelId: number
): ChannelLeaveReturn {
  isValidToken(token);
  isValidChannelId(channelId);
  const authUserId = getUIdFromToken(token);

  if (!isAuthUserMember(authUserId, channelId)) {
    throw HTTPError(403, 'User is not a member');
  }
  const data: DataStore = getData();
  const channelStore: ChannelStore = getChannelStoreFromId(channelId);
  const indexOfChannel = data.channels.findIndex(a => a.channelId === channelId);

  const indexOfMember = channelStore.allMembers.findIndex(a => a.uId === authUserId);
  channelStore.allMembers.splice(indexOfMember, 1);

  if (isTokenOwnerOfChannel(token, channelId) === true) {
    const indexOfOwner = channelStore.ownerMembers.findIndex(a => a.uId === authUserId);
    channelStore.ownerMembers.splice(indexOfOwner, 1);
  }
  data.channels[indexOfChannel] = channelStore;
  setData(data);
  updateUserChannelsJoinedStat(authUserId, LEAVE);
  return {};
}

// ////////////////////////////////////////////////////// //
//                     channelInviteV1                    //
// ////////////////////////////////////////////////////// //
/**
 *Invites a user with ID uId to join a channel with ID channelId.
 * @param {number, number, number} - authUserId, channelId and uId
 * @returns {}
 */
export function channelInviteV2(token: string, channelId: number, uId: number): channelInviteReturn {
  isValidToken(token);
  isValidChannelId(channelId);
  const authUserId: number = getUIdFromToken(token);

  if (!isValidAuthUserId(uId)) {
    throw HTTPError(400, 'User is not autherised');
  } else if (isAuthUserMember(uId, channelId)) {
    throw HTTPError(400, 'User is already a member of the channel');
  } else if (!isAuthUserMember(authUserId, channelId) && !isGlobalOwner(authUserId)) {
    throw HTTPError(403, 'User is not a member of the channel');
  }
  const data: DataStore = getData();
  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      channel.allMembers.push({ uId: uId });
    }
  }
  setData(data);
  return {};
}

// ////////////////////////////////////////////////////// //
//                     channelMessagesV1                  //
// ////////////////////////////////////////////////////// //

/**
 * Given a channel with ID channelId that the authorised user
 * is a member of, returns up to 50 messages between index "start"
 * and "start + 50".
 * @param {number, number, number} - authUserId, channelId, start
 * @returns {ChannelMessages | Error} - { messages, start, end }
 */

export function channelMessagesV1(
  token: string,
  channelId: number,
  start: number
): PageMessages | Error {
  isValidToken(token);
  isValidChannelId(channelId);

  const channelStore: ChannelStore = getChannelStoreFromId(channelId);
  const messages: Message[] = channelStore.messages;
  const numMessages = messages.length;

  if (start > numMessages) {
    throw HTTPError(400, 'Invalid start');
  } else if (!isTokenMemberOfChannel(token, channelId)) {
    throw HTTPError(403, 'User is not a member');
  } else if (start === numMessages) {
    return <PageMessages>{
      messages: [],
      start: start,
      end: NO_MORE_PAGES,
    };
  }

  let end = start + PAGE_SIZE;
  const page: Message[] = messages.slice(start, end);
  if (page.length < PAGE_SIZE) {
    end = NO_MORE_PAGES;
  }
  return <PageMessages>{
    messages: page,
    start: start,
    end: end,
  };
}

// ////////////////////////////////////////////////////// //
//                     channelRemoveOwner                 //
// ////////////////////////////////////////////////////// //

/**
 * @param {string, number, number}
 * @returns {}
 */
export function channelRemoveOwnerV1(token: string, channelId: number, uId: number): object | Error {
  isValidToken(token);
  isValidChannelId(channelId);

  if (!isValidAuthUserId(uId)) {
    throw HTTPError(400, 'User is not autherised');
  }
  if (!isUIdOwnerOfChannel(uId, channelId)) {
    throw HTTPError(400, 'User is not a channel owner');
  }
  if (!doesTokenHaveChanOwnerPermissions(token, channelId)) {
    throw HTTPError(403, 'AuthUser does not have owner permissions');
  }
  const channelStore: ChannelStore = getChannelStoreFromId(channelId);
  if (channelStore.ownerMembers.length === 1) {
    throw HTTPError(400, 'Owner is last member');
  }
  let index: number = channelStore.ownerMembers.findIndex(a => a.uId === uId);
  channelStore.ownerMembers.splice(index, 1);
  const data: DataStore = getData();
  index = data.channels.findIndex(a => a.channelId === channelStore.channelId);
  data.channels[index] = channelStore;
  setData(data);

  return {};
}

// ////////////////////////////////////////////////////// //
//                     channelAddOwnerV1                  //
// ////////////////////////////////////////////////////// //
/**
 * Given a channel with ID channelId that the authorised user (uId)
 * is a member of, adds the user to the list of channel owners.
 * @param {string, number, number} - token, channelId, uId
 * @returns {}
 */
export function channelAddOwnerV1(token: string, channelId: number, uId: number): ChanAddOwnerReturn {
  isValidToken(token);
  isValidChannelId(channelId);
  if (!isValidAuthUserId(uId)) {
    throw HTTPError(400, 'User is not autherised');
  }
  if (!isAuthUserMember(uId, channelId)) {
    throw HTTPError(400, 'User is not a member');
  }
  if (isUIdOwnerOfChannel(uId, channelId)) {
    throw HTTPError(400, 'User is already an owner');
  }
  if (!doesTokenHaveChanOwnerPermissions(token, channelId)) {
    throw HTTPError(403, 'User does not have owner permissions');
  }

  const data: DataStore = getData();
  const channel: ChannelStore = getChannelStoreFromId(channelId);
  const index: number = data.channels.findIndex(a => a.channelId === channel.channelId);
  channel.ownerMembers.push({ uId: uId });
  data.channels[index] = channel;
  setData(data);
  return {};
}

// ------------------ Channel Helper functions------------------
/**
 * Return a list containing owners and their details
 * of a given channel ID
 * @param {number, number} - user id and channel id
 * @returns {Array} list of objects containing owner details
 */
function getChannelOwners (channelId: number): User[] {
  const channelStore: ChannelStore = getChannelStoreFromId(channelId);

  const owners: User[] = [];

  for (const ownerId of channelStore.ownerMembers) {
    const uId: number = ownerId.uId;
    const userStore: UserStore = getUserStoreFromId(uId);
    const owner: User = {
      uId: userStore.uId,
      email: userStore.email,
      nameFirst: userStore.nameFirst,
      nameLast: userStore.nameLast,
      handleStr: userStore.handleStr
    };
    owners.push(owner);
  }
  return owners;
}

/**
 * Return a list containing all members and their details
 * of a given channel ID
 * @param {number} - channel ID
 * @returns {Array} list of objects containing members details
 */
function getChannelMembers (channelId: number) : User[] {
  const channel: ChannelStore = getChannelStoreFromId(channelId);
  const members: User[] = [];

  for (const member of channel.allMembers) {
    const userStore: UserStore = getUserStoreFromId(member.uId);

    members.push({
      uId: userStore.uId,
      email: userStore.email,
      nameFirst: userStore.nameFirst,
      nameLast: userStore.nameLast,
      handleStr: userStore.handleStr
    });
  }
  return members;
}

/**
 * Given a channelId, checks if the channel is private. Return false is public, true if private.
 * @param {number} - channelId
 * @returns {boolean} - is channel private
 */
function isChannelPrivate (channelId: number) {
  const data: DataStore = getData();

  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      if (channel.isPublic === true) {
        return false;
      }
    }
  }
  return true;
}
