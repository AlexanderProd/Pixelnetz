#!/bin/bash

cd frontend
yarn build:local

cd ../master
yarn build:local

cd ../server
yarn start:dev
