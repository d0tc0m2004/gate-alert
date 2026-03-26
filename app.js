(function () {
  'use strict';

  // ============================================================
  // TRAIN SCHEDULE DATA
  // Times = estimated time at NLPD gate area in IST (24h)
  // days: null = daily, array of day numbers (0=Sun, 1=Mon ... 6=Sat)
  // Halting trains: exact NLPD timetable times
  // Non-stopping trains: estimated from GNT time ± 5 min
  // ============================================================
  var TRAINS = [
    // --- 19 trains that HALT at Nallapadu Jn (exact times) ---
    { id: '56503', name: 'Bengaluru Cantt – BZA Pass.',   time: '03:43', type: 'Passenger', days: null },
    { id: '77281', name: 'Guntur – Kacheguda DEMU',       time: '05:31', type: 'DEMU',      days: null },
    { id: '77248', name: 'Tenali – Markapur Rd DEMU',     time: '06:11', type: 'DEMU',      days: null },
    { id: '67228', name: 'Macherla – BZA MEMU',           time: '07:31', type: 'MEMU',      days: null },
    { id: '57203', name: 'Guntur – Macherla Pass.',        time: '08:10', type: 'Passenger', days: null },
    { id: '57317', name: 'Guntur – Macherla Pass.',        time: '08:13', type: 'Passenger', days: null },
    { id: '17329', name: 'Hubballi – BZA Exp.',            time: '08:14', type: 'Express',   days: null },
    { id: '67213', name: 'Macherla – BZA MEMU',           time: '08:45', type: 'MEMU',      days: null },
    { id: '67239', name: 'Markapur Rd – Tenali MEMU',     time: '11:49', type: 'MEMU',      days: null },
    { id: '57328', name: 'Guntur – Dhone Pass.',           time: '12:21', type: 'Passenger', days: null },
    { id: '77249', name: 'Markapur Rd – Tenali DEMU',     time: '13:01', type: 'DEMU',      days: null },
    { id: '57327', name: 'Dhone – Guntur Pass.',           time: '14:29', type: 'Passenger', days: null },
    { id: '17330', name: 'BZA – Hubballi Exp.',            time: '14:46', type: 'Express',   days: null },
    { id: '77297', name: 'Tenali – Macherla DEMU',        time: '17:23', type: 'DEMU',      days: null },
    { id: '67227', name: 'BZA – Macherla MEMU',           time: '17:55', type: 'MEMU',      days: null },
    { id: '57204', name: 'Macherla – Guntur Pass.',        time: '18:34', type: 'Passenger', days: null },
    { id: '57320', name: 'Macherla – Guntur Pass.',        time: '19:09', type: 'Passenger', days: null },
    { id: '77282', name: 'Kacheguda – Guntur DEMU',       time: '21:51', type: 'DEMU',      days: null },
    { id: '56504', name: 'BZA – Bengaluru Pass.',          time: '22:11', type: 'Passenger', days: null },

    // --- Non-stopping trains (estimated NLPD times from GNT ±5 min) ---
    // UP direction: NLPD time ~ GNT arrival - 5 min
    { id: '17226', name: 'Hubballi – Narasapur Amaravati', time: '02:20', type: 'Express', days: null },
    { id: '18464', name: 'Prasanti Exp. (SBC–BBS)',        time: '03:25', type: 'Express', days: null },
    { id: '17216', name: 'Dharmavaram – MTM Exp.',         time: '04:35', type: 'Express', days: null },
    { id: '17262', name: 'Tirupati – Guntur Exp.',         time: '07:15', type: 'Express', days: null },
    { id: '17252', name: 'Kacheguda – Guntur Exp.',        time: '10:35', type: 'Express', days: null },
    { id: '17227', name: 'Dhone – Guntur Exp.',            time: '13:55', type: 'Express', days: null },
    { id: '17254', name: 'Aurangabad – Guntur Exp.',       time: '21:50', type: 'Express', days: null },
    // DOWN direction: NLPD time ~ GNT departure + 5 min
    { id: '67238', name: 'Repalle – Markapur Rd MEMU',    time: '06:20', type: 'MEMU',    days: null },
    { id: '17253', name: 'Guntur – Aurangabad Exp.',       time: '07:25', type: 'Express', days: null },
    { id: '17228', name: 'Guntur – Dhone Exp.',            time: '13:05', type: 'Express', days: null },
    { id: '17261', name: 'Guntur – Tirupati Exp.',         time: '16:35', type: 'Express', days: null },
    { id: '17251', name: 'Guntur – Kacheguda Exp.',        time: '18:45', type: 'Express', days: null },
    { id: '18463', name: 'Prasanti Exp. (BBS–SBC)',        time: '20:40', type: 'Express', days: null },
    { id: '17225', name: 'Narasapur – Hubballi Amaravati', time: '21:15', type: 'Express', days: null },
    { id: '17215', name: 'MTM – Dharmavaram Exp.',         time: '22:45', type: 'Express', days: null },

    // --- Weekly / bi-weekly non-stopping trains ---
    // DOWN
    { id: '22883', name: 'Puri – YPR Garib Rath',          time: '06:35', type: 'Express', days: [6] },       // Sat
    { id: '22831', name: 'Howrah – YPR Superfast',          time: '10:45', type: 'Express', days: [4] },       // Thu
    { id: '18047', name: 'Shalimar – Vasco Amaravati',      time: '20:15', type: 'Express', days: [0,2,3,5] }, // Sun,Tue,Wed,Fri
    { id: '17211', name: 'Kondaveedu Exp. (BZA–KCG)',       time: '19:00', type: 'Express', days: [1,3,5] },   // Mon,Wed,Fri
    // UP
    { id: '18048', name: 'Vasco – Shalimar Amaravati',      time: '01:05', type: 'Express', days: [0,2,4,5] }, // Sun,Tue,Thu,Fri
    { id: '17212', name: 'Kondaveedu Exp. (KCG–BZA)',       time: '01:30', type: 'Express', days: [2,4,6] },   // Tue,Thu,Sat
    { id: '22884', name: 'YPR – Puri Garib Rath',           time: '11:15', type: 'Express', days: [0] },       // Sun
    { id: '22832', name: 'YPR – Howrah Superfast',           time: '16:35', type: 'Express', days: [5] },       // Fri
  ];

  // ============================================================
  // SETTINGS
  // ============================================================
  var settings = {
    travelTime: 10,
    closeBuffer: 10,
    openBuffer: 5,
    notificationsEnabled: false,
    soundEnabled: false,
    wakeLockEnabled: false,
  };

  var gateWindows = [];
  var lastComputeDate = null;
  var lastNotifiedWindowKey = null;
  var lastStatusType = null;
  var wakeLockSentinel = null;
  var audioCtx = null;

  // ============================================================
  // IST TIME HELPERS
  // ============================================================
  function getIST() {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  }

  function getISTToday() {
    var ist = getIST();
    return new Date(ist.getFullYear(), ist.getMonth(), ist.getDate());
  }

  function timeToDate(timeStr) {
    var parts = timeStr.split(':');
    var h = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    var today = getISTToday();
    today.setHours(h, m, 0, 0);
    return today;
  }

  function formatTime12(date) {
    var h = date.getHours();
    var m = date.getMinutes();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return h + ':' + String(m).padStart(2, '0') + ' ' + ampm;
  }

  function formatTimeFull(date) {
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + ' ' + ampm;
  }

  function formatCountdown(ms) {
    if (ms < 0) ms = 0;
    var totalSec = Math.floor(ms / 1000);
    var h = Math.floor(totalSec / 3600);
    var m = Math.floor((totalSec % 3600) / 60);
    var s = totalSec % 60;
    if (h > 0) {
      return h + 'h ' + m + 'm';
    }
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function formatDurationWords(ms) {
    if (ms < 0) ms = 0;
    var totalMin = Math.ceil(ms / 60000);
    if (totalMin >= 60) {
      var h = Math.floor(totalMin / 60);
      var m = totalMin % 60;
      return m > 0 ? h + 'h ' + m + ' min' : h + 'h';
    }
    return totalMin + ' min';
  }

  // ============================================================
  // CORE LOGIC — Gate Window Calculation
  // ============================================================
  function computeGateWindows() {
    // Filter trains that run today (IST day of week)
    var todayDay = getIST().getDay(); // 0=Sun, 1=Mon ... 6=Sat
    var todayTrains = TRAINS.filter(function (train) {
      if (!train.days) return true; // null = daily
      return train.days.indexOf(todayDay) !== -1;
    });

    var rawWindows = todayTrains.map(function (train) {
      var trainTime = timeToDate(train.time);
      var closeTime = new Date(trainTime.getTime() - settings.closeBuffer * 60000);
      var openTime = new Date(trainTime.getTime() + settings.openBuffer * 60000);
      return { closeTime: closeTime, openTime: openTime, trains: [train] };
    });

    rawWindows.sort(function (a, b) { return a.closeTime - b.closeTime; });

    var merged = [];
    for (var i = 0; i < rawWindows.length; i++) {
      var w = rawWindows[i];
      if (merged.length === 0) {
        merged.push({
          closeTime: new Date(w.closeTime),
          openTime: new Date(w.openTime),
          trains: w.trains.slice()
        });
        continue;
      }
      var last = merged[merged.length - 1];
      if (w.closeTime.getTime() <= last.openTime.getTime()) {
        if (w.openTime.getTime() > last.openTime.getTime()) {
          last.openTime = new Date(w.openTime);
        }
        last.trains = last.trains.concat(w.trains);
      } else {
        merged.push({
          closeTime: new Date(w.closeTime),
          openTime: new Date(w.openTime),
          trains: w.trains.slice()
        });
      }
    }
    return merged;
  }

  function ensureWindowsFresh() {
    var todayKey = getISTToday().toDateString();
    if (todayKey !== lastComputeDate) {
      gateWindows = computeGateWindows();
      lastComputeDate = todayKey;
    }
  }

  // ============================================================
  // DEPARTURE WINDOWS — safe time ranges to leave
  // ============================================================
  function computeDepartureWindows(now, count) {
    var windows = [];
    var nowMs = now.getTime();
    var travelMs = settings.travelTime * 60000;
    var searchFrom = nowMs;

    // Check if currently inside a closure — if so, start from when it opens
    for (var i = 0; i < gateWindows.length; i++) {
      var gw = gateWindows[i];
      if (nowMs >= gw.closeTime.getTime() && nowMs <= gw.openTime.getTime()) {
        searchFrom = gw.openTime.getTime();
        break;
      }
    }

    var safetyCount = 0;
    while (windows.length < count && safetyCount < 30) {
      safetyCount++;

      // Find the next gate closure after searchFrom
      var nextClosure = null;
      for (var j = 0; j < gateWindows.length; j++) {
        if (gateWindows[j].closeTime.getTime() > searchFrom) {
          nextClosure = gateWindows[j];
          break;
        }
      }

      if (!nextClosure) {
        // No more closures — safe from searchFrom until end of day
        var endOfDay = getISTToday();
        endOfDay.setHours(23, 59, 0, 0);
        if (searchFrom < endOfDay.getTime()) {
          windows.push({
            from: new Date(Math.max(searchFrom, nowMs)),
            to: null, // open-ended
            label: 'No more closures today',
          });
        }
        break;
      }

      // Safe window: from searchFrom to (closure - travel time)
      var safeEnd = nextClosure.closeTime.getTime() - travelMs;

      if (safeEnd > searchFrom && safeEnd > nowMs) {
        var fromTime = new Date(Math.max(searchFrom, nowMs));
        var durationMs = safeEnd - fromTime.getTime();
        windows.push({
          from: fromTime,
          to: new Date(safeEnd),
          durationMs: durationMs,
          nextTrain: nextClosure.trains[0],
        });
      }

      // Skip past this closure window
      searchFrom = nextClosure.openTime.getTime();
    }

    return windows;
  }

  // ============================================================
  // STATUS ENGINE
  // ============================================================
  function getStatus(now) {
    var travelMs = settings.travelTime * 60000;
    var nowMs = now.getTime();

    for (var i = 0; i < gateWindows.length; i++) {
      var w = gateWindows[i];
      if (nowMs >= w.closeTime.getTime() && nowMs <= w.openTime.getTime()) {
        return {
          type: 'closed',
          label: 'GATE CLOSED',
          sublabel: 'Gate reopens at ' + formatTime12(w.openTime),
          countdown: w.openTime.getTime() - nowMs,
          advice: 'Wait ' + formatDurationWords(w.openTime.getTime() - nowMs) + ', then leave',
          trains: w.trains,
          window: w,
        };
      }
    }

    var next = null;
    for (var j = 0; j < gateWindows.length; j++) {
      if (gateWindows[j].closeTime.getTime() > nowMs) {
        next = gateWindows[j];
        break;
      }
    }

    if (!next) {
      return {
        type: 'safe',
        label: 'ALL CLEAR',
        sublabel: 'No more gate closures today',
        countdown: null,
        advice: '',
        trains: [],
        window: null,
      };
    }

    var timeUntilClose = next.closeTime.getTime() - nowMs;
    var mustLeaveBy = next.closeTime.getTime() - travelMs;
    var timeToDecide = mustLeaveBy - nowMs;

    if (timeUntilClose <= travelMs) {
      return {
        type: 'wait',
        label: 'WAIT AT HOME',
        sublabel: 'Too late to beat the gate. Opens at ' + formatTime12(next.openTime),
        countdown: next.openTime.getTime() - nowMs,
        advice: 'Leave after ' + formatTime12(next.openTime),
        trains: next.trains,
        window: next,
      };
    } else if (timeToDecide <= 5 * 60000) {
      var waitUntil = formatTime12(next.openTime);
      var waitDur = formatDurationWords(next.openTime.getTime() - nowMs);
      return {
        type: 'hurry',
        label: 'LEAVE NOW',
        sublabel: 'Gate closes at ' + formatTime12(next.closeTime) + ' \u2014 you have ' + formatDurationWords(timeToDecide) + ' to leave',
        countdown: timeToDecide,
        advice: 'Leave NOW or wait ' + waitDur + ' (until ' + waitUntil + ')',
        trains: next.trains,
        window: next,
      };
    } else {
      return {
        type: 'safe',
        label: 'SAFE TO LEAVE',
        sublabel: 'Next closure at ' + formatTime12(next.closeTime) + ' (' + formatDurationWords(timeUntilClose) + ' away)',
        countdown: timeUntilClose,
        advice: 'Leave before ' + formatTime12(new Date(mustLeaveBy)) + ' to beat the gate',
        trains: next.trains,
        window: next,
      };
    }
  }

  // ============================================================
  // SOUND & VIBRATION ALERTS
  // ============================================================
  function getAudioContext() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        return null;
      }
    }
    return audioCtx;
  }

  function playAlertSound(type) {
    var ctx = getAudioContext();
    if (!ctx) return;

    // Resume context if suspended (autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    var now = ctx.currentTime;

    if (type === 'hurry') {
      // Urgent double-beep: two ascending tones
      [0, 0.25].forEach(function (offset) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now + offset);
        osc.frequency.linearRampToValueAtTime(1100, now + offset + 0.15);
        gain.gain.setValueAtTime(0.3, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.2);
        osc.start(now + offset);
        osc.stop(now + offset + 0.2);
      });
    } else if (type === 'wait') {
      // Low warning tone: descending
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.linearRampToValueAtTime(440, now + 0.4);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  }

  function vibratePhone(type) {
    if (!navigator.vibrate) return;
    if (type === 'hurry') {
      navigator.vibrate([200, 100, 200, 100, 200]); // urgent triple buzz
    } else if (type === 'wait') {
      navigator.vibrate([400, 200, 400]); // two long buzzes
    }
  }

  function triggerAlert(type) {
    if (!settings.soundEnabled) return;
    playAlertSound(type);
    vibratePhone(type);
  }

  // ============================================================
  // SCREEN WAKE LOCK
  // ============================================================
  function requestWakeLock() {
    if (!('wakeLock' in navigator)) return;
    navigator.wakeLock.request('screen').then(function (sentinel) {
      wakeLockSentinel = sentinel;
      sentinel.addEventListener('release', function () {
        wakeLockSentinel = null;
        // Re-acquire if still enabled and page is visible
        if (settings.wakeLockEnabled && document.visibilityState === 'visible') {
          requestWakeLock();
        }
      });
    }).catch(function () {
      // Wake lock request failed (e.g., low battery)
    });
  }

  function releaseWakeLock() {
    if (wakeLockSentinel) {
      wakeLockSentinel.release();
      wakeLockSentinel = null;
    }
  }

  function updateWakeLock() {
    if (settings.wakeLockEnabled) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
  }

  // Re-acquire wake lock when page becomes visible again
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && settings.wakeLockEnabled) {
      requestWakeLock();
    }
  });

  // ============================================================
  // NOTIFICATIONS
  // ============================================================
  function requestNotifications() {
    if (!('Notification' in window)) {
      alert('Notifications are not supported in this browser. Try Chrome or Edge.');
      return;
    }
    Notification.requestPermission().then(function (perm) {
      if (perm === 'granted') {
        settings.notificationsEnabled = true;
        saveSettings();
        updateNotifyButton();
        new Notification('Gate Alert', {
          body: 'Notifications enabled! You\'ll be alerted before gate closures.',
        });
      } else {
        settings.notificationsEnabled = false;
        saveSettings();
        updateNotifyButton();
      }
    });
  }

  function sendNotification(title, body) {
    if (!settings.notificationsEnabled) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    try {
      new Notification(title, { body: body, tag: 'gate-alert-' + Date.now() });
    } catch (e) { /* silently fail */ }
  }

  function checkNotifications(status) {
    if (!settings.notificationsEnabled) return;
    var windowKey = status.window ? String(status.window.closeTime.getTime()) : null;
    if (status.type === 'hurry' && lastNotifiedWindowKey !== windowKey) {
      sendNotification(
        'Leave NOW!',
        'Gate closes at ' + formatTime12(status.window.closeTime) + '. Leave immediately or wait until ' + formatTime12(status.window.openTime)
      );
      lastNotifiedWindowKey = windowKey;
    }
  }

  // ============================================================
  // UI RENDERING
  // ============================================================
  function updateUI() {
    ensureWindowsFresh();

    var now = getIST();
    var status = getStatus(now);

    // Current time
    document.getElementById('currentTime').textContent = formatTimeFull(now);

    // Detect status change for sound/vibration alerts
    if (lastStatusType !== null && lastStatusType !== status.type) {
      if (status.type === 'hurry' || status.type === 'wait') {
        triggerAlert(status.type);
      }
    }
    lastStatusType = status.type;

    // Status card
    var card = document.getElementById('statusCard');
    card.className = 'status-card ' + status.type;
    document.getElementById('statusLabel').textContent = status.label;
    document.getElementById('statusSublabel').textContent = status.sublabel;

    var countdownEl = document.getElementById('statusCountdown');
    if (status.countdown !== null) {
      countdownEl.textContent = formatCountdown(status.countdown);
      countdownEl.style.display = '';
    } else {
      countdownEl.textContent = '';
      countdownEl.style.display = 'none';
    }

    var adviceEl = document.getElementById('statusAdvice');
    if (status.advice) {
      adviceEl.textContent = status.advice;
      adviceEl.classList.add('visible');
    } else {
      adviceEl.textContent = '';
      adviceEl.classList.remove('visible');
    }

    var trainEl = document.getElementById('statusTrain');
    if (status.trains.length > 0) {
      trainEl.textContent = status.trains.map(function (t) { return '#' + t.id + ' ' + t.name; }).join('  |  ');
    } else {
      trainEl.textContent = '';
    }

    // Quick info cards
    var nowMs = now.getTime();
    var currentClosure = null;
    var nextClosure = null;

    for (var i = 0; i < gateWindows.length; i++) {
      var w = gateWindows[i];
      if (nowMs >= w.closeTime.getTime() && nowMs <= w.openTime.getTime()) {
        currentClosure = w;
        break;
      }
      if (w.closeTime.getTime() > nowMs && !nextClosure) {
        nextClosure = w;
      }
    }

    if (currentClosure) {
      document.getElementById('nextClosureTime').textContent = 'NOW';
      document.getElementById('nextSafeTime').textContent = formatTime12(currentClosure.openTime);
    } else if (nextClosure) {
      document.getElementById('nextClosureTime').textContent = formatTime12(nextClosure.closeTime);
      document.getElementById('nextSafeTime').textContent = formatTime12(nextClosure.openTime);
    } else {
      document.getElementById('nextClosureTime').textContent = 'None';
      document.getElementById('nextSafeTime').textContent = 'Now';
    }

    // Departure windows
    updateDepartureWindows(now);

    // Timeline
    updateTimeline(now);

    // Schedule
    updateSchedule(now);

    // Notifications
    checkNotifications(status);
  }

  // ============================================================
  // DEPARTURE WINDOWS RENDERING
  // ============================================================
  function updateDepartureWindows(now) {
    var list = document.getElementById('departureList');
    var windows = computeDepartureWindows(now, 4);

    if (windows.length === 0) {
      list.innerHTML = '<div class="departure-none">No safe windows available right now</div>';
      return;
    }

    var nowMs = now.getTime();
    var html = '';

    for (var i = 0; i < windows.length; i++) {
      var dw = windows[i];
      var isNow = dw.from.getTime() <= nowMs + 60000; // within 1 minute of now
      var className = 'departure-item' + (isNow ? ' now' : ' upcoming');

      var timeRange;
      var hint;
      var durText;

      if (dw.to === null) {
        // Open-ended — no more closures
        timeRange = 'After ' + formatTime12(dw.from);
        hint = 'No more gate closures today';
        durText = 'All clear';
      } else {
        var fromStr = isNow ? 'Now' : formatTime12(dw.from);
        timeRange = fromStr + ' \u2192 ' + formatTime12(dw.to);
        durText = formatDurationWords(dw.durationMs);

        if (isNow) {
          hint = 'Leave within ' + formatDurationWords(dw.to.getTime() - nowMs) + ' to beat the gate';
        } else {
          hint = 'Before #' + dw.nextTrain.id + ' ' + dw.nextTrain.name;
        }
      }

      var icon = isNow ? '\uD83D\uDFE2' : '\u23F3'; // green circle or hourglass

      html += '<div class="' + className + '">' +
        '<div class="departure-icon">' + icon + '</div>' +
        '<div class="departure-details">' +
          '<div class="departure-time">' + timeRange + '</div>' +
          '<div class="departure-hint">' + hint + '</div>' +
        '</div>' +
        '<div class="departure-duration">' + durText + '</div>' +
      '</div>';
    }

    list.innerHTML = html;
  }

  // ============================================================
  // TIMELINE RENDERING
  // ============================================================
  function updateTimeline(now) {
    var track = document.getElementById('timelineTrack');
    var nowMarker = document.getElementById('timelineNow');

    var oldBlocks = track.querySelectorAll('.timeline-block');
    for (var i = 0; i < oldBlocks.length; i++) {
      oldBlocks[i].remove();
    }

    var dayStart = getISTToday();
    var dayMs = 24 * 60 * 60 * 1000;
    var nowMs = now.getTime();

    for (var j = 0; j < gateWindows.length; j++) {
      var w = gateWindows[j];
      var startPct = ((w.closeTime.getTime() - dayStart.getTime()) / dayMs) * 100;
      var endPct = ((w.openTime.getTime() - dayStart.getTime()) / dayMs) * 100;

      var block = document.createElement('div');
      block.className = 'timeline-block';

      if (w.openTime.getTime() < nowMs) {
        block.classList.add('past');
      } else if (nowMs >= w.closeTime.getTime() && nowMs <= w.openTime.getTime()) {
        block.classList.add('active');
      }

      block.style.left = startPct + '%';
      block.style.width = Math.max(0.3, endPct - startPct) + '%';
      block.title = formatTime12(w.closeTime) + ' \u2013 ' + formatTime12(w.openTime) +
        ' (' + w.trains.map(function (t) { return '#' + t.id; }).join(', ') + ')';

      track.appendChild(block);
    }

    var nowPct = ((nowMs - dayStart.getTime()) / dayMs) * 100;
    nowMarker.style.left = Math.min(100, Math.max(0, nowPct)) + '%';
  }

  // ============================================================
  // SCHEDULE RENDERING
  // ============================================================
  function updateSchedule(now) {
    var list = document.getElementById('scheduleList');
    var nowMs = now.getTime();
    var foundNext = false;

    var html = '';
    for (var i = 0; i < gateWindows.length; i++) {
      var w = gateWindows[i];
      var isPast = w.openTime.getTime() < nowMs;
      var isActive = nowMs >= w.closeTime.getTime() && nowMs <= w.openTime.getTime();
      var isNext = false;
      if (!isPast && !isActive && !foundNext) {
        isNext = true;
        foundNext = true;
      }

      var className = 'schedule-item';
      if (isPast) className += ' past';
      if (isActive) className += ' active';
      if (isNext) className += ' next';

      var durationMin = Math.round((w.openTime.getTime() - w.closeTime.getTime()) / 60000);

      var badges = '';
      var seenTypes = {};
      for (var j = 0; j < w.trains.length; j++) {
        var t = w.trains[j];
        if (!seenTypes[t.type]) {
          seenTypes[t.type] = true;
          badges += '<span class="badge badge-' + t.type.toLowerCase() + '">' + t.type + '</span>';
        }
      }

      var trainList = w.trains.map(function (t) { return '#' + t.id + ' ' + t.name; }).join('<br>');

      var statusTag = '';
      if (isActive) statusTag = ' <span style="color:var(--red);font-weight:600;font-size:0.72rem">CLOSED NOW</span>';
      else if (isNext) statusTag = ' <span style="color:var(--amber);font-weight:600;font-size:0.72rem">UP NEXT</span>';

      html += '<div class="' + className + '">' +
        '<div class="schedule-row-top">' +
          '<span class="schedule-time">' + formatTime12(w.closeTime) + ' \u2013 ' + formatTime12(w.openTime) + '</span>' +
          '<span class="schedule-duration">' + durationMin + ' min' + statusTag + '</span>' +
        '</div>' +
        '<div class="schedule-trains">' + trainList + '</div>' +
        '<div class="schedule-badges">' + badges + '</div>' +
      '</div>';
    }

    list.innerHTML = html;
  }

  function renderTimelineLabels() {
    var container = document.getElementById('timelineLabels');
    var hours = [0, 3, 6, 9, 12, 15, 18, 21, 24];
    container.innerHTML = hours.map(function (h) {
      return '<span>' + String(h).padStart(2, '0') + '</span>';
    }).join('');
  }

  // ============================================================
  // SETTINGS PERSISTENCE
  // ============================================================
  function loadSettings() {
    try {
      var saved = localStorage.getItem('gateAlertSettings');
      if (saved) {
        var parsed = JSON.parse(saved);
        settings.travelTime = parsed.travelTime || settings.travelTime;
        settings.closeBuffer = parsed.closeBuffer || settings.closeBuffer;
        settings.openBuffer = parsed.openBuffer || settings.openBuffer;
        settings.notificationsEnabled = !!parsed.notificationsEnabled;
        settings.soundEnabled = !!parsed.soundEnabled;
        settings.wakeLockEnabled = !!parsed.wakeLockEnabled;
      }
    } catch (e) { /* ignore */ }
  }

  function saveSettings() {
    try {
      localStorage.setItem('gateAlertSettings', JSON.stringify(settings));
    } catch (e) { /* ignore */ }
  }

  function updateNotifyButton() {
    var btn = document.getElementById('notifyBtn');
    var hint = document.getElementById('notifyHint');
    if (settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      btn.textContent = 'Notifications Enabled';
      btn.classList.add('enabled');
      hint.textContent = 'You\'ll get browser alerts before gate closures';
    } else {
      btn.textContent = 'Enable Notifications';
      btn.classList.remove('enabled');
      hint.textContent = 'Get browser alerts before upcoming gate closures';
    }
  }

  function syncSettingsUI() {
    document.getElementById('travelTimeInput').value = settings.travelTime;
    document.getElementById('travelTimeDisplay').textContent = settings.travelTime + ' min';
    document.getElementById('closeBufferInput').value = settings.closeBuffer;
    document.getElementById('closeBufferDisplay').textContent = settings.closeBuffer + ' min';
    document.getElementById('openBufferInput').value = settings.openBuffer;
    document.getElementById('openBufferDisplay').textContent = settings.openBuffer + ' min';
    document.getElementById('soundToggle').checked = settings.soundEnabled;
    document.getElementById('wakeLockToggle').checked = settings.wakeLockEnabled;
    updateNotifyButton();
  }

  // ============================================================
  // SETTINGS PANEL INTERACTIONS
  // ============================================================
  function setupSettings() {
    var toggle = document.getElementById('settingsToggle');
    var panel = document.getElementById('settingsPanel');
    var overlay = document.getElementById('settingsOverlay');
    var closeBtn = document.getElementById('settingsClose');

    function openSettings() {
      panel.classList.add('open');
      overlay.classList.add('visible');
    }

    function closeSettings() {
      panel.classList.remove('open');
      overlay.classList.remove('visible');
    }

    toggle.addEventListener('click', openSettings);
    overlay.addEventListener('click', closeSettings);
    closeBtn.addEventListener('click', closeSettings);

    // Travel time
    document.getElementById('travelTimeInput').addEventListener('input', function (e) {
      settings.travelTime = parseInt(e.target.value, 10);
      document.getElementById('travelTimeDisplay').textContent = settings.travelTime + ' min';
      saveSettings();
    });

    // Close buffer
    document.getElementById('closeBufferInput').addEventListener('input', function (e) {
      settings.closeBuffer = parseInt(e.target.value, 10);
      document.getElementById('closeBufferDisplay').textContent = settings.closeBuffer + ' min';
      gateWindows = computeGateWindows();
      lastComputeDate = getISTToday().toDateString();
      saveSettings();
    });

    // Open buffer
    document.getElementById('openBufferInput').addEventListener('input', function (e) {
      settings.openBuffer = parseInt(e.target.value, 10);
      document.getElementById('openBufferDisplay').textContent = settings.openBuffer + ' min';
      gateWindows = computeGateWindows();
      lastComputeDate = getISTToday().toDateString();
      saveSettings();
    });

    // Notifications
    document.getElementById('notifyBtn').addEventListener('click', function () {
      if (settings.notificationsEnabled) {
        settings.notificationsEnabled = false;
        saveSettings();
        updateNotifyButton();
      } else {
        requestNotifications();
      }
    });

    // Sound toggle
    document.getElementById('soundToggle').addEventListener('change', function (e) {
      settings.soundEnabled = e.target.checked;
      saveSettings();
      // Initialize audio context on user interaction (required by browsers)
      if (settings.soundEnabled) {
        getAudioContext();
      }
    });

    // Wake lock toggle
    document.getElementById('wakeLockToggle').addEventListener('change', function (e) {
      settings.wakeLockEnabled = e.target.checked;
      saveSettings();
      updateWakeLock();
    });
  }

  // ============================================================
  // SERVICE WORKER REGISTRATION
  // ============================================================
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(function () {
        // Service worker registration failed — app still works without it
      });
    }
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================
  function init() {
    loadSettings();
    gateWindows = computeGateWindows();
    lastComputeDate = getISTToday().toDateString();

    renderTimelineLabels();
    setupSettings();
    syncSettingsUI();
    updateUI();
    updateWakeLock();
    registerServiceWorker();

    // Update every second for live countdown
    setInterval(updateUI, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
