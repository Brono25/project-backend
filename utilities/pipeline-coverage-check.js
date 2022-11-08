
const fs = require('fs');
let FAIL_FLAG = 0;

const THRESHOLD = 99;

if (!fs.existsSync('./coverage/coverage-summary.json')) {
  console.log('error: summary not found');
  process.exit(1);
}
const dbstr = fs.readFileSync('./coverage/coverage-summary.json');
const data = JSON.parse(String(dbstr));
let keys = Object.keys(data);

keys = keys.filter(a => a.match(/total/g) === null);
keys = keys.filter(a => a.match(/echo/g) === null);
keys = keys.filter(a => a.match(/server/g) === null);
keys = keys.filter(a => a.match(/dataStore/g) === null);
keys.sort();
for (const key of keys) {
  const coverage = data[key].statements.pct;
  const name = key.match(/.*\/(.*\.ts)$/)[1];
  if (coverage < THRESHOLD) {
    FAIL_FLAG = 1;
    console.log(`FAIL: ${coverage}% ${name} `);
  } else {
    console.log(`PASS: ${coverage}% ${name} `);
  }
}

if (FAIL_FLAG === 1) {
  console.log('FAILED');
  process.exit(1);
} 