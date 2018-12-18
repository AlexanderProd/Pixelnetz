#!/bin/bash

rm -rf ./dist
rm -rf ./server/dist
rm -rf ./shared/dist

cd shared
yarn build

cd ../frontend
yarn build:local

cd ../master
yarn build:local

cd ../server
yarn start:dev
