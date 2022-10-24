
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
  PageMessages,
  PAGE_SIZE,
  NO_MORE_PAGES
} from './data.types';

// ////////////////////////////////////////////////////// //
//                      channelDetailsV1                  //
// ////////////////////////////////////////////////////// //

/**
 *Given a channel with ID channelId that the authorised user is
 *a member of, provides basic details about the channel.
 * @param {number, number} - uId
 * @returns {ChannelDetails} - channel name
 */

function channelDetailsV1(authUserId: number, channelId: number) : ChannelDetails | Error {
  if (!isValidAuthUserId(authUserId)) {
    return { error: 'Invalid User Id' };
  }

  if (!isValidChannelId(channelId)) {
    return { error: 'Invalid channel Id' };
  }

  if (!isAuthUserMember(authUserId, channelId)) {
    return { error: 'User is not a member of this channel' };
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
//                      channelJoinV1                     //
// ////////////////////////////////////////////////////// //
/**
 * Given a channelId of a channel that the authorised user can
 * join, adds them to that channel.
 * @param {number, number} - user id and channel id
 * @returns {}
 */

function channelJoinV1(authUserId: number, channelId: number) {
  if (!isValidChannelId(channelId)) {
    return { error: 'Invalid channel Id' };
  } else if (!isValidAuthUserId(authUserId)) {
    return { error: 'Invalid User Id' };
  } else if (isAuthUserMember(authUserId, channelId)) {
    return { error: 'User is already a member of the channel' };
  } else if (isChannelPrivate(channelId) &&
            !isAuthUserMember(authUserId, channelId) &&
            !isGlobalOwner(authUserId)) {
    return { error: 'Private channel' };
  }

  const data: DataStore = getData();
  const index = data.channels.findIndex(a => a.channelId === channelId);
  data.channels[index].allMembers.push({ uId: authUserId });
  setData(data);

  return {};
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
  const authUserId = getUIdFromToken(token);

  if (!isValidChannelId(channelId)) {
    return { error: 'Invalid channel Id' };
  } else if (isAuthUserMember(authUserId, channelId)) {
    return { error: 'User is already a member of the channel' };
  } else if (isChannelPrivate(channelId) &&
  !isAuthUserMember(authUserId, channelId) &&
  !isGlobalOwner(authUserId)) {
    return { error: 'Private channel' };
  } else if (!isValidToken(token)) {
    return { error: 'Invalid Token' };
  }

  const data: DataStore = getData();
  const index = data.channels.findIndex(a => a.channelId === channelId);
  data.channels[index].allMembers.push({ uId: authUserId });
  setData(data);
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

function channelInviteV1(authUserId: number, channelId: number, uId: number) {
  if (!isValidChannelId(channelId)) {
    return { error: 'Invalid channel Id' };
  } else if (!isValidAuthUserId(authUserId)) {
    return { error: 'Invalid User Id' };
  } else if (isAuthUserMember(uId, channelId)) {
    return { error: 'User is already a member of the channel' };
  } else if (!isAuthUserMember(authUserId, channelId)) {
    const authUser = getUserStoreFromId(authUserId);
    if (authUser.globalPermission !== 'owner') {
      return { error: 'User is not a member of the channel' };
    }
  } else if (!isValidAuthUserId(uId)) {
    return { error: 'Invalid User Id' };
  }

  const data: DataStore = getData();
  // Replace this
  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      channel.allMembers.push({ uId: uId });
    }
  }
  setData(data);
  return {};
}

function channelInviteV2(token: string, channelId: number, uId: number): channelInviteReturn {
  const authUserId: number = getUIdFromToken(token);

  if (!isValidChannelId(channelId)) {
    return { error: 'Invalid channel Id' };
  } else if (!isValidAuthUserId(uId)) {
    return { error: 'Invalid uId' };
  } else if (isAuthUserMember(uId, channelId)) {
    return { error: 'User is already a member of the channel' };
  } else if (!isAuthUserMember(authUserId, channelId)) {
    const authUser = getUserStoreFromId(authUserId);
    if (authUser.globalPermission !== 'owner') {
      return { error: 'User is not a member of the channel' };
    }
  } else if (!isValidToken(token)) {
    return { error: 'token is invalid!' };
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

function channelMessagesV1(
  token: string,
  channelId: number,
  start: number
): PageMessages | Error {
  if (!isValidChannelId(channelId)) {
    return { error: 'Invalid channel Id' };
  }
  const channelStore: ChannelStore = getChannelStoreFromId(channelId);
  const messages: Message[] = channelStore.messages;
  const numMessages = messages.length;

  if (start > numMessages) {
    return { error: 'Messages start too high' };
  } else if (!isValidToken(token)) {
    return { error: 'Invalid Token' };
  } else if (!isTokenMemberOfChannel(token, channelId)) {
    return { error: 'User is not a member of the channel' };
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
// ------------------ Channel Helper functions------------------
/**
 * Return a list containing owners and their details
 * of a given channel ID
 * @param {number, number} - user id and channel id
 * @returns {Array} list of objects containing owner details
 */
function getChannelOwners (channelId: number): User[] {
  const channelStore: ChannelStore = getChannelStoreFromId(channelId);

  // commenting out for now to pass linter checks
  // for (const owner of channel.ownerMembers) {

  const uId: number = channelStore.ownerMembers[0].uId;
  const userStore: UserStore = getUserStoreFromId(uId);
  const owner: User = {
    uId: userStore.uId,
    email: userStore.email,
    nameFirst: userStore.nameFirst,
    nameLast: userStore.nameLast,
    handleStr: userStore.handleStr
  };
  return [owner];
  // }
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

export {
  channelDetailsV1,
  channelJoinV1,
  channelInviteV1,
  channelMessagesV1,
  channelInviteV2,
};
