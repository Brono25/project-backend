
import { DataStore } from './data.types';
import fs from 'fs';

const DIR = './DataStorage';
const DATA_PATH = DIR + '/database.JSON';

if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR);
}

let data: DataStore;
if (fs.existsSync(DATA_PATH)) {
  const dbstr = fs.readFileSync(DATA_PATH);
  data = JSON.parse(String(dbstr));
} else {
  data = {
    users: [],
    channels: [],
    activeTokens: [],
    messageIds: [],
    dms: [],
  };
  const jsonstr = JSON.stringify(data, null, 2);
  fs.writeFileSync(DATA_PATH, jsonstr);
}

// Use get() to access the data
function getData(): DataStore {
  const dbstr = fs.readFileSync(DATA_PATH);
  data = JSON.parse(String(dbstr));
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: DataStore) {
  data = newData;
  const jsonstr = JSON.stringify(newData, null, 2);
  fs.writeFileSync(DATA_PATH, jsonstr);
}

export { getData, setData };
