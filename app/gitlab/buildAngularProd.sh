#! /bin/sh
git clone "https://github.com/redbox-mint/redbox-portal.git"
node_modules/.bin/ng build --prod --build-optimizer --output-hashing=none
