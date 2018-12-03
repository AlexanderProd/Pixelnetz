#!/bin/bash

rm -rf ./dist
rm -rf ./server/dist

cd frontend
yarn build:local

cd ../master
yarn build:local

cd ../server
yarn start:dev
