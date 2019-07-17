#!/bin/bash

echo
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ">>>>>>>>>>> SHARED >>>>>>>>>>>"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo

cd shared
rm -rf node_modules
yarn install

echo
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ">>>>>>>>>> FRONTEND >>>>>>>>>>"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo

cd ../frontend
rm -rf node_modules
yarn install

echo
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ">>>>>>>>>>> MASTER >>>>>>>>>>>"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo

cd ../master
rm -rf node_modules
yarn install

echo
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ">>>>>>>>>>> SERVER >>>>>>>>>>>"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo

cd ../server
rm -rf node_modules
yarn install
