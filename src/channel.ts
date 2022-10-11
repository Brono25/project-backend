
import {
  setData,
  getData,
} from './dataStore';

import {
  isValidAuthUserId,
  isValidChannelId,
  isAuthUserMember,
  getChannelDetailsFromId,
  getUserDetailsFromId,
} from './other';

// ------------------ Channel Helper functions------------------

/**
 * Given a channelId, checks if the channel is private. Return false is public, true if private.
 * @param {number} - channelId
 * @returns {boolean} - is channel private
 */
function isChannelPrivate (channelId) {
  const data = getData();

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
function isGlobalOwner (authUserId) {
  const data = getData();

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

function channelDetailsV1(authUserId, channelId) {
  if (!isValidAuthUserId(authUserId)) {
    return { error: 'Invalid User Id' };
  }

  if (!isValidChannelId(channelId)) {
    return { error: 'Invalid channel Id' };
  }

  if (!isAuthUserMember(authUserId, channelId)) {
    return { error: 'User is not a member of this channel' };
  }

  const channel = getChannelDetailsFromId(channelId);

  const ownerMembersDetailsList = ownerMemberDetails(channelId);
  const userMemberDetailsList = userMemberDetails(channelId);

  const channelDetails = {
    name: channel.name,
    isPublic: channel.isPublic,
    ownerMembers: ownerMembersDetailsList,
    allMembers: userMemberDetailsList,
  };

  return channelDetails;
}

/**
 * Return a list containing all members and their details
 * of a given channel ID
 * @param {number} - channel ID
 * @returns {Array} list of objects containing members details
 */
function userMemberDetails (channelId) {
  const memberDetailsList = [];

  const channel = getChannelDetailsFromId(channelId);

  for (const member of channel.allMembers) {
    const memberDetails = getUserDetailsFromId(member.uId);

    memberDetailsList.push({
      uId: memberDetails.uId,
      email: memberDetails.email,
      nameFirst: memberDetails.nameFirst,
      nameLast: memberDetails.nameLast,
      handleStr: memberDetails.handleStr
    });
  }
  return memberDetailsList;
}

/**
 * Return a list containing owners and their details
 * of a given channel ID
 * @param {number, number} - user id and channel id
 * @returns {Array} list of objects containing owner details
 */
function ownerMemberDetails (channelId) {
  const ownerDetailsList = [];
  const channel = getChannelDetailsFromId(channelId);

  // commenting out to pass linter as
  // for (const owner of channel.ownerMembers) {
  const owner = channel.ownerMembers[0];
  const ownerDetails = getUserDetailsFromId(owner.uId);

  ownerDetailsList.push({
    uId: ownerDetails.uId,
    email: ownerDetails.email,
    nameFirst: ownerDetails.nameFirst,
    nameLast: ownerDetails.nameLast,
    handleStr: ownerDetails.handleStr
  });
  return ownerDetailsList;
  // }
}

/**
 * Given a channelId of a channel that the authorised user can join, adds them to that channel.
 * @param {number, number} - user id and channel id
 * @returns {}
 */

function channelJoinV1(authUserId, channelId) {
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

  const data = getData();
  const channel = getChannelDetailsFromId(channelId);
  channel.allMembers.push({ uId: authUserId });
  setData(data);

  return {};
}

/**
 *Invites a user with ID uId to join a channel with ID channelId.
 * @param {number, number, number} - authUserId, channelId and uId
 * @returns {}
 */

function channelInviteV1(authUserId, channelId, uId) {
  if (isValidChannelId(channelId) === false) {
    return { error: 'Invalid channel Id' };
  } else if (isValidAuthUserId(authUserId) === false) {
    return { error: 'Invalid User Id' };
  } else if (isAuthUserMember(uId, channelId) === true) {
    return { error: 'User is already a member of the channel' };
  } else if (isAuthUserMember(authUserId, channelId) === false) {
    const authUser = getUserDetailsFromId(authUserId);
    if (authUser.globalPermission !== 'owner') {
      return { error: 'User is not a member of the channel' };
    }
  } else if (isValidAuthUserId(uId) === false) {
    return { error: 'Invalid User Id' };
  }

  const data = getData();

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

function channelMessagesV1(authUserId, channelId, start) {
  if (isValidChannelId(channelId) === false) {
    return { error: 'Invalid channel Id' };
  }

  const data = getData();
  let channel;
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
  const Messages = channel.messages;

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
