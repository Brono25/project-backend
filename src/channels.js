
import {
  setData,
  getData,
} from './dataStore.js';

import {
  isValidAuthUserId,
  isAuthUserMember,
} from './other.js'

import { authRegisterV1 } from './auth.js';

//------------------Channels Helper functions------------------
/**
 * The channel ID is the same as its index in the 
 * data.channels array. This is to make fetching channel details
 * from their the channel ID easy and ensures unique ID's.
 * 
 * @param {} 
 * @returns {number} - unique channel id
 */
function generateChannelId() {

  const data = getData();
  const id = data.channels.length;
  return id;
}



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

  const channelId = generateChannelId();
  const channelDetails = {
    channelId: channelId,
    name: name,
    isPublic: isPublic,
    ownerMembers: [ {uId: authUserId}, ],
    allMembers:   [ {uId: authUserId}, ],  //TO DO: Find if creater is added to members and owners?
    messages: [],
  }

  let data = getData();
  data.channels.push(channelDetails);
  setData(data);

  return {
    channelId: channelId,
  }
}



// Stub-function for listing all channels
function channelsListAllV1(authUserId) {

  // check if authUserId is valid
  if (isValidAuthUserId(authUserId) === false) {
    return {error: 'Invalid user ID'};
  } 

  // check all created channels
  let channels = [];
  let data = getData();
  for (let channel of data.channels) {
    channels.push(channel);
  }
  return {channels};
}

// Stub function for listing the created channels.
function channelsListV1(authUserId) {

  let data = getData();
  let channels=[];

  if (isValidAuthUserId(authUserId) === true) {
    for(let channel of data.channels) {
      if (isAuthUserMember(authUserId, channel.channelId) === true) {
          channels.push(channel);
        }
      }
    
  } else {
    return {error: 'Invalid User ID'};  
  } 
  
  return {channels};
}





export {
  channelsListAllV1,
  channelsCreateV1,
  channelsListV1,
};

