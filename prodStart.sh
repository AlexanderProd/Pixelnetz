#!/bin/bash

rm -rf ./dist
rm -rf ./server/dist
rm -rf ./shared/dist

cd shared
yarn build

cd ../frontend
yarn build

cd ../master
yarn build

cd ../server
yarn start:prod
