
const fs = require('fs');
let FAIL_FLAG = 0;

const AUTH_THRESHOLD = 99;
const CHANNEL_THRESHOLD = 99;
const CHANNELS_THRESHOLD = 99;
const DATA_THRESHOLD = 77.77;
const DM_THRESHOLD = 99;
const MESSAGE_THRESHOLD = 99;
const OTHER_THRESHOLD = 99;
const SERVER_THRESHOLD = 98.26;
const USERS_THRESHOLD = 99;

if (!fs.existsSync('./coverage/coverage-summary.json')) {
  console.log('error: summary not found');
  process.exit(1);
}


const dbstr = fs.readFileSync('./coverage/coverage-summary.json');
const data = JSON.parse(String(dbstr));

if (data['/Users/brono/Desktop/COMP1531/project-backend/src/auth.ts'].statements.pct < AUTH_THRESHOLD) {
  console.log(`error: auth.ts coverage is less then ${AUTH_THRESHOLD}%`);
  FAIL_FLAG = 1;
}
if (data['/Users/brono/Desktop/COMP1531/project-backend/src/channel.ts'].statements.pct < CHANNEL_THRESHOLD) {
  console.log(`error: channel.ts coverage is less then ${CHANNEL_THRESHOLD}%`);
  FAIL_FLAG = 1;
}
if (data['/Users/brono/Desktop/COMP1531/project-backend/src/channels.ts'].statements.pct < CHANNELS_THRESHOLD) {
  console.log(`error: channels.ts coverage is less then ${CHANNELS_THRESHOLD}%`);
  FAIL_FLAG = 1;
}
if (data['/Users/brono/Desktop/COMP1531/project-backend/src/dataStore.ts'].statements.pct < DATA_THRESHOLD) {
  console.log(`error: dataStore.ts coverage is less then ${DATA_THRESHOLD}%`);
  FAIL_FLAG = 1;
}
if (data['/Users/brono/Desktop/COMP1531/project-backend/src/dm.ts'].statements.pct < DM_THRESHOLD) {
  console.log(`error: dm.ts coverage is less then ${DM_THRESHOLD}%`);
  FAIL_FLAG = 1;
}
if (data['/Users/brono/Desktop/COMP1531/project-backend/src/message.ts'].statements.pct < MESSAGE_THRESHOLD) {
  console.log(`error: message.ts coverage is less then ${MESSAGE_THRESHOLD}%`);
  FAIL_FLAG = 1;
}
if (data['/Users/brono/Desktop/COMP1531/project-backend/src/other.ts'].statements.pct < OTHER_THRESHOLD) {
  console.log(`error: other.ts coverage is less then ${OTHER_THRESHOLD}%`);
  FAIL_FLAG = 1;
}
if (data['/Users/brono/Desktop/COMP1531/project-backend/src/server.ts'].statements.pct < SERVER_THRESHOLD) {
  console.log(`error: server.ts coverage is less then ${SERVER_THRESHOLD}%`);
  FAIL_FLAG = 1;
}
if (data['/Users/brono/Desktop/COMP1531/project-backend/src/users.ts'].statements.pct < USERS_THRESHOLD) {
  console.log(`error: users.ts coverage is less then ${USERS_THRESHOLD}%`);
  FAIL_FLAG = 1;
}

if (FAIL_FLAG === 1) {
  process.exit(1);
}
console.log('//---------------------------------------------//');
console.log('           success: coverage PASSED');
console.log('//---------------------------------------------//');