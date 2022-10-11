// @ts-nocheck
import {
  setData,
  getData,
} from './dataStore.ts';

import {
  isValidAuthUserId,
  isValidChannelId,
  isAuthUserMember,
  getChannelDetailsFromId,
  getUserDetailsFromId,
} from './other.ts';

import {
  userProfileV1,
} from './users.ts';



//------------------ Channel Helper functions------------------

/**
 * Given a channelId, checks if the channel is private. Return false is public, true if private.
 * @param {number} - channelId
 * @returns {boolean} - is channel private
 */
function isChannelPrivate (channelId) {
  const data = getData();
  
  for(let channel of data.channels) {
    if(channel.channelId === channelId) {
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
  
  for(let user of data.users) {
    if(user.uId === authUserId) {
      if (user.globalPermission !== 'owner') {
        return false;
      }
    }
  }
  
  return true;
}






//------------------Channel Main functions------------------

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

  // check if authUserId is valid
  if (!isValidAuthUserId(authUserId)) {
    return {error: 'Invalid User Id'};
  }
  // check if channelId is valid
  if (!isValidChannelId(channelId)) {
    return {error: 'Invalid channel Id'};
  }
  // if valid channelId, check if user is member of channel 
  if (!isAuthUserMember(authUserId, channelId)) {
    return {error: 'User is not a member of this channel'};
  }

  let data = getData();

  let channel = getChannelDetailsFromId(channelId);

  let ownerMembersDetailsList = ownerMemberDetails(channelId);
  let userMemberDetailsList = userMemberDetails(channelId);

  let channelDetails = {
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
  const data = getData();
  let memberDetailsList = [];

  let channel = getChannelDetailsFromId(channelId);

  for (let member of channel.allMembers) {

    let memberDetails = getUserDetailsFromId(member.uId);

      memberDetailsList.push({
        uId: memberDetails.uId, 
        email: memberDetails.email, 
        nameFirst: memberDetails.nameFirst, 
        nameLast: memberDetails.nameLast, 
        handleStr: memberDetails.handleStr
      })
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
 
  const data = getData();
  let ownerDetailsList = [];
  let channel = getChannelDetailsFromId(channelId);

  for (let owner of channel.ownerMembers) {

    let ownerDetails = getUserDetailsFromId(owner.uId);

      ownerDetailsList.push({
        uId: ownerDetails.uId, 
        email: ownerDetails.email, 
        nameFirst: ownerDetails.nameFirst, 
        nameLast: ownerDetails.nameLast, 
        handleStr: ownerDetails.handleStr
      })
  return ownerDetailsList;
  }
}

  






/**
 * Given a channelId of a channel that the authorised user can join, adds them to that channel.
 * @param {number, number} - user id and channel id
 * @returns {} 
 */

function channelJoinV1(authUserId, channelId) {

  if (!isValidChannelId(channelId)) {
    return{error: 'Invalid channel Id'};
  
  
  } else if (!isValidAuthUserId(authUserId)) {
    return{error: 'Invalid User Id'};
      
  } else if (isAuthUserMember(authUserId, channelId)) {
    return{error: 'User is already a member of the channel'};
  
  } else if (isChannelPrivate(channelId) 
            && !isAuthUserMember(authUserId, channelId) 
            && !isGlobalOwner(authUserId)) {
    return{error: 'Private channel'};
  }

  const data = getData();
  let channel = getChannelDetailsFromId(channelId);
  channel.allMembers.push({uId: authUserId});
  data.channels[channelId] = channel;
  setData(data);

  return {};
}

/**
 *Invites a user with ID uId to join a channel with ID channelId.
 * @param {number, number, number} - authUserId, channelId and uId
 * @returns {} 
 */

function channelInviteV1( authUserId, channelId, uId ) {

	if (isValidChannelId(channelId) === false) {
    return{error: 'Invalid channel Id'};
  
  } else if (isValidAuthUserId(authUserId) === false) {
    return{error: 'Invalid User Id'};
      
  } else if (isAuthUserMember(uId, channelId) === true) {
    return{error: 'User is already a member of the channel'};
  
  } else if (isAuthUserMember(authUserId, channelId) === false) {
    const authUser = userProfileV1(authUserId, authUserId);
    if (authUser.globalPermission !== 'owner') {
      return {error: "User is not a member of the channel"};
    }
  } else if (isValidAuthUserId(uId) === false) {
    return{error: 'Invalid User Id'};

  } 

  const data = getData();

  for (let channel of data.channels) {
    if (channel.channelId === channelId) {
      channel.allMembers.push({uId: uId});
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

function channelMessagesV1( authUserId, channelId, start ){


  if (isValidChannelId(channelId) === false) {
    return {error: 'Invalid channel Id'};
  }

  let data = getData();
  let channel;
  for (let x of data.channels) {
    if (x.channelId === channelId) {
      channel = x;
    }

  }
  const numMessages = channel.messages.length;

  if (start >= numMessages) {
    return {error: 'Messages start too high'};

  } else if (isValidAuthUserId(authUserId) === false) {
    return{error: 'Invalid User Id'};
  
  } else if (isAuthUserMember(authUserId, channelId) === false) {
    return{error: 'User is not a member of the channel'};

  }
  let end = 0;
  const Messages = channel.messages;
  
  if (start + 50 <= numMessages) {
    end = start + 50;
  } else {
    end = -1;
  }

let messages = [];

if (end !== -1) {
  let loopEnd = start + 50;
  for (let i = start; i < loopEnd; i++) {
    messages.push(Messages[i]);
  }
    return{		
      messages,
      start,
      end,
    };
} else {
  for (let i = start; i < numMessages; i++) {
    messages.push(Messages[i]);
  }
    return{		
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
}
