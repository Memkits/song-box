// Generated by CoffeeScript 1.4.0
var choose, get, increase_vol, list, list_remove, log, loop_it, play, query, set, song, tag,
  __slice = [].slice,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

log = function() {
  var args;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return console.log.apply(console, args);
};

song = {};

list = [];

set = function(key, value) {
  return localStorage.setItem(key, value);
};

get = function(key) {
  return localStorage.getItem(key);
};

query = function(str) {
  return document.querySelector(str);
};

tag = function(id) {
  return document.getElementById(id);
};

loop_it = false;

play = function(name) {
  var filename;
  if (song.src != null) {
    if (!song.paused) {
      song.pause();
    }
  }
  filename = "../mp3/dir/" + name;
  set('song', name);
  (tag('words')).innerText = name;
  song = new Audio(filename);
  song.play();
  if (loop_it) {
    song.loop = true;
  }
  song.addEventListener('loadedmetadata', function() {
    return song.addEventListener('timeupdate', function(a) {
      var percent;
      percent = song.currentTime / song.duration * 100;
      return (tag('step')).style.width = "" + percent + "%";
    });
  });
  song.addEventListener('play', function() {
    return (tag('toggle')).className = 'pressed';
  });
  song.addEventListener('pause', function() {
    return (tag('toggle')).className = 'released';
  });
  return song.addEventListener('ended', function() {
    var elem, next_elem;
    if ((tag('loop')).className !== 'pressed') {
      elem = query('#playing');
      next_elem = elem.nextElementSibling;
      log(elem, next_elem);
      if (next_elem != null) {
        return next_elem.click();
      } else {
        return (tag('like')).children[0].click();
      }
    }
  });
};

list_remove = function(list_a, item_a) {
  var list_b;
  list_b = [];
  list_a.forEach(function(item_b) {
    if (item_b !== item_a) {
      return list_b.push(item_b);
    }
  });
  return list_b;
};

choose = function(name) {
  var elem, json, parent, rm, up;
  log('name...', name, list);
  if (__indexOf.call(list, name) < 0) {
    json = {
      '.good-song': {
        'span': name,
        'span.icon.up': 'up',
        'span.icon.rm': 'rm'
      }
    };
    (tag('like')).insertAdjacentHTML('beforeend', tmpl(json));
    list.push(name);
    set('list', JSON.stringify(list));
    elem = query('#like>div:last-child');
    elem.onclick = function() {
      var playing;
      play(name);
      playing = query('#playing');
      if (playing != null) {
        playing.id = '';
      }
      return elem.id = 'playing';
    };
    parent = elem.parentElement;
    rm = elem.querySelector('.rm');
    rm.onclick = function(event) {
      parent.removeChild(elem);
      list = list_remove(list, name);
      set('list', JSON.stringify(list));
      return event.cancelBubble = true;
    };
    up = elem.querySelector('.up');
    return up.onclick = function(event) {
      var prev;
      prev = elem.previousElementSibling;
      if (prev) {
        parent.removeChild(prev);
        elem.insertAdjacentElement('afterend', prev);
      }
      return event.cancelBubble = true;
    };
  }
};

increase_vol = function(num) {
  var vol;
  vol = Number((tag('volume')).innerText);
  vol += num;
  if (vol < 0) {
    vol = 0;
  } else if (vol > 100) {
    vol = 100;
  }
  (tag('volume')).innerText = vol;
  song.volume = vol / 100;
  return set('vol', String(vol));
};

window.onload = function() {
  var last_list, req;
  last_list = get('list');
  if (last_list != null) {
    (JSON.parse(last_list)).forEach(choose);
  }
  req = new XMLHttpRequest;
  req.open('get', '../mp3/list.json', true);
  req.send();
  req.onload = function(obj) {
    var first, last_vol, vol_str;
    (JSON.parse(obj.target.response)).forEach(function(name) {
      var html;
      html = tmpl({
        ".song-name": name
      });
      (tag('menu')).insertAdjacentHTML('beforeend', html);
      return (query('#menu>div:last-child')).onclick = function() {
        return choose(name);
      };
    });
    first = (tag('like')).children[0];
    if (first != null) {
      first.click();
    }
    last_vol = get('vol');
    if (last_vol != null) {
      vol_str = Number(last_vol);
      (tag("volume")).innerText = vol_str;
      return increase_vol(+0);
    }
  };
  (tag('toggle')).onclick = function() {
    var elem;
    if ((tag('toggle')).className === 'pressed') {
      return song.pause();
    } else {
      if ((song != null) && (song.play != null)) {
        return song.play();
      } else {
        elem = query("#like .good-song:first-child");
        if (elem != null) {
          return elem.click();
        }
      }
    }
  };
  (tag('loop')).onclick = function() {
    if ((tag('loop')).className === 'pressed') {
      song.loop = false;
      loop_it = false;
      return (tag('loop')).className = 'released';
    } else {
      song.loop = true;
      loop_it = true;
      return (tag('loop')).className = 'pressed';
    }
  };
  document.body.onkeypress = function(event) {
    log(event.keyCode);
    if (event.keyCode === 32) {
      (tag('toggle')).click();
      return event.preventDefault();
    }
  };
  return (tag("volume")).onmousewheel = function(wheel) {
    var num;
    num = wheel.wheelDelta / 120;
    return increase_vol(num);
  };
};
