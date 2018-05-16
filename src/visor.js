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
   socket.on('timer:start', () => {
       timer.start();
   });
   socket.on('timer:reset', () => {
        timer.reset();
        banner.clearInfo();
   });
   socket.on('timer:stop', () => {
        timer.stop();
   });
   socket.on('info:set', (data) => {
       let audio = new Audio(); // Создаём новый элемент Audio
       audio.src = 'signal.mp3'; // Указываем путь к звуку "клика"
       audio.autoplay = true;
       console.log('info: set', data);
        banner.setInfo(data.text);
   });
});