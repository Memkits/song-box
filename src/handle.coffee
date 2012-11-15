
show = (args...) -> console.log.apply console, args

song = {}
list = []
set = (key, value) -> localStorage.setItem key, value
get = (key) -> localStorage.getItem key

query = (str) -> document.querySelector str
tag = (id) -> document.getElementById id

play = (name) ->
  if song.src?
    unless song.paused
      song.pause()
  filename = "../mp3/dir/#{name}"
  set 'song', name
  (tag 'words').innerText = name
  song = new Audio filename
  song.play()

  song.addEventListener 'loadedmetadata', ->
    # last_time = get 'time'
    # show 'time', time
    # if last_time? then song.currentTime = Number (get 'time')
    song.addEventListener 'timeupdate', (a) ->
      # set 'time', (String song.currentTime)
      # show (get 'time')
      percent = song.currentTime / song.duration * 100
      (tag 'step').style.width = "#{percent}%"

  song.addEventListener 'play', ->
    (tag 'toggle').className = 'pressed'

  song.addEventListener 'pause', ->
    (tag 'toggle').className = 'released'

  song.addEventListener 'ended', ->
    unless (tag 'loop').className is 'pressed'
      elem  = query '#playing'
      next_elem = elem.nextElementSibling
      show elem, next_elem
      if next_elem?
        next_elem.click()
      else
        (tag 'like').children[0].click()

list_remove = (list_a, item_a) ->
  list_b = []
  list_a.forEach (item_b) ->
    if item_b isnt item_a
      list_b.push item_b
  list_b

choose = (name) ->
  show 'name...', name, list
  unless name in list
    json =
      '.good-song':
        'span': name
        'span.icon.up': 'up'
        'span.icon.rm': 'rm'
    (tag 'like').insertAdjacentHTML 'beforeend', (tmpl json)
    list.push name
    set 'list', (JSON.stringify list)

    elem = query '#like>div:last-child'
    elem.onclick = ->
      play name
      playing = query '#playing'
      if playing? then playing.id = ''
      elem.id = 'playing'

    parent = elem.parentElement

    rm = elem.querySelector '.rm'
    rm.onclick = (event) ->
      parent.removeChild elem
      list = list_remove list, name
      set 'list', (JSON.stringify list)
      event.cancelBubble = yes

    up = elem.querySelector '.up'
    up.onclick = (event) ->
      prev = elem.previousElementSibling
      if prev
        parent.removeChild prev
        elem.insertAdjacentElement 'afterend', prev
      event.cancelBubble = yes

window.onload = ->

  last_list = get 'list'
  if last_list?
    (JSON.parse last_list).forEach choose

  req = new XMLHttpRequest
  req.open 'get', '../mp3/list.json', yes
  req.send()
  req.onload = (obj) ->
    (JSON.parse obj.target.response).forEach (name) ->
      html = tmpl ".song-name": name
      (tag 'menu').insertAdjacentHTML 'beforeend', html
      (query '#menu>div:last-child').onclick = -> choose name

    # last_song = get 'song'
    # if last_song then play last_song else play list[2]
    (tag 'like').children[0].click()

  (tag 'toggle').onclick = ->
    if (tag 'toggle').className is 'pressed'
      song.pause()
    else
      song.play()

  (tag 'loop').onclick = ->
    if (tag 'loop').className is 'pressed'
      song.loop = off
      (tag 'loop').className = 'released'
    else
      song.loop = on
      (tag 'loop').className = 'pressed'

  (tag 'dec81').onclick = ->
    vol = Number (tag 'now').innerText
    vol -= 81
    if vol < 0 then vol = 0
    (tag 'now').innerText = vol
    song.volume = vol / 100

  (tag 'inc27').onclick = ->
    vol = Number (tag 'now').innerText
    vol += 27
    if vol > 100 then vol = 100
    (tag 'now').innerText = vol
    song.volume = vol / 100

  (tag 'dec9').onclick = ->
    vol = Number (tag 'now').innerText
    vol -= 9
    if vol < 0 then vol = 0
    (tag 'now').innerText = vol
    song.volume = vol / 100

  (tag 'inc3').onclick = ->
    vol = Number (tag 'now').innerText
    vol += 3
    if vol > 100 then vol = 100
    (tag 'now').innerText = vol
    song.volume = vol / 100