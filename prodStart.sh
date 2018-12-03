#!/bin/bash

rm -rf ./dist
rm -rf ./server/dist

cd frontend
yarn build

cd ../master
yarn build

cd ../server
yarn start:prod
