#!/usr/bin/env bash

echo 'start watching'
cd `dirname $0`

echo $PWD

jade -O page/ -wP src/page.jade &
stylus -o page/ -w  src/paper.styl &
coffee -o page/ -wb src/handle.coffee &
doodle server.coffee /page/ &
node-dev server.coffee &

# jobs

read

pkill -f 'jade -O page/ -P src/page.jade'
pkill -f 'stylus -o page/ -w src/paper.styl'
pkill -f 'coffee -o page/ -wb src/handle.coffee'
pkill -f 'doodle server.coffee /page/'
pkill -f 'node-dev/wrapper.js server.coffee'

echo '%%%% stopped'
# jobs