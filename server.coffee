
show = console.log

io = require('socket.io').listen 8001, origins: '*:*'
io.set 'log level', 1
io.sockets.on 'connection', (s) ->
  s.on 'dataURL', (file) ->
    save file
  show 'connection'

so = (a, b) -> yes

# handler = (req, res) ->
#   show req.url
#   if req.url is '/song'
#     data = ''
#     req.on 'data', (chunk) -> data += chunk
#     req.on 'end', -> so (save data), (res.end 'end')
#   else
#     res.end 'file server'
# # require('http').createServer(handler).listen 8002

fs = require 'fs'
save = (data) ->
  data =  data.replace /^\w+\:\w+\/\w+\;base64\,/, ''
  dataBuffer = new Buffer data, 'base64'
  fs.writeFile 'a.zip', dataBuffer, (err) ->
    show err
    show 'end'