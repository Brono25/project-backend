
import { DataStore, WorkspaceStats } from './data.types';
import fs from 'fs';

const DIR = './DataStorage';
const DATA_PATH = DIR + '/database.JSON';
// Check data store directory exists
if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR);
}
// Check dataStore.json exists

if (!fs.existsSync(DATA_PATH)) {
  const jsonstr = JSON.stringify(null);
  fs.writeFileSync(DATA_PATH, jsonstr);
}

let data: DataStore = null;

export function initialiseBeans(timeStamp: number) {
  const initData: DataStore = {
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
  const jsonstr = JSON.stringify(initData, null, 2);
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
