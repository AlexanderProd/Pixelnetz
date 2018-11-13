#!/bin/bash

cd frontend
yarn test

cd ../master
yarn test

cd ../server
yarn test
