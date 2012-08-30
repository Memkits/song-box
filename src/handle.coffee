
show = (x...) -> console.log.apply console, x
found = (x) -> x.length > 0

hostname = location.hostname
s = io.connect "#{hostname}:8001"

repeat = (t, f) -> setInterval f, t
delay = (t, f) -> setTimeout f, t

ls = JSON.parse (localStorage.ls or '{}')
repeat 100, -> localStorage.ls = JSON.stringify ls

song = {}

song_tag = (name) -> "<p class='song'>#{name}</p>"

$ ->

  choice = $ '#choice'
  place = $ '#place'
  song_list = $ '#list'

  $('#file').bind 'change', (e) ->
    files = e.target.files
    s.emit 'upname', files[0].name
    reader = new FileReader()
    reader.onload = (file) ->
      res = file.target.result
      show 'sending'
      s.emit 'dataURL', res
    reader.readAsDataURL files[0]

  $('#lunch').click ->
    $('#cover').fadeIn()
    choice.animate width: '600px'
    place.animate width: '600px'
    place.css overflow: 'visible'

  $('#lunch').click()
  delay 100, -> $('#close').click()

  $('#close').click ->
    choice.animate width: '0px'
    place.animate width: '0px'
    $('#cover').fadeOut()
    place.css overflow: 'hidden'

  s.on 'list', (list) ->
    show 'list: ', list
    ls.all = list

    choice.empty()
    list.forEach (name) -> choice.append (song_tag name)
    $('#cover .song').click (e) ->
      elem = $(e.target)
      name = elem.text()
      classes = elem.attr('class').split(' ')
      if 'queue' in classes
        rm_song name
        unmark_song name
      else
        add_song name
        mark_song name
        if $('#list .song').length is 1 then play_song name
      record()

    ls.record.forEach (name) ->
      elem = $("#choice .song:contains('#{name}')")
      elem.addClass 'queue'

  play_song = (name) ->
    show 'play_song', name
    ls.play_song = name
    $('.playing').removeClass 'playing'
    $("#list .song:contains('#{name}')").addClass 'playing'
    ls.playing = name
    buzz_song()

  do buzz_song = ->
    name = ls.playing
    started = song.stop?
    song.stop() if started
    song = new buzz.sound "../songs/#{name}"
    song.play().loop()
    song.bind 'timeupdate', -> ls.timer = song.getTime()
    song.setTime (ls.timer + 0.2) unless started
    
  add_song = (name) ->
    show 'add_song', name

    $('#list').append (song_tag name)
    $("#list .song:contains('#{name}')").click -> play_song name

  mark_song = (name) ->
    show 'mark_song', name
    $("#cover .song:contains('#{name}')").addClass 'queue'

  rm_song = (name) ->
    show 'rm_song', name

    elem = $("#list .song:contains('#{name}')")
    if found elem
      if 'playing' in elem.attr('class').split(' ')
        if found elem.next() then play_song elem.next().text()
        else if found elem.prev() then play_song elem.prev().text()
        else play_song random_song()
      elem.remove()

  unmark_song = (name) ->
    show 'unmark_song', name
    $("#cover :contains('#{name}')").removeClass 'queue'

  random_song = ->
    n = Math.floor (ls.all.length * Math.random())
    show 'random_song', ls.all[n]
    ls.all[n]

  record = ->
    ls.record = []
    for item in $('#list .song')
      unless item in ls.record
        name = $(item).text()
        if name in ls.all
          ls.record.push name
    show 'record', ls.record

  do init = ->
    show 'record', ls.record
    ls.record.forEach (name) -> add_song name
    $("#list .song:contains('#{ls.playing}')").addClass 'playing'

  mute = $ '#mute'
  do_mute = ->
    song.mute()
    mute.text('unmute')
    ls.muted = yes
  do_unmute = ->
    song.unmute()
    mute.text('mute')
    ls.muted = no

  mute.click ->
    if mute.text() is 'mute' then do_mute() else do_unmute()
  show ls.muted
  if ls.muted then do_mute()

  $('#up').click -> [1..10].forEach -> song.increaseVolume()
  $('#down').click -> [1..10].forEach -> song.decreaseVolume()