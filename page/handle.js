var delay, found, hostname, ls, repeat, s, show, song, song_tag,
  __slice = Array.prototype.slice,
  __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

show = function() {
  var x;
  x = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return console.log.apply(console, x);
};

found = function(x) {
  return x.length > 0;
};

hostname = location.hostname;

s = io.connect("" + hostname + ":8001");

repeat = function(t, f) {
  return setInterval(f, t);
};

delay = function(t, f) {
  return setTimeout(f, t);
};

ls = JSON.parse(localStorage.ls || '{}');

repeat(100, function() {
  return localStorage.ls = JSON.stringify(ls);
});

song = {};

song_tag = function(name) {
  return "<p class='song'>" + name + "</p>";
};

$(function() {
  var add_song, buzz_song, chat, choice, do_mute, do_unmute, init, make, mark, mark_song, mute, name, next_song, place, play_song, random_song, record, rm_song, song_list, text, unit, unmark_song, write;
  choice = $('#choice');
  place = $('#place');
  song_list = $('#list');
  $('#file').bind('change', function(e) {
    var files, reader;
    files = e.target.files;
    s.emit('upname', files[0].name);
    reader = new FileReader();
    reader.onload = function(file) {
      var res;
      res = file.target.result;
      show('sending');
      return s.emit('dataURL', res);
    };
    return reader.readAsDataURL(files[0]);
  });
  $('#lunch').click(function() {
    $('#cover').fadeIn();
    choice.animate({
      width: '600px'
    });
    place.animate({
      width: '600px'
    });
    return place.css({
      overflow: 'visible'
    });
  });
  $('#lunch').click();
  delay(100, function() {
    return $('#close').click();
  });
  $('#close').click(function() {
    choice.animate({
      width: '0px'
    });
    place.animate({
      width: '0px'
    });
    $('#cover').fadeOut();
    return place.css({
      overflow: 'hidden'
    });
  });
  s.on('list', function(list) {
    show('list: ', list);
    ls.all = list;
    choice.empty();
    list.forEach(function(name) {
      return choice.append(song_tag(name));
    });
    $('#cover .song').click(function(e) {
      var classes, elem, name;
      elem = $(e.target);
      name = elem.text();
      classes = elem.attr('class').split(' ');
      if (__indexOf.call(classes, 'queue') >= 0) {
        rm_song(name);
        unmark_song(name);
      } else {
        add_song(name);
        mark_song(name);
        if ($('#list .song').length === 1) play_song(name);
      }
      return record();
    });
    return ls.record.forEach(function(name) {
      var elem;
      elem = $("#choice .song:contains('" + name + "')");
      return elem.addClass('queue');
    });
  });
  play_song = function(name) {
    show('play_song', name);
    ls.play_song = name;
    $('.playing').removeClass('playing');
    $("#list .song:contains('" + name + "')").addClass('playing');
    ls.playing = name;
    return buzz_song();
  };
  (buzz_song = function() {
    var name, started;
    name = ls.playing;
    started = song.stop != null;
    if (started) song.stop();
    song = new buzz.sound("../songs/" + name);
    song.play();
    song.bind('timeupdate', function() {
      return ls.timer = song.getTime();
    });
    if (!started) song.setTime(ls.timer + 0.2);
    song.bind('ended', function() {
      return next_song();
    });
    return song.bind('err', function() {
      return next_song();
    });
  })();
  add_song = function(name) {
    show('add_song', name);
    $('#list').append(song_tag(name));
    return $("#list .song:contains('" + name + "')").click(function() {
      return play_song(name);
    });
  };
  mark_song = function(name) {
    show('mark_song', name);
    return $("#cover .song:contains('" + name + "')").addClass('queue');
  };
  rm_song = function(name) {
    var elem;
    show('rm_song', name);
    elem = $("#list .song:contains('" + name + "')");
    if (found(elem)) {
      if (__indexOf.call(elem.attr('class').split(' '), 'playing') >= 0) {
        next_song(elem);
      }
      return elem.remove();
    }
  };
  unmark_song = function(name) {
    show('unmark_song', name);
    return $("#cover :contains('" + name + "')").removeClass('queue');
  };
  random_song = function() {
    var n;
    n = Math.floor(ls.all.length * Math.random());
    show('random_song', ls.all[n]);
    return play_song(ls.all[n]);
  };
  record = function() {
    var item, name, _i, _len, _ref;
    ls.record = [];
    _ref = $('#list .song');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (__indexOf.call(ls.record, item) < 0) {
        name = $(item).text();
        if (__indexOf.call(ls.all, name) >= 0) ls.record.push(name);
      }
    }
    return show('record', ls.record);
  };
  (init = function() {
    show('record', ls.record);
    ls.record.forEach(function(name) {
      return add_song(name);
    });
    return $("#list .song:contains('" + ls.playing + "')").addClass('playing');
  })();
  mute = $('#mute');
  do_mute = function() {
    song.mute();
    mute.text('unmute');
    return ls.muted = true;
  };
  do_unmute = function() {
    song.unmute();
    mute.text('mute');
    return ls.muted = false;
  };
  mute.click(function() {
    if (mute.text() === 'mute') {
      return do_mute();
    } else {
      return do_unmute();
    }
  });
  show(ls.muted);
  if (ls.muted) do_mute();
  $('#up').click(function() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(function() {
      return song.increaseVolume();
    });
  });
  $('#down').click(function() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(function() {
      return song.decreaseVolume();
    });
  });
  next_song = function(elem) {
    show('next_song');
    if (elem == null) elem = $('#list .playing');
    if (found(elem)) {
      if (found(elem.next())) {
        return play_song(elem.next().text());
      } else if ($('#list .song').length > 1) {
        return play_song($('#list .song').first().text());
      } else {
        return random_song();
      }
    }
  };
  name = $('#name').val('guest');
  name.bind('input', function() {
    if (name.val().trim() === '') {
      return name.val('guest');
    } else {
      return name.val(name.val().trim());
    }
  });
  text = $('#text');
  make = function() {
    return new Date().getTime().toString();
  };
  mark = make();
  text.bind('input', function() {
    var data;
    data = {
      name: name.val(),
      text: text.val(),
      mark: mark
    };
    return s.emit('chat', data);
  });
  text.keydown(function(e) {
    var data;
    if (e.keyCode === 13) {
      data = {
        name: name.val(),
        text: text.val(),
        mark: mark
      };
      s.emit('save', data);
      mark = make();
      text.val('');
      return chat.scrollTop(chat.scrollTop() + 24);
    }
  });
  s.on('start', function(list) {
    return list.forEach(write);
  });
  s.on('chat', function(data) {
    return write(data);
  });
  chat = $('#chat');
  write = function(data) {
    var elem;
    show(data);
    elem = $("#" + (String(data.mark)));
    show(elem);
    if (found(elem)) {
      return elem.text(data.text);
    } else {
      return $('#chat').append(unit(data));
    }
  };
  return unit = function(data) {
    return "<div class='post'><div class='name'>" + data.name + "      </div><div id='" + data.mark + "' class='text'>    " + data.text + "</div></div>";
  };
});
