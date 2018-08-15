#! /bin/bash

ng build

PWD=$(pwd)

cp -r ${PWD}/dist/* /opt/redbox-portal/.tmp/public/angular/gitlab/
