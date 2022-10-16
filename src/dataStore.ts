
import { DataStore } from './data.types';

// Data storage structure to follow
let data: DataStore = {
  users: [],
  channels: [],
  activeTokens: [],
  messageIds: [],
};

// Use get() to access the data
function getData(): DataStore {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: DataStore) {
  data = newData;
}

export { getData, setData };
