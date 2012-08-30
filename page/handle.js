var hostname, s, show;

show = function(x) {
  return console.log(x);
};

hostname = location.hostname;

s = io.connect("" + hostname + ":8001");

$(function() {
  $('#file').bind('change', function(e) {
    var files, reader;
    files = e.target.files;
    reader = new FileReader();
    reader.onload = function(file) {
      var res;
      res = file.target.result;
      show('sending');
      return s.emit('dataURL', res);
    };
    return reader.readAsDataURL(files[0]);
  });
  $('#upload').click(function() {
    show('upload');
    return $('#file').click(function() {
      return false;
    });
  });
  $('#lunch').click(function() {
    $('#cover').fadeIn();
    $('#choice').animate({
      width: '600px'
    });
    return $('#choice').css({
      overflow: 'visible'
    });
  });
  return $('#close').click(function() {
    $('#choice').animate({
      width: '0px'
    });
    $('#cover').fadeOut();
    return $('#choice').css({
      overflow: 'hidden'
    });
  });
});
