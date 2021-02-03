#!/usr/bin/env bash
rm -rf public
rm server/views/index.html
yarn umiBuild
mv public/strawberry/index.html server/views/index.html
