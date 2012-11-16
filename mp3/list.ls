
require! \fs
require! \path

dir = path.join __dirname, \dir/
name = path.join __dirname, \list.json

fs.readdir dir, (err, list) ->
  json = JSON.stringify list, 2
  fs.write-file name, json