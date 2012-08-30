
show = (x) -> console.log x

hostname = location.hostname
s = io.connect "#{hostname}:8001"

$ ->

  $('#file').bind 'change', (e) ->
    files = e.target.files
    reader = new FileReader()
    reader.onload = (file) ->
      res = file.target.result
      show 'sending'
      s.emit 'dataURL', res
    reader.readAsDataURL files[0]

  $('#upload').click ->
    show 'upload'
    $('#file').click( -> false)

  $('#lunch').click ->
    $('#cover').fadeIn()
    $('#choice').animate width: '600px'
    $('#choice').css overflow: 'visible'

  # $('#lunch').click()
  $('#close').click ->
    $('#choice').animate width: '0px'
    $('#cover').fadeOut()
    $('#choice').css overflow: 'hidden'