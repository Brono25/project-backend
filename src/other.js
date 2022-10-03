
import {
  setData,
  getData,
} from './dataStore.js';


/**
 * Set data back to initial state.
 * @param {} 
 * @returns {} 
 */
function clearV1() {

  let data = getData();
  data = {
    users: [],
    channels: [],
  }
  setData(data);
  return {};
}





/**
 * @param {string} - users handle 
 * @returns {boolean} - is handle unique
 */
function isValidAuthUserId(authUserId) {

  const data = getData();

  if(!data.users.length) {
    return false;
  }
  for(let user of data.users) {
    if(user.authUserId === authUserId) {
      return true;
    }
  }
  return false;
}

function isValidChannelId(channelId) {

  const data = getData();

  if(!data.channels.length) {
    return false;
  }
  for(let channel of data.users) {
    if(channels.channelId === channelId) {
      return true;
    }
  }
  return false;
}



export { 
  clearV1,
  isValidAuthUserId,
};
