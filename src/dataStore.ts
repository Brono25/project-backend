
import { DataStore } from './data.types';

// Data storage structure to follow
let data: DataStore = {
  users: [],
  channels: [],
};

// Use get() to access the data
function getData() {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData) {
  data = newData;
}

export { getData, setData };
