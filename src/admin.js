import $ from 'jquery';
import io from 'socket.io-client';
import { Timer } from './Timer.js';

import './index.css';

function Tree () {
    let tree,
        rooms = $("#rooms"),
        objects = $("#objects"),
        secrets = $("#secrets"),
        currentRoom,
        _socket,
        _timer,
        currentObject,
        currentSecret,
        current;

    function setSocket(socket) {
        _socket = socket;
        return this;
    }
    function setData(data) {
        tree = data;
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
        currentSecret = { name: currentObject.tree[key].name, text: currentObject.tree[key].text };
        current = {
            chain: currentRoom.name+" "+currentObject.name+" "+currentSecret.name,
            text: currentSecret.text,
            timer: _timer.toString(),
            time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        };
        Confirm( setMessage, current );
    }
    function setMessage (error, success) {
        if ( error ) {
            console.log('reject');
        } else {
            _socket.emit('info:set', success);
        }
    }
    function renderRooms () {
        tree.forEach( (item, key) => {
            Room(item, rooms, setRoom, key);
        });
    }
    function renderObject () {
        objects.html("");
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
$(document).ready(function() {
    let socket = io(window.location.origin, {
            port: 8080,
            autoConnect: true
        }),
        timer = new Timer(),
        tree = new Tree();

    tree.setSocket(socket);
    tree.setTimer(timer);
    $.getJSON('/data', (data) => {
       tree.setData(data.rooms).renderRooms();
    });

    $("#start").click(function () {
        timer.start();
        socket.emit('timer:start');
    });
    $("#stop").click(function () {
        timer.stop();
        socket.emit('timer:stop');
    });
    $("#reset").click(function () {
        timer.reset();
        socket.emit('timer:reset');
    });
    $("#setInfo").click(function () {
       socket.emit('info:set', { text: "newText" + new Date()});
    });
});