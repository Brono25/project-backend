#!/bin/sh

npm run lint-fix
npm run tsc
npm run ts-node-coverage &
npm t
npm run pipeline-coverage-check
killall node