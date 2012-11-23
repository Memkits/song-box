
require! \fs
require! \path

dir = path.join __dirname, \dir/
name = path.join __dirname, \list.json
show = console.log

whole-list = []

list = fs.readdir-sync dir
list.forEach (file) ->
  if file.match /\.mp3$/
    whole-list.push file
  else if fs.stat-sync(path.join dir, file).is-directory!
    this-dir = path.join dir, file
    show \this-dir this-dir
    list2 = fs.readdir-sync this-dir
    show \list2 list2

    list2.forEach (item) ->
      if item.match /\.mp3$/
        whole-list.push (path.join file, item)

json = JSON.stringify whole-list.sort!, null, 2
fs.write-file name, json