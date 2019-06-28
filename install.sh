#!/bin/bash

echo
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ">>>>>>>>>>> SHARED >>>>>>>>>>>"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo

cd shared
yarn install

echo
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ">>>>>>>>>> FRONTEND >>>>>>>>>>"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo

cd ../frontend
yarn install

echo
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ">>>>>>>>>>> MASTER >>>>>>>>>>>"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo

cd ../master
yarn install

echo
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ">>>>>>>>>>> SERVER >>>>>>>>>>>"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo

cd ../server
yarn install
