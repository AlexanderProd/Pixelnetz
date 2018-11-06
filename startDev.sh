#!/bin/bash

cd frontend
yarn build

cd ../master
yarn build

cd ../server
yarn start:dev
