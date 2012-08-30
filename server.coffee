
show = console.log

io = require('socket.io').listen 8001, origins: '*:*'
io.set 'log level', 1
io.sockets.on 'connection', (s) ->
  upname = ''
  s.on 'upname', (str) -> upname = str
  s.on 'dataURL', (data) -> save upname, data
  show 'connection'
  song_list s

so = (a, b) -> yes

fs = require 'fs'
save = (upname, data) ->
  show 'upname', upname
  upname = 'songs/' + upname
  data =  data.replace /^\w+\:\w+\/\w+\;base64\,/, ''
  show data[..20]
  dataBuffer = new Buffer data, 'base64'
  fs.writeFile upname, dataBuffer, (err) ->
    if err? then show err else
      song_list io.sockets
      show 'end'

song_list = (s) ->
  fs.readdir 'songs', (err, list) ->
    s.emit 'list', list