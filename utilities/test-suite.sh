#!/bin/bash

trap 'kill -INT $PID 2> /dev/null; echo Exiting $PID' INT 

PORT=$(cat ./src/config.json| sed -n 3p|tr -dc '[0-9]')

cat << eof

|--------------------------------|
          Checking linter              
|--------------------------------|
eof

npm run lint-fix 

[ $? -eq 1 ] && exit 1
echo "PASSED"

cat << eof

|--------------------------------|
          Checking tsc
|--------------------------------|
eof
npm run tsc 
[ $? -eq 1 ] && exit 1
echo "PASSED"

cat << eof

|--------------------------------|
       Checking jest tests
|--------------------------------|
eof

npm run ts-node-coverage 1> /dev/null &

while [ "$PID" == '' ]; do

    if [[ "$OSTYPE" =~ ^darwin ]]
    then 
        PID=$(lsof -nP -i4TCP:$PORT | sed -E 's/[ ]+/ /g'|cut -d' '  -f2|tail -1)
    elif [[ "$OSTYPE" =~ ^linux ]]
    then
        PID=$(netstat -an --tcp --program 2>/dev/null |grep  ".*:$PORT\b.*LISTEN"|sed -E 's?.*LISTEN\s*([0-9]+)/node[ ]*$?\1?') 
    fi 
done

npm t
[ $? -eq 1 ] && exit 1


cat << eof

⚡️ Killing PID: $PID belonging to PORT: $PORT ⚡️

eof

kill -INT $PID 
cat << eof

|--------------------------------|
       Checking coverage
|--------------------------------|
eof
npm run pipeline-coverage-check
[ $? -eq 1 ] && exit 1

timeTested=$(date +%T)
dateTested=$(date +%D)

cat << eof

|--------------------------------|
         ALL TESTS PASSED 
        $timeTested $dateTested
|--------------------------------|
    ✓ Linting
    ✓ TSC
    ✓ Jest Tests
    ✓ Coverage

eof


