// @ts-nocheck
import {
  setData,
  getData,
} from './dataStore.ts';

import {
  isValidAuthUserId,
  isAuthUserMember,
  getChannelDetailsFromId,
} from './other.ts'

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
/**
 * Returns a list of all channels if user is valid.
 * 
 * @param {number, string, boolean} - user ID, channel name, is public
 * @returns {number} - channel ID
 */
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
    allMembers:   [ {uId: authUserId}, ],  
    messages: [],
  }

  let data = getData();
  data.channels.push(channelDetails);
  setData(data);

  return {
    channelId: channelId,
  }
}


/**
 * Returns a list of all channels if user is valid.
 * 
 * @param {string} - user ID
 * @returns {Array} - list of channels
 */
function channelsListAllV1(authUserId) {

  // check if authUserId is valid
  if (isValidAuthUserId(authUserId) === false) {
    return {error: 'Invalid user ID'};
  } 

  // check all created channels
  let channels = [];
  let data = getData();
  for (let channel of data.channels) {
    channels.push({name: channel.name, channelId: channel.channelId});
  }
  return {channels};
}


/**
 * Returns a list of all channels a user is a member of
 * 
 * @param {string} - user ID
 * @returns {Array} - list of channels
 */
function channelsListV1(authUserId) {

   if (!isValidAuthUserId(authUserId)) {
    return {error: 'Invalid User ID'};  
   }

  let data = getData();
  let channels = [];

  for(let channel of data.channels) {
    if (isAuthUserMember(authUserId, channel.channelId)) {

      channels.push({
        name: channel.name, 
        channelId: channel.channelId
      });
    }
  }
  return {channels: channels};
}



export {
  channelsListAllV1,
  channelsCreateV1,
  channelsListV1,
};

