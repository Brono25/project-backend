#!/bin/sh

npm run lint-fix 
npm run tsc
npm run ts-node-coverage &
npm t
killall node
npm run pipeline-coverage-check
