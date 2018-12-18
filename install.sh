#!/bin/bash

cd shared
yarn install

cd ../frontend
yarn install

cd ../master
yarn install

cd ../server
yarn install
