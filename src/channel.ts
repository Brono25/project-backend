
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
  isActiveToken,
} from './other';

import {
  DataStore,
  ChannelStore,
  ChannelDetails,
  User,
  UserStore,
  Message,
  ChannelMessagesReturn,
  Error
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

// ////////////////////////////////////////////////////// //
//                     channelMessagesV1                  //
// ////////////////////////////////////////////////////// //

/**
 * Given a channel with ID channelId that the authorised user
 * is a member of, returns up to 50 messages between index "start" and "start + 50".
 * @param {number, number, number} - authUserId, channelId, start
 * @returns {ChannelMessagesReturn} - { messages, start, end }
 */

function channelMessagesV1(
  authUserId: number,
  channelId: number,
  start: number
): ChannelMessagesReturn {
  if (isValidChannelId(channelId) === false) {
    return { error: 'Invalid channel Id' };
  }
  const channelStore: ChannelStore = getChannelStoreFromId(channelId);
  const messages: Message[] = channelStore.messages;
  const numMessages = messages.length;

  if (start >= numMessages) {
    return { error: 'Messages start too high' };
  } else if (isValidAuthUserId(authUserId) === false) {
    return { error: 'Invalid User Id' };
  } else if (isAuthUserMember(authUserId, channelId) === false) {
    return { error: 'User is not a member of the channel' };
  }
  
  const MAX_MSG_RETURN = 50;
  const NO_MORE_MSGS = -1;
  let end = 0;
  if (start + MAX_MSG_RETURN <= numMessages) {
    end = start + MAX_MSG_RETURN;
  } else {
    end = NO_MORE_MSGS;
  }

  const lastFiftyorLessMessages: Message[] = [];

  if (end !== NO_MORE_MSGS) {
    const loopEnd = start + 50;
    for (let i = start; i < loopEnd; i++) {
      lastFiftyorLessMessages.push(messages[i]);
    }
    return <ChannelMessagesReturn>{
      messages,
      start,
      end,
    };
  } else {
    for (let i = start; i < numMessages; i++) {
      lastFiftyorLessMessages.push(messages[i]);
    }
    return <ChannelMessagesReturn>{
      messages,
      start,
      end,
    };
  }
};

// ////////////////////////////////////////////////////// //
//                     channeladdOwnerV1                  //
// ////////////////////////////////////////////////////// //

/**
 * Make user with user id uId an owner of the channel.
 * 
 * @param {string, number, number} - token, channelId, uId
 * @returns {}
 */
function channeladdOwnerV1(token: string, channelId: number, uId: number): any {
  const authUser = getUserStoreFromId(uId);
  if (!isValidChannelId(channelId)) {
    return { error: 'Invalid channel Id' };
  } else if (!isValidAuthUserId(uId)) {
    return { error: 'Invalid User Id' };
  }  else if (!isAuthUserMember(uId, channelId)) {
      return { error: 'User is not a member of the channel' };
  } else if (authUser.globalPermission === 'member') {
    return { error: 'User does not have owner permissions' };
  } else if (isActiveToken(token) === false) {
    return { error: 'Invalid token'};
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
};
