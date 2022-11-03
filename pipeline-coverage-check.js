
const THRESHOLD = 99;
const fs = require('fs');

const dbstr = fs.readFileSync('./coverage/coverage-summary.json');
const data = JSON.parse(String(dbstr));

if (data.total.statements.pct < THRESHOLD) {
  console.log('error: coverage is less then 99%')
  process.exit(1);
}
console.log(`success: coverage is atleast ${THRESHOLD}%`);
