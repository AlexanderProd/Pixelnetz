#!/bin/bash

echo
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ">>>>>>>>>> FRONTEND >>>>>>>>>>"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo

cd frontend
yarn test

echo
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ">>>>>>>>>>> MASTER >>>>>>>>>>>"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo

cd ../master
yarn test

echo
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ">>>>>>>>>>> SERVER >>>>>>>>>>>"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo

cd ../server
yarn test
