#!/bin/bash

PORT=$(cat ./src/config.json| sed -n 3p|tr -dc '[0-9]')


npm run lint-fix 
npm run tsc
npm run ts-node-coverage &
npm t


if [[ "$OSTYPE" =~ ^darwin ]]
then 
    PID=$(lsof -nP -i4TCP:$PORT | sed -E 's/[ ]+/ /g'|cut -d' '  -f2|tail -1)
elif [[ "$OSTYPE" =~ ^linux ]]
then
    PID=$(netstat -an --tcp --program 2>/dev/null |grep "$PORT" | sed -E 's?.*LISTEN\s*([0-9]+)/node.*?\1?') 
fi

if [[ "$PID" == '' ]] 
then
    echo "PID not found - server is not running"
    exit 1
fi
cat << eof

    ⚡️ Killing PID: $PID belonging to PORT: $PORT ⚡️

eof

kill -INT $PID 
npm run pipeline-coverage-check
