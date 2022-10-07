import {
  setData,
  getData,
} from './dataStore.js';

import {
  isValidAuthUserId,
  isValidChannelId,
  isAuthUserMember,
} from './other.js';

import {
  userProfileV1,
} from './users.js';
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

function channelDetailsV1(authUserId, channelId) {
    return {
        name: 'Hayden',
        ownerMembers: [
          {
            uId: 1,
            email: 'example@gmail.com',
            nameFirst: 'Hayden',
            nameLast: 'Jacobs',
            handleStr: 'haydenjacobs',
          }
        ],
        allMembers: [
          {
            uId: 1,
            email: 'example@gmail.com',
            nameFirst: 'Hayden',
            nameLast: 'Jacobs',
            handleStr: 'haydenjacobs',
          }
        ],
    }
}

/**
 * Given a channelId of a channel that the authorised user can join, adds them to that channel.
 * @param {number, number} - user id and channel id
 * @returns {} 
 */

function channelJoinV1(authUserId, channelId) {

  if (isValidChannelId(channelId) === false) {
    return{error: 'Invalid channel Id'};
  
  
  } else if (isValidAuthUserId(authUserId) === false) {
    return{error: 'Invalid User Id'};
      
  } else if (isAuthUserMember(authUserId, channelId) === true) {
    return{error: 'User is already a member of the channel'};
  
  } else if (isChannelPrivate(channelId) === true && isAuthUserMember(authUserId, channelId) === false && isGlobalOwner(authUserId) === false) {
    return{error: 'Private channel'};
    
  } else {
    const data = getData();

    for(let channel of data.channels) {
      if(channel.channelId === channelId) {
        channel.allMembers.push(authUserId);
        setData(data);
      }
    }
    return {};
  }
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
};
