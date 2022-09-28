
import {
  setData,
  getData,
} from './dataStore.js';

import {
  isValidAuthUserId,
} from './other'

//------------------Channels Helper functions------------------



//------------------Channels Main functions------------------

// Stub funtion for creating user channels.
function channelsCreateV1(authUserId, name, isPublic) {

  const maxChars = 20;
  const minChars = 1;
  if(name.length > maxChars || name.length < minChars) {
    return {error: 'Channels name must be between 1-20 characters (inclusive)'};
  }
  if(!isValidAuthUserId(authUserId)) {
    return {error: 'Invalid User ID'};
  }


  return {
    channelId: 1,
  }
}



// Stub-function for listing all channels
function channelsListAllV1(authUserId) {
  return {
    channels: [
      {
        channelId: 1,
        name: 'My Channel',
      }
    ],
  }
}



// Stub function for listing the created channels.
function channelsListV1(authUserId) {
  return {
    channels: [
      {
        channelId: 1, 
        name: 'My Channel',
      }
    ],
  }
}




export {
  channelsListAllV1,
  channelsCreateV1,
  channelsListV1,
};
