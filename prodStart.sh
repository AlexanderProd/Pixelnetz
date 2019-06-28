#!/bin/bash

echo
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ">>>>>>>>>>> CLEANUP >>>>>>>>>>"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo

rm -rf ./dist
rm -rf ./server/dist
rm -rf ./shared/dist

echo
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ">>>>>>>>>>> SHARED >>>>>>>>>>>"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo

cd shared
yarn build

echo
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ">>>>>>>>>> FRONTEND >>>>>>>>>>"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo

cd ../frontend
yarn build

echo
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ">>>>>>>>>>> MASTER >>>>>>>>>>>"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo

cd ../master
yarn build

echo
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo ">>>>>>>>>>> SERVER >>>>>>>>>>>"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo

cd ../server
yarn start:prod
