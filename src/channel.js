import {
  setData,
  getData,
} from './dataStore.js';

import {
  isValidAuthUserId,
  isValidChannelId,
  isAuthUserMember,
} from './other.js'

//------------------ Channel Helper functions------------------



/**
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


  


//------------------Channel Main functions------------------

// Stub-function for listing channel details
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

// Stub-function for joining channel
function channelJoinV1(authUserId, channelId) {

  if (isValidChannelId(channelId) === false) {
    return{error: 'Invalid channel Id'};
  
  
  } else if (isValidAuthUserId(authUserId) === false) {
    return{error: 'Invalid User Id'};
      
  } else if (isAuthUserMember(authUserId, channelId) === true) {
    return{error: 'User is already a member of the channel'};
  
  } else if (isChannelPrivate(channelId) === true && isAuthUserMember(authUserId, channelId) === false) {
    return{error: 'Private channel'};
    
  } else {
    return {};
  }
}

//stub-function for inviting users to the channel
function channelInviteV1( authUserId, channelId, uId ) {
	if (isValidChannelId(channelId) === false) {
    return{error: 'Invalid channel Id'};
  
  
  } else if (isValidAuthUserId(authUserId) === false) {
    return{error: 'Invalid User Id'};
      
  } else if (isAuthUserMember(uId, channelId) === true) {
    return{error: 'User is already a member of the channel'};
  
  } else if (isAuthUserMember(authUserId, channelId) === false) {
    return{error: 'User is not a member of the channel'};

  } else if (isValidAuthUserId(uId) === false) {
    return{error: 'Invalid User Id'};

  } 

  const data = getData();

  let channel;

  for (let x of data.channels) {
    if (x.channelId === channelId) {
      channel = x;
    }

  }

  const user = {uId: uId};
  channel.allMembers.push(user);

  setData(data);

  return {};

}

//stub-function for listing the messages in the channel
function channelMessagesV1( authUserId, channelId, start ){

	return{
	
	messages: [
      {
        messageId: 1,
        uId: 1,
        message: 'Hello world',
        timeSent: 1582426789,
      }
	],
	start: 0,
	end: 50,		
		
	}

}




export {
  channelDetailsV1,
  channelJoinV1,
  channelInviteV1,
  channelMessagesV1,
};
