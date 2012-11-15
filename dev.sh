#!/usr/bin/env bash

echo 'start watching'
subl -a .

cd `dirname $0`

jade -O page/ -wP src/page.jade &
stylus -o page/ -w  src/paper.styl &
coffee -o page/ -wb src/handle.coffee &
doodle server.coffee /page/ &
node-dev server.coffee &

read

pkill -f jade
pkill -f stylus
pkill -f coffee
pkill -f doodle
pkill -f node-dev

echo '-- stopped'
