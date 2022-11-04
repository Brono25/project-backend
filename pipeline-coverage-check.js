
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
let keys = Object.keys(data);

keys = keys.filter(a => a !== 'total');
keys = keys.filter(a => a.match(/echo/g) === null);
keys.sort();

if (data[keys[1]].statements.pct < AUTH_THRESHOLD) {
  console.log(`error: ${keys[0]} coverage is less then ${AUTH_THRESHOLD}%`);
  FAIL_FLAG = 1;
}
if (data[keys[2]].statements.pct < CHANNEL_THRESHOLD) {
  console.log(`error: ${keys[1]} coverage is less then ${CHANNEL_THRESHOLD}%`);
  FAIL_FLAG = 1;
}
if (data[keys[3]].statements.pct < CHANNELS_THRESHOLD) {
  console.log(`error: ${keys[2]} coverage is less then ${CHANNELS_THRESHOLD}%`);
  FAIL_FLAG = 1;
}
if (data[keys[4]].statements.pct < DATA_THRESHOLD) {
  console.log(`error: ${keys[3]} coverage is less then ${DATA_THRESHOLD}%`);
  FAIL_FLAG = 1;
}
if (data[keys[5]].statements.pct < DM_THRESHOLD) {
  console.log(`error: ${keys[4]} coverage is less then ${DM_THRESHOLD}%`);
  FAIL_FLAG = 1;
}
if (data[keys[6]].statements.pct < MESSAGE_THRESHOLD) {
  console.log(`error: ${keys[5]} coverage is less then ${MESSAGE_THRESHOLD}%`);
  FAIL_FLAG = 1;
}
if (data[keys[7]].statements.pct < OTHER_THRESHOLD) {
  console.log(`error: ${keys[6]} coverage is less then ${OTHER_THRESHOLD}%`);
  FAIL_FLAG = 1;
}
if (data[keys[8]].statements.pct < SERVER_THRESHOLD) {
  console.log(`error: ${keys[7]} coverage is less then ${SERVER_THRESHOLD}%`);
  FAIL_FLAG = 1;
}
if (data[keys[9]].statements.pct < USERS_THRESHOLD) {
  console.log(`error: ${keys[8]} coverage is less then ${USERS_THRESHOLD}%`);
  FAIL_FLAG = 1;
}

if (FAIL_FLAG === 1) {
  process.exit(1);
}
console.log('//---------------------------------------------//');
console.log('           success: coverage PASSED');
console.log('//---------------------------------------------//');