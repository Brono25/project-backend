
import { DataStore, WorkspaceStats } from './data.types';
import fs from 'fs';
import { getTimeInSecs } from './other';
const DIR = './DataStorage';
const DATA_PATH = DIR + '/database.JSON';

if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR);
}

let data: DataStore;
if (!fs.existsSync(DATA_PATH)) {
  const jsonstr = JSON.stringify(null);
  fs.writeFileSync(DATA_PATH, jsonstr);
}

const dbstr = fs.readFileSync(DATA_PATH);
data = JSON.parse(String(dbstr));

if (data === null) {
  const timeStamp: number = getTimeInSecs();
  data = {
    users: [],
    channels: [],
    activeTokens: [],
    messageIds: [],
    dms: [],
    workspaceStats: <WorkspaceStats> {
      channelsExist: [{ numChannelsExist: 0, timeStamp: timeStamp }],
      dmsExist: [{ numDmsExist: 0, timeStamp: timeStamp }],
      messagesExist: [{ numMessagesExist: 0, timeStamp: timeStamp }],
      utilizationRate: 0
    }
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
function setData(data: DataStore) {
  const jsonstr = JSON.stringify(data, null, 2);
  fs.writeFileSync(DATA_PATH, jsonstr);
}

export { getData, setData };
