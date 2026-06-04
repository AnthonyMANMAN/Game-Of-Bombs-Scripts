(function() {
  if (document.getElementById('pt-panel')) return;

  var sl = angular.element(document.body).injector().get('serverList');

  function getCurrentServerId() {
    var el = document.querySelector('.butt_left_menu .colorRed');
    return el ? el.textContent.trim() : null;
  }

  function getDomainForServer(serverId) {
    var room = Object.values(sl.rooms).find(function(r) { return r.serverId === serverId; });
    return room ? room.domain : null;
  }

  var panel = document.createElement('div');
  panel.id = 'pt-panel';
  panel.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:99999;background:rgba(0,0,0,0.75);color:#fff;font-family:monospace;font-size:13px;padding:6px 12px;border-radius:6px;cursor:default;display:flex;align-items:center;gap:10px;';
  panel.innerHTML = '<span id="pt-srv" style="opacity:0.5;font-size:11px;">—</span><span id="pt-ms" style="font-size:18px;font-weight:bold;">—</span>';
  document.body.appendChild(panel);

  var ws = null, pingInterval = null, serverCheckInterval = null;
  var currentDomain = null, currentServerId = null;

  function colorFor(ms) { return ms < 80 ? '#1D9E75' : ms < 150 ? '#BA7517' : '#E24B4A'; }

  function setDisplay(serverId, ms, lost) {
    var srvEl = document.getElementById('pt-srv');
    var msEl = document.getElementById('pt-ms');
    if (!srvEl || !msEl) return;
    srvEl.textContent = serverId || '—';
    if (lost) {
      msEl.textContent = 'timeout';
      msEl.style.color = '#E24B4A';
    } else if (ms !== null) {
      msEl.textContent = ms + 'ms';
      msEl.style.color = colorFor(ms);
    } else {
      msEl.textContent = '—';
      msEl.style.color = '#fff';
    }
  }

  function doPing(domain) {
    if (!domain) return;
    var ssl = location.protocol === 'https:';
    var host = ssl ? domain.replace(':8080', ':8443') : domain;
    var proto = ssl ? 'wss:' : 'ws:';
    var sock;
    try { sock = new WebSocket(proto + '//' + host); } catch(e) { return; }

    var done = false;
    var timeout = setTimeout(function() {
      if (!done) { done = true; try { sock.close(); } catch(e) {} setDisplay(currentServerId, null, true); }
    }, 5000);

    sock.onopen = function() { sock.send(JSON.stringify({ pingtest: Date.now() })); };
    sock.onmessage = function(evt) {
      try {
        var res = JSON.parse(evt.data);
        if (res.pingtest) { sock.send(JSON.stringify({ time: Date.now() })); return; }
        if (!done && res.time) {
          done = true;
          clearTimeout(timeout);
          var ms = Math.round(Date.now() - res.time);
          setDisplay(currentServerId, ms, false);
          try { sock.close(); } catch(e) {}
        }
      } catch(e) {}
    };
    sock.onerror = function() {
      if (!done) { done = true; clearTimeout(timeout); setDisplay(currentServerId, null, true); }
    };
  }

  function checkAndPing() {
    var serverId = getCurrentServerId();
    var domain = serverId ? getDomainForServer(serverId) : null;
    if (serverId !== currentServerId || domain !== currentDomain) {
      currentServerId = serverId;
      currentDomain = domain;
      setDisplay(currentServerId, null, false);
    }
    if (currentDomain) doPing(currentDomain);
  }

  checkAndPing();
  serverCheckInterval = setInterval(checkAndPing, 10000);

  panel.addEventListener('click', checkAndPing);
  panel.title = 'click to ping now';
})();
