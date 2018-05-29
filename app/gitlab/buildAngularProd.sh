#! /bin/sh
git clone "https://github.com/redbox-mint/redbox-portal.git"
ng build --prod --build-optimizer --output-hashing=none
