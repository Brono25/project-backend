#!/bin/bash

trap 'kill -INT $PID 2> /dev/null; exit 1' INT 

PORT=$(cat ./src/config.json| sed -n 3p|tr -dc '[0-9]')


function get_PID_of_PORT() {

    if [[ "$OSTYPE" =~ ^darwin ]]
    then 
        PID=$(lsof -nP -i4TCP:$1 | sed -E 's/[ ]+/ /g'|cut -d' '  -f2|tail -1)
    elif [[ "$OSTYPE" =~ ^linux ]]
    then
        PID=$(netstat -an --tcp --program 2>/dev/null |grep  ".*:$1\b.*LISTEN"|sed -E 's?.*LISTEN\s*([0-9]+)/node[ ]*$?\1?') 
    fi 
    [ "$PID" == '' ] && return 1
    echo $PID 
    return 0
}

# close a server it if is already running
PID=$(get_PID_of_PORT $PORT) && kill -INT "$PID" 



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

npm run ts-node-coverage 2>&1 /dev/null &


waiting=0
while [ "$waiting" -ne 1 ]; do
    PID=$(get_PID_of_PORT $PORT)
    [ "$PID" == '' ] || waiting=1
done

npm t
[ $? -eq 1 ] && exit 1


cat << eof

⚡️ Kill PID: $PID using PORT: $PORT ⚡️

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


