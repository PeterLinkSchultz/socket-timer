import $ from 'jquery';
import io from 'socket.io-client';
import { Timer } from './Timer.js';
import './index.css';

function Banner() {
    let banner = $("#banner");

    return {
        setInfo: (text) => {
            banner.html(text).addClass('active');
        },
        clearInfo: () => {
            banner.html("").removeClass('active');
        }
    }
}

function signal(name) {
    let audio = new Audio(); // Создаём новый элемент Audio
    audio.src = name; // Указываем путь к звуку "клика"
    audio.autoplay = true;
}

$(document).ready(function() {
    console.log(window.location);
    let socket = io(window.location.origin, {
        port: 8080,
        autoConnect: true
    }),
        timer = new Timer(),
        banner = new Banner();

   socket.on('connect', (socket) => {
        console.log('connected');
   });
   socket.on('timer:start', (data) => {
       timer.setTime(data);
       timer.start();
   });
   socket.on('timer:reset', () => {
        timer.reset();
        banner.clearInfo();
   });
   socket.on('timer:stop', () => {
        timer.stop();
   });
   socket.on('timer:current', () =>{
      socket.emit('timer:time', { time: timer.getTime(), started: timer.isStarted() });
   });
   socket.on('timer:outSignal' , () => {
       signal('alarm.mp3');
   });
   socket.on('info:set', (data) => {
       signal('message.mp3');
       console.log('info: set', data);
       banner.setInfo(data.text);
   });
});