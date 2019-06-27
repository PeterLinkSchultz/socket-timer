import $ from 'jquery';
import io from 'socket.io-client';
import { Timer } from './Timer.js';

import './index.css';

function Tree (_addLog) {
    let tree,
        data = {},
        rooms = $("#rooms"),
        objects = $("#objects"),
        secrets = $("#secrets"),
        currentRoom,
        _socket,
        addLog = _addLog,
        _timer,
        currentObject,
        currentSecret,
        current;

    function setSocket(socket) {
        _socket = socket;
        return this;
    }
    function setData(lang) {
        tree = data[lang];
        renderRooms();
        return this;
    }
    function loadData(_data, lang) {
        data[lang] = _data;
        return this;
    }
    function setRoom (key) {
        currentRoom = { name: tree[key].name, tree: tree[key].objects };
        renderObject();
    }
    function setObject (key) {
        currentObject = { name: currentRoom.tree[key].name, tree: currentRoom.tree[key].secrets };
        renderSecret();
    }
    function setSecret (key) {
        let date = new Date();
        currentSecret = { name: currentObject.tree[key].name, text: currentObject.tree[key].text, img: currentObject.tree[key].img };
        current = {
            chain: currentRoom.name+" "+currentObject.name+" "+currentSecret.name,
            text: currentSecret.text,
            timer: _timer.toString(),
            time: `${date.toTimeString().substr(0,9)}`
        };
        if (currentSecret.img) {
            current["img"] = currentSecret.img;
        }
        Confirm( setMessage, current );
    }
    function setMessage (error, success) {
        if ( error ) {
            console.log('reject');
        } else {
            addLog(success);
            _socket.emit('info:set', success);
        }
    }
    function renderRooms () {
        objects.html("");
        secrets.html("");
        rooms.html("");
        tree.forEach( (item, key) => {
            Room(item, rooms, setRoom, key);
        });
    }
    function renderObject () {
        objects.html("");
        secrets.html("");
        currentRoom.tree.forEach( (item, key) => {
            Room(item, objects, setObject, key);
        });
    }
    function renderSecret () {
        secrets.html("");
        console.log(currentObject.tree);
        currentObject.tree.forEach( (item, key) => {
            Secret(item, secrets, setSecret, key);
        });
    }
    function setTimer(timer) {
        _timer = timer;
    }
    return {
        renderRooms,
        setData,
        loadData,
        setSocket,
        setTimer
    };
}
function Room (data, parent, callback, key) {
    let _data = data,
        _parent = parent,
        room = $(`<li>${_data.name}</li>`).click( () => { callback(key) });

    function render () {
        _parent.append(room);
    }
    render();
}
function Secret (data, parent, callback, key) {
    let _data = data,
        _parent = parent,
        room = $(`<li><p>${_data.name}</p><p>${_data.text}</p></li>`).click( () => { callback(key) });

    function render () {
        _parent.append(room);
    }
    render();
}
function Confirm (callback, info) {
    let confirm = $("#confirm"),
        _callback = callback,
        success = $("<a>Yes</a>"),
        cancel = $("<a>No</a>");

    success.click( () => {
        _callback( false, info );
        clear();
    });
    cancel.click( () => {
        _callback( true );
        clear();
    });
    function clear () {
        confirm.html("");
        confirm.removeClass('active');
    }
    function render () {
        confirm.append(success).append(cancel);
        confirm.addClass('active');
    }
    render();
}

function Logger(_root) {
    let root = _root,
        logs = [],
        table = $('<table class="logger">'),
        thead = $('<thead>'),
        tbody = $('<tbody>');

    function printLog() {
        const log = logs[0];
        const tr = $('<tr>');
        tr.append(`<td>${log.time}</td><td>${log.timer}</td><td>${log.chain}</td>`);
        tbody.prepend(tr);
    }

    function addLog(log) {
        logs.unshift(log);
        printLog();
    }

    function clearLog() {
        tbody.html('');
    }

    const render = function () {
        thead.append('<tr><th>Time</th><th>Timer</th><th>Chain</th></tr>');
        table.append(thead);
        table.append(tbody);
        root.append(table);
    }();

    return {
        clearLog,
        addLog
    }
}
function Lang(_root, _lang, _callback, _default) {
    let root = _root,
        cont = $('<div class="lang-cont">'),
        lang = _lang,
        current = _default,
        buttons = [],
        callback = _callback;

    function render() {
        cont.html("");
        lang.forEach( (item) => {
           const button = $(`<div class="lang">${item}</div>`).click( (e) => {
               if ( current !== item) {
                   current = item;
                   callback(item);
                   render();
               }
           });
           if ( current === item )
               button.addClass('active');
           cont.append(button);
        });
    }

    const mount = function() {
        root.append(cont);
        render();
    }();

    return {

    }
}
function Field() {

    const start = 59;
    let currentMinutes = 59,
        currentSeconds = 59,
        isDirtyM = false,
        isDirtyS = false;

    const mask = /[0-5]{1}[0-9]{1}/;

    const minutes = $(`<input class="field" id="minutes" maxlength="2" value="${start}"/>`);
    const delimiter = $('<span class="delimiter">:</span>');
    const seconds = $(`<input class="field" id="seconds" maxlength="2" value="${start}"/>`);

    minutes.keypress((event) => {
        isDirtyM = true;
    });
    minutes.focus(() => {
        isDirtyM = false;
        if (minutes.val()) {
            minutes.val("");
        }
    });
    minutes.blur(() => {
        const val = minutes.val();

       if (!isDirtyM || !mask.test(val)) {
           minutes.val(currentMinutes);
       } else {
           currentMinutes = val;
       }
    });
    minutes.keyup(() => {
        if (minutes.val().length > 1) {
            minutes.blur();
            seconds.focus();
        }
    });

    seconds.keypress((event) => {
        isDirtyS = true;
    });
    seconds.focus(() => {
        isDirtyS = false;
        if (seconds.val()) {
            seconds.val("");
        }
    });
    seconds.blur(() => {
        const val = seconds.val();

        if (!isDirtyS || !mask.test(val)) {
            seconds.val(currentSeconds);
        } else {
            currentSeconds = val;
        }
    });

    $('#field').append(minutes).append(delimiter).append(seconds);

    return {
        getTime() {
            return {
                minutes: currentMinutes,
                seconds: currentSeconds
            };
        }
    }
}
$(document).ready(function() {
    let socket = io(window.location.origin, {
            port: 8080,
            autoConnect: true
        }),
        timer = new Timer(),
        logger = new Logger($('#logger')),
        tree = new Tree(logger.addLog),
        lang = new Lang($('#lang'), ['sp', 'en'], tree.setData, 'sp');

    const field = Field();

    tree.setSocket(socket);
    tree.setTimer(timer);

    $.getJSON('/data', (data) => {
       tree.loadData(data.rooms, 'en');
    });
    $.getJSON('/data:sp', (data) => {
        tree.loadData(data.rooms, 'sp');
        tree.setData('sp');
    });

    socket.emit('admin:connect');
    socket.on('timer:setTime', (data) => {
        const { time, started } = data;
        timer.setTime(time);
        if ( started )
            timer.start();
    });
    socket.on('admin:log', (log) => {
         const logs = log.slice(0, -1);
         if ( logs.length > 0 ) {
             logs.split('\n').forEach((item) => {
                 logger.addLog(JSON.parse(item));
             });
         }
    });

    $("#start").click(function () {
        timer.setTime(field.getTime());
        socket.emit('timer:start', timer.getTime());
        timer.start();
    });
    $("#stop").click(function () {
        timer.stop();
        socket.emit('timer:stop');
    });
    $("#reset").click(function () {
        timer.reset();
        logger.clearLog();
        socket.emit('timer:reset');
    });
    $('#signal').click(function () {
       socket.emit('timer:signal');
    });
    $("#setInfo").click(function () {
       socket.emit('info:set', { text: "newText" + new Date()});
    });
});