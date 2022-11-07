
const fs = require('fs');
const dbstr = fs.readFileSync('./src/config.json');
const findPidFromPort = require('find-pid-from-port');
const { pid } = require('process');

const data = JSON.parse(String(dbstr));

const port = parseInt(data.port);

const example = async () => {
  try {
    const pids = await findPidFromPort(port);
    console.log(port, pids.all);
  } catch (error) {
    console.log(error);
  }
  process.kill(pid, 'SIGINT');
};
example();