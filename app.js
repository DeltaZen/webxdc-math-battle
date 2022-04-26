// initialize PLAYERS
let PLAYERS = {};

/* https://telegram.org/js/games.js */
function mathGame() {
  function decode(a) {
    try {
      return decodeURIComponent(a);
    } catch (b) {
      return a;
    }
  }
  function n(a, b, c) {
    b || (b = function () {});
    void 0 === c && (c = "");
    if (void 0 !== window.TelegramWebviewProxy)
      TelegramWebviewProxy.postEvent(a, c), b();
    else if (window.external && "notify" in window.external)
      window.external.notify(
        JSON.stringify({
          eventType: a,
          eventData: c,
        })
      ),
        b();
    else if (f)
      try {
        var d = "https://web.telegram.org",
          d = "*";
        window.parent.postMessage(
          JSON.stringify({
            eventType: a,
            eventData: c,
          }),
          d
        );
      } catch (e) {
        b(e);
      }
    else
      b({
        notAvailable: !0,
      });
  }
  function l(a, b) {
    var c = f[a];
    if (void 0 !== c && c.length)
      for (var d = 0; d < c.length; d++)
        try {
          c[d](a, b);
        } catch (e) {}
  }
  var f = {},
    m = "";
  try {
    m = location.hash.toString();
  } catch (a) {}
  var pathAndkeys = (function (a) {
      a = a.replace(/^#/, "");
      var b = {};
      if (!a.length) return b;
      if (0 > a.indexOf("=") && 0 > a.indexOf("?"))
        return (b._path = decode(a)), b;
      var c = a.indexOf("?");
      if (0 <= c) {
        var d = a.substr(0, c);
        b._path = decode(d);
        a = a.substr(c + 1);
      }
      a = a.split("&");
      for (var e, c = 0; c < a.length; c++)
        (e = a[c].split("=")),
          (d = decode(e[0])),
          (e = null == e[1] ? null : decode(e[1])),
          (b[d] = e);
      return b;
    })(m),
    f = !1;
  try {
    f = null != window.parent && window != window.parent;
  } catch (a) {}
  window.TelegramGameProxy_receiveEvent = l;
  window.TelegramGameProxy = {
    initParams: pathAndkeys,
    receiveEvent: l,
    onEvent: function (a, b) {
      void 0 === f[a] && (f[a] = []);
      -1 === f[a].indexOf(b) && f[a].push(b);
    },
    shareScore: function () {
      n("share_score", function (a) {
        if (
          a &&
          (a = pathAndkeys.tgShareScoreUrl || pathAndkeys.shareScoreUrl)
        ) {
          var b = !1;
          try {
            b = window.open(a, "_blank");
          } catch (c) {
            b = !1;
          }
          b || (location.href = a);
        }
      });
    },
  };
}

/* Math Battle */
(function (win, doc) {
  function htmlElement(id) {
    return "string" == typeof id ? doc.getElementById(id) : id;
  }
  function replaceBOM(a) {
    return (a || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
  }
  function isBclassofA(a, b) {
    return (
      (a = htmlElement(a)) &&
      new RegExp("(\\s|^)" + b + "(\\s|$)").test(a.className)
    );
  }
  function addBclasstoA(a, b) {
    (a = htmlElement(a)) &&
      !isBclassofA(a, b) &&
      (a.className = replaceBOM(a.className + " " + b));
  }
  function removeBclassfromA(a, b) {
    (a = htmlElement(a)) &&
      isBclassofA(a, b) &&
      (a.className = replaceBOM(
        a.className.replace(new RegExp("(\\s+|^)" + b + "(\\s+|$)"), " ")
      ));
  }
  function toggleBonAdependingOnC(a, b, c) {
    ("undefined" == typeof c ? isBclassofA(a, b) : !c)
      ? removeBclassfromA(a, b)
      : addBclasstoA(a, b);
  }
  function addBListenerOnAwithC(elem, events, func) {
    if (
      ((elem = htmlElement(elem)),
      (func = func || rf),
      elem && 3 != elem.nodeType && 8 != elem.nodeType)
    ) {
      elem.setInterval && elem != win && (elem = win);
      events = events.split(" ");
      for (var d = 0, f = events.length; f > d; d++) {
        var e = events[d];
        elem.addEventListener
          ? elem.addEventListener(e, func, !1)
          : elem.attachEvent && elem.attachEvent("on" + e, func);
      }
    }
  }
  function integerBetween(a, b) {
    return Math.floor(Math.random() * (b - a + 1) + a);
  }
  function setMath() {
    var op = integerBetween(1, 4e3) % 4; // 0, 1, 2, 3
    var isCorrect = 500 >= integerBetween(1, 1e3); // 0, 1
    hard = 30 < currentScore;
    op = ["+", "\u2013", "\u00d7", "/"][op]; // + - * /
    switch (op) {
      case "+": // +
      case "\u2013": // -
        if ("+" == op) {
          var item1 = integerBetween(hard ? 10 : 0, hard ? 200 : 100);
          var item2 = integerBetween(hard ? 10 : 0, hard ? 200 : 100);
          var res = item1 + item2;
        } else
          (res = integerBetween(hard ? 10 : 0, hard ? 200 : 100)),
            (item2 = integerBetween(hard ? 10 : 0, hard ? 200 : 100)),
            (item1 = res + item2);
        if (!isCorrect) {
          var e = Math.min(item1, item2);
          e = Math.min(e, res);
          (e = integerBetween(-e, e)) || e++;
          res += e;
        }
        break;
      case "\u00d7": // *
      case "/": // /
        "\u00d7" == op
          ? ((item1 = integerBetween(hard ? 3 : 1, hard ? 20 : 10)),
            (item2 = integerBetween(hard ? 3 : 1, hard ? 20 : 10)),
            (res = item1 * item2))
          : ((res = integerBetween(hard ? 3 : 1, hard ? 20 : 10)),
            (item2 = integerBetween(hard ? 3 : 1, hard ? 20 : 10)),
            (item1 = res * item2)),
          isCorrect ||
            ((e = Math.min(item1, item2)),
            (e = Math.min(e, res)),
            (e = integerBetween(-e, e)) || e++,
            (res += e));
    }
    return {
      x: item1,
      op: op,
      y: item2,
      res: res,
      correct: isCorrect,
    };
  }
  function U() {
    clearTimeout(F);
    V(!0);
    clic && (F = setTimeout(U, 30));
  }
  function V(a, b) {
    if (0 < fecha - +new Date()) return handleTimeline(b);
    clearTimeout(F);
    clic = !1;
    a
      ? updateScoreboard()
      : handleTimeline(b, function () {
          updateScoreboard();
        });
  }
  function paintScore() {
    var a = +currentScore || "0";
    scoreValue.innerHTML = a;
    scoreValueResult.innerHTML = a;
  }
  function paintQuestion() {
    question &&
      ((itemX.innerHTML = +question.x || "0"),
      (operator.innerHTML = question.op || ""),
      (itemY.innerHTML = +question.y || "0"),
      (answer.innerHTML = +question.res || "0"));
  }
  function addTossingToX() {
    clearTimeout(X);
    addBclasstoA(task, "tossing");
    X = setTimeout(function () {
      removeBclassfromA(task, "tossing");
    }, 350);
  }
  function handleTimeline(a, func) {
    var c = (fecha - +new Date()) / 1e4;
    0 > c && (c = 0);
    1 < c && (c = 1);
    a &&
      (clearTimeout(timeoutId),
      addBclasstoA(timelineProgress, "animated"),
      (timeoutId = setTimeout(function () {
        removeBclassfromA(timelineProgress, "animated");
      }, 150)));
    timelineProgress.style.right = 100 - 100 * c + "%";
    func && setTimeout(func, 300);
  }
  function setCurrentScore() {
    console.log(scoreList);
    if (scoreList && scoreList.length)
      for (var a = 0; a < scoreList.length; a++) {
        var b = scoreList[a];
        console.log(b);
        if (b.current) {
          console.log("setCurrentScore:\n\n", b);
          lastScore = b.score;
          break;
        }
      }
  }
  function paintScoreboard() {
    if (!1 !== scoreList && n) {
      for (var a = "", b = 0; b < scoreList.length; b++) {
        var entry = scoreList[b];
        a +=
          '<li class="row' +
          (entry.current ? " you" : "") +
          '"><span class="place">' +
          `${b + 1}` +
          '.</span><span class="score">' +
          entry.score +
          '</span><div class="name">' +
          entry.name +
          "</div></li>";
      }
      table.innerHTML = a;
      0 < scoreList.length
        ? addBclasstoA(tableWrap, "opened")
        : removeBclassfromA(tableWrap, "opened");
    }
  }
  function sceneSelector() {
    toggleBonAdependingOnC(pageWrap, "in_greet", !A);
    toggleBonAdependingOnC(pageWrap, "in_game", !n);
    toggleBonAdependingOnC(pageWrap, "in_result", n);
  }
  function N() {
    clic = A = !0;
    n = !1;
    question = setMath();
    fecha = +new Date() + 1e4;
    currentScore = 0;
    f = !1;
    U();
    paintScore();
    paintQuestion();
    handleTimeline();
    sceneSelector();
    toggleBonAdependingOnC(scoreShare, "shown", f);
  }

  function setScore() {
    var array = [];
    Object.keys(PLAYERS).forEach((key) =>
      array.push({
        ...PLAYERS[key],
        current: false,
      })
    );

    scoreList = array.sort((a, b) => b.score - a.score);

    setCurrentScore();
    paintScoreboard();
    PLAYERS["new"] &&
      n &&
      ((f = !0), toggleBonAdependingOnC(scoreShare, "shown", f));
  }
  function getHighScores() {
    var array = [];
    Object.keys(PLAYERS).forEach((key) =>
      array.push({
        ...PLAYERS[key],
        current: true,
      })
    );
    array.sort((a, b) => b.score - a.score);
    if (array.length > 0) {
      console.log(array);
    }
    setCurrentScore();
    paintScoreboard();
  }
  function updateScoreboard() {
    if (!n) {
      n = !0;
      a: {
        var pts = currentScore;

        if (currentName && pts) {
          scoreList || (scoreList = []);
          var f = !1;
          for (cont = 0; cont < scoreList.length; cont++) {
            if (((objeto = scoreList[cont]), f)) {
              console.log("objeto =", objeto);
            } else
              pts > objeto.score &&
                ((scoreList[cont] = {
                  score: pts,
                  name: currentName,
                  current: !0,
                }),
                (f = objeto));
          }
        }
      }
      const info = currentName + " scored " + pts + " in Math Battle";
      if (PLAYERS[currentAddr] && PLAYERS[currentAddr].score < pts) {
        window.webxdc.sendUpdate(
          {
            payload: {
              addr: currentAddr,
              name: currentName,
              score: pts,
            },
            info: info,
          },
          info
        );
      } else if (PLAYERS[currentAddr] === undefined) {
        if (pts && pts > 0) {
          console.log("sendUpdate triggered");
          window.webxdc.sendUpdate(
            {
              payload: {
                addr: currentAddr,
                name: currentName,
                score: pts,
              },
              info: info,
            },
            info
          );
        }
      }
      paintScoreboard();
      currentScore > lastScore ? setScore() : getHighScores();
      sceneSelector();
    }
  }
  function handlePressedBtn(pressedBtn) {
    clic &&
      (!pressedBtn === !question.correct
        ? ((fecha += 1500),
          1e4 < fecha - +new Date() && (fecha = +new Date() + 1e4),
          currentScore++,
          paintScore())
        : ((fecha -= 4e3), addTossingToX()),
      V(!1, !pressedBtn !== !question.correct),
      (question = setMath()),
      paintQuestion());
  }
  function hoverClassFast(a) {
    addBclasstoA(a, "hover");
    setTimeout(function () {
      removeBclassfromA(a, "hover");
    }, 100);
  }
  var fecha,
    F,
    A = !1,
    clic = !1,
    n = !0,
    question,
    scoreList = !1,
    currentScore = 0,
    f,
    hash = (location.hash || "").substr(1);
  hash = hash.replace(/[\?&].*/g, "");
  var lastScore = 0,
    currentName = window.webxdc.selfName,
    currentAddr = window.webxdc.selfAddr;

  var scoreValue = htmlElement("score_value"),
    scoreValueResult = htmlElement("result_score_value"),
    scoreShare = htmlElement("score_share"),
    task = htmlElement("task"),
    itemX = htmlElement("task_x"),
    operator = htmlElement("task_op"),
    itemY = htmlElement("task_y"),
    answer = htmlElement("task_res"),
    timelineProgress = htmlElement("timeline_progress"),
    table = htmlElement("table"),
    tableWrap = htmlElement("table_wrap"),
    pageWrap = htmlElement("page_wrap");
  gameTitle = htmlElement("game_title");
  var correct = htmlElement("button_correct"),
    wrong = htmlElement("button_wrong"),
    X,
    timeoutId;
  addBListenerOnAwithC(gameTitle, "click", function () {
    A || N();
  });
  addBListenerOnAwithC(correct, "click", function () {
    !A || n ? N() : handlePressedBtn(!0);
  });
  addBListenerOnAwithC(wrong, "click", function () {
    clic && handlePressedBtn(!1);
  });
  addBListenerOnAwithC(scoreShare, "click", function () {
    f && TelegramGameProxy && TelegramGameProxy.shareScore();
  });
  addBListenerOnAwithC(doc, "keydown", function (a) {
    a.preventDefault();
    a = a.which || a.keyCode;
    clic
      ? (37 == a && (hoverClassFast(correct), handlePressedBtn(!0)),
        39 == a && (hoverClassFast(wrong), handlePressedBtn(!1)))
      : (A && !n) || 32 != a || (hoverClassFast(correct), N());
  });
  paintScore();
  paintQuestion();
  sceneSelector();
  getHighScores();
  var game = {
    obj: null,
    start: function (a) {
      a.touches &&
        1 == a.touches.length &&
        (game.end(a),
        (game.obj = this || null),
        game.obj && addBclasstoA(game.obj, "hover"));
    },
    cancel: function (a) {
      game.obj && game.end(a);
    },
    end: function () {
      game.obj &&
        (removeBclassfromA(game.obj, "hover"),
        (game.obj = null),
        (game.highlight = !1));
    },
    check: function (a) {
      if (!a) return !1;
      do
        if (isBclassofA(a, "button") || isBclassofA(a, "score_share")) return a;
      while ((a = a.parentNode));
      return !1;
    },
  };
  addBListenerOnAwithC(doc, "touchmove touchcancel", game.cancel);
  addBListenerOnAwithC(doc, "touchend", game.end);
  addBListenerOnAwithC(doc, "touchstart", function (a) {
    var b = game.check(a.target);
    b && game.start.call(b, a);
  });
  "ontouchstart" in doc || addBclasstoA(doc.body, "_hover");
})(window, document);

// handling updates

async function updateLoader() {
  window.webxdc.setUpdateListener((update) => {
    const player = update.payload;
    updateHighscore(player.addr, player.name, player.score);
    if (update.serial === update.max_serial) mathGame();
  });
}

function updateHighscore(addr, name, score) {
  PLAYERS[addr] = { addr: addr, name: name, score: score };
}

updateLoader().then(() => mathGame());
