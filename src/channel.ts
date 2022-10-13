
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
} from './other';

import {
  DataStore,
  ChannelStore,
  ChannelDetails,
  User,
  UserStore,
  Error
} from './data.types';

// ------------------ Channel Helper functions------------------

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

/**
 * @param {number} - uId
 * @returns {boolean} - is user a global owner
 */
function isGlobalOwner (authUserId: number) {
  const data: DataStore = getData();

  for (const user of data.users) {
    if (user.uId === authUserId) {
      if (user.globalPermission !== 'owner') {
        return false;
      }
    }
  }
  return true;
}

// ------------------Channel Main functions------------------

/**
 *Given a channel with ID channelId that the authorised user is
 *a member of, provides basic details about the channel.
 * @param {number, number} - authUserId and channelId
 * @returns {} -
 */

/**
 * @param {number} - channelId
 * @param {integer} - uId
 * @returns {string} - channel name
 * @returns {boolean} - isPublic
 * @returns {array} - ownerMembers
 * @returns {array} - allMembers

 *Given a channel with ID channelId that the authorised user is
 *a member of, provides basic details about the channel.
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

  const ownerMembersDetailsList: User[] = getOwners(channelId);
  const getMembersList: User[] = getMembers(channelId);

  const channelDetails: ChannelDetails = {
    name: channelStore.name,
    isPublic: channelStore.isPublic,
    ownerMembers: ownerMembersDetailsList,
    allMembers: getMembersList,
  };

  return channelDetails;
}

/**
 * Return a list containing all members and their details
 * of a given channel ID
 * @param {number} - channel ID
 * @returns {Array} list of objects containing members details
 */
function getMembers (channelId: number) : User[] {
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
 * Return a list containing owners and their details
 * of a given channel ID
 * @param {number, number} - user id and channel id
 * @returns {Array} list of objects containing owner details
 */
function getOwners (channelId: number) {
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
  return owner;
  // }
}

/**
 * Given a channelId of a channel that the authorised user can join, adds them to that channel.
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
  const channelStore: ChannelStore = getChannelStoreFromId(channelId);
  channelStore.allMembers.push({ uId: authUserId });
  setData(data);

  return {};
}

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

  const data: Data = getData();
  // Replace this
  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      channel.allMembers.push({ uId: uId });
    }
  }
  setData(data);
  return {};
}

/**
 * Given a channel with ID channelId that the authorised user
 * is a member of, returns up to 50 messages between index "start" and "start + 50".
 * @param {number, number, number} - authUserId, channelId, start
 * @returns {object} - { messages, start, end }
 */

function channelMessagesV1(authUserId: number, channelId: number, start: number) {
  if (!isValidChannelId(channelId)) {
    return { error: 'Invalid channel Id' };
  }

  const data: Data = getData();
  let channel: Channel;
  for (const x of data.channels) {
    if (x.channelId === channelId) {
      channel = x;
    }
  }
  const numMessages = channel.messages.length;

  if (start >= numMessages) {
    return { error: 'Messages start too high' };
  } else if (isValidAuthUserId(authUserId) === false) {
    return { error: 'Invalid User Id' };
  } else if (isAuthUserMember(authUserId, channelId) === false) {
    return { error: 'User is not a member of the channel' };
  }
  let end = 0;
  const Messages: Message[] = channel.messages;

  if (start + 50 <= numMessages) {
    end = start + 50;
  } else {
    end = -1;
  }

  const messages = [];

  if (end !== -1) {
    const loopEnd = start + 50;
    for (let i = start; i < loopEnd; i++) {
      messages.push(Messages[i]);
    }
    return {
      messages,
      start,
      end,
    };
  } else {
    for (let i = start; i < numMessages; i++) {
      messages.push(Messages[i]);
    }
    return {
      messages,
      start,
      end,
    };
  }
}

export {
  channelDetailsV1,
  channelJoinV1,
  channelInviteV1,
  channelMessagesV1,
};
