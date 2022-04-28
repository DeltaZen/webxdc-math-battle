let PLAYERS = {},
    deadline,
    updateTimeoutId,
    firstTime = true,
    playing = false,
    question,
    scoreList = false,
    currentScore = 0,
    lastScore = 0;
var scoreValue = htmlElement("score-value"),
    scoreValueResult = htmlElement("result_score_value"),
    task = htmlElement("task"),
    itemX = htmlElement("task_x"),
    operator = htmlElement("task_op"),
    itemY = htmlElement("task_y"),
    result = htmlElement("task_res"),
    timelineProgress = htmlElement("timeline_progress"),
    table = htmlElement("table"),
    tableWrap = htmlElement("table-wrap"),
    pageWrap = htmlElement("page-wrap"),
    gameTitle = htmlElement("game-title"),
    correctBtn = htmlElement("correct-btn"),
    wrongBtn = htmlElement("wrong-btn"),
    shakeTimeoutId,
    timerAnimTimeoutId;

let clickEffect = {
    obj: null,
    start: function (elem) {
        elem.touches &&
            1 == elem.touches.length &&
            (clickEffect.end(),
             (clickEffect.obj = this || null),
             clickEffect.obj && addClass(clickEffect.obj, "hover"));
    },
    cancel: function () {
        clickEffect.obj && clickEffect.end();
    },
    end: function () {
        clickEffect.obj &&
            (removeClass(clickEffect.obj, "hover"),
             (clickEffect.obj = null),
             (clickEffect.highlight = false));
    },
    check: function (elem) {
        if (!elem) return false;
        do
            if (hasClass(elem, "button")) return elem;
        while ((elem = elem.parentNode));
        return false;
    },
};

function htmlElement(id) {
    return "string" == typeof id ? document.getElementById(id) : id;
}

function stripEmptySpaces(str) {
    return (str || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
}

function hasClass(elem, cls) {
    return (
        (elem = htmlElement(elem)) &&
            new RegExp("(\\s|^)" + cls + "(\\s|$)").test(elem.className)
    );
}

function addClass(elem, cls) {
    (elem = htmlElement(elem)) &&
        !hasClass(elem, cls) &&
        (elem.className = stripEmptySpaces(elem.className + " " + cls));
}

function removeClass(elem, cls) {
    (elem = htmlElement(elem)) &&
        hasClass(elem, cls) &&
        (elem.className = stripEmptySpaces(
            elem.className.replace(new RegExp("(\\s+|^)" + cls + "(\\s+|$)"), " ")
        ));
}

function setClassIf(elem, cls, add) {
    add? addClass(elem, cls) : removeClass(elem, cls);
}

function setEventsListener(elem, events, func) {
    if (
        ((elem = htmlElement(elem)),
         elem && 3 != elem.nodeType && 8 != elem.nodeType)
    ) {
        elem.setInterval && elem != window && (elem = window);
        events = events.split(" ");
        for (var d = 0, f = events.length; f > d; d++) {
            var e = events[d];
            elem.addEventListener
                ? elem.addEventListener(e, func, false)
                : elem.attachEvent && elem.attachEvent("on" + e, func);
        }
    }
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function setMath() {
    var op = ["+", "\u2013", "\u00d7", "/"][randInt(1, 4000) % 4]; // + - * /
    var isCorrect = 500 >= randInt(1, 1000);
    hard = currentScore > 30;
    switch (op) {
    case "+": // +
    case "\u2013": // -
        if ("+" == op) {
            var item1 = randInt(hard ? 10 : 0, hard ? 200 : 100);
            var item2 = randInt(hard ? 10 : 0, hard ? 200 : 100);
            var res = item1 + item2;
        } else
            (res = randInt(hard ? 10 : 0, hard ? 200 : 100)),
        (item2 = randInt(hard ? 10 : 0, hard ? 200 : 100)),
        (item1 = res + item2);
        if (!isCorrect) {
            var e = Math.min(item1, item2);
            e = Math.min(e, res);
            (e = randInt(-e, e)) || e++;
            res += e;
        }
        break;
    case "\u00d7": // *
    case "/": // /
        "\u00d7" == op
            ? ((item1 = randInt(hard ? 3 : 1, hard ? 20 : 10)),
               (item2 = randInt(hard ? 3 : 1, hard ? 20 : 10)),
               (res = item1 * item2))
            : ((res = randInt(hard ? 3 : 1, hard ? 20 : 10)),
               (item2 = randInt(hard ? 3 : 1, hard ? 20 : 10)),
               (item1 = res * item2)),
        isCorrect ||
            ((e = Math.min(item1, item2)),
             (e = Math.min(e, res)),
             (e = randInt(-e, e)) || e++,
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

function sceneSelector() {
    setClassIf(pageWrap, "in_greet", firstTime);
    setClassIf(pageWrap, "in_game", playing);
    setClassIf(pageWrap, "in_result", !playing);
}

function hoverEffect(elem) {
    addClass(elem, "hover");
    setTimeout(function () {
        removeClass(elem, "hover");
    }, 100);
}

function paintScore() {
    let score = +currentScore || "0";
    scoreValue.innerHTML = score;
    scoreValueResult.innerHTML = score;
}

function paintQuestion() {
    if (question) {
        itemX.innerHTML = +question.x || "0";
        operator.innerHTML = question.op || "";
        itemY.innerHTML = +question.y || "0";
        result.innerHTML = +question.res || "0";
    }
}

function shakeTask() {
    clearTimeout(shakeTimeoutId);
    addClass(task, "tossing");
    shakeTimeoutId = setTimeout(() => removeClass(task, "tossing"), 350);
}

function updateTimer(failed) {
    var percent = (deadline - +new Date()) / 10000;
    if (percent < 0)
        percent = 0;  // 0%
    else if (percent > 1)
        percent = 1;  // 100%
    if (failed) {
        clearTimeout(timerAnimTimeoutId);
        addClass(timelineProgress, "animated");
        timerAnimTimeoutId = setTimeout(function () {
            removeClass(timelineProgress, "animated");
        }, 150);
    }
    timelineProgress.style.right = 100 - 100 * percent + "%";
}

function checkAnswer(answer) {
    if (playing) {
        if (answer === question.correct) {
            deadline += 1500;
            if (deadline - +new Date() > 10000) deadline = +new Date() + 10000;
            currentScore++;
            paintScore();
        } else {
            deadline -= 4000;
            shakeTask();
        }
        updateState(answer !== question.correct);
        question = setMath();
        paintQuestion();
    }
}

function startGame() {
    playing = true;
    firstTime = false;
    question = setMath();
    deadline = +new Date() + 10000;
    currentScore = 0;
    updateLoop();  // start the update loop
    paintScore();
    paintQuestion();
    updateTimer();
    sceneSelector();
}

function updateLoop() {
    clearTimeout(updateTimeoutId);
    updateState();
    if (playing) updateTimeoutId = setTimeout(updateLoop, 30);
}

function updateState(failed) {
    if (deadline - +new Date() > 0) return updateTimer(failed);
    // game over
    clearTimeout(updateTimeoutId);  // stop the update loop
    playing = false;
    if (failed !== undefined) {
        updateTimer(failed);
        setTimeout(updateScoreboard, 300);
    } else {
        updateScoreboard();
    }
}



function setCurrentScore() {
    if (scoreList && scoreList.length)
        for (var a = 0; a < scoreList.length; a++) {
            var b = scoreList[a];
            if (b.current) {
                lastScore = b.score;
                break;
            }
        }
}
function paintScoreboard() {
    if (scoreList !== false && !playing) {
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
            ? addClass(tableWrap, "opened")
            : removeClass(tableWrap, "opened");
    }
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
}
function getHighScores() {
    var array = [];
    Object.keys(PLAYERS).forEach(
        (key) =>
            array.push({
                ...PLAYERS[key],
                current: true,
            })
    );
    array.sort((a, b) => b.score - a.score);
    setScore();
    paintScoreboard();
}
function updateScoreboard() {
    var pts = currentScore;

    if (window.webxdc.selfName && pts) {
        scoreList || (scoreList = []);
        var f = false;
        for (cont = 0; cont < scoreList.length; cont++) {
            if (((objeto = scoreList[cont]), f)) {
                console.log("objeto =", objeto);
            } else
                pts > objeto.score &&
                ((scoreList[cont] = {
                    score: pts,
                    name: window.webxdc.selfName,
                    current: true,
                }),
                 (f = objeto));
        }
    }
    const info = window.webxdc.selfName + " scored " + pts + " in Math Battle";
    if (PLAYERS[window.webxdc.selfAddr] && PLAYERS[window.webxdc.selfAddr].score < pts) {
        window.webxdc.sendUpdate(
            {
                payload: {
                    addr: window.webxdc.selfAddr,
                    name: window.webxdc.selfName,
                    score: pts,
                },
                info: info,
            },
            info
        );
    } else if (PLAYERS[window.webxdc.selfAddr] === undefined) {
        if (pts && pts > 0) {
            window.webxdc.sendUpdate(
                {
                    payload: {
                        addr: window.webxdc.selfAddr,
                        name: window.webxdc.selfName,
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

onload = () => {
    // click effect in buttons:
    setEventsListener(document, "touchmove touchcancel", clickEffect.cancel);
    setEventsListener(document, "touchend", clickEffect.end);
    setEventsListener(document, "touchstart", function (event) {
        let elem = clickEffect.check(event.target);
        elem && clickEffect.start.call(elem, event);
    });
    "ontouchstart" in document || addClass(document.body, "_hover");

    setEventsListener(gameTitle, "click",  () => {
        if (firstTime) startGame();
    });
    setEventsListener(correctBtn, "click", function () {
        playing ? checkAnswer(true) : startGame();
    });
    setEventsListener(wrongBtn, "click", function () {
        if (playing) checkAnswer(false);
    });
    setEventsListener(document, "keydown", function (event) {
        event.preventDefault();
        let key = event.which || event.keyCode;
        if (playing) {
            if (37 == key) {  // left arrow pressed
                hoverEffect(correctBtn);
                checkAnswer(true);
            } else if (39 == key) {  // right arrow pressed
                hoverEffect(wrongBtn);
                checkAnswer(false);
            }
        } else if (32 == key) {  // not playing and spacebar was pressed
            hoverEffect(correctBtn);
            startGame();
        }
    });

    paintScore();
    paintQuestion();
    sceneSelector();
    getHighScores();

    window.webxdc.setUpdateListener((update) => {
        const player = update.payload;
        const prevScore = PLAYERS[player.addr]? PLAYERS[player.addr].score : 0;
        if (prevScore < player.score) {
            PLAYERS[player.addr] = { name: player.name, score: player.score };
        }
        if (update.serial === update.max_serial && !playing) {
            paintScore();
            paintQuestion();
            sceneSelector();
            getHighScores();
        }
    }, 0);
};
