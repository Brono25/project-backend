
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




export { clearV1 };
