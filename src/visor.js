import $ from 'jquery';
import io from 'socket.io-client';
import { Timer } from './Timer.js';
import './index.css';

import TweenMax from "gsap/TweenMax";
import { Power1 } from "gsap/TweenMax";

function Banner() {
    let banner = $("#banner");

    return {
        setInfo: (text) => {
            banner.addClass('active');
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

var quotes = [
    "Wisdom is not a product of schooling but of the lifelong attempt to acquire it.",
    "“Live as if you were to die tomorrow. Learn as if you were to live forever.” <br><br>—  Mahatma Gandhi",
    "“Tell me and I forget, teach me and I may remember, involve me and I learn.” <br><br>— Benjamin Franklin",
    "“Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.”<br><br>— Richard Feynman",

    "“It is important that students bring a certain ragamuffin, barefoot irreverence to their studies; they are not here to worship what is known, but to question it.”  <br><br>—  Jacob Bronowski"
];


var delay = .02;

function random(min, max){
    return (Math.random() * (max - min)) + min;
}

function SplitText(el, words) {
    const chars = [];
    const $_words = [];
    const updated = words.map((word) => {
        return word.match(/[\w\d]/g);
    });
    updated.forEach((item) => {
        const string = [];
        item.forEach((char) => {
            string.push($(`<div>${char}</div>`));
        });
        string.push($(`<div>&nbsp;&nbsp;</div>`));
        $_words.push($("<div class='word'>").append(...string));
        chars.push(...string);
    });

    $(el).html("").append($(`<div class="words">`).append(...$_words));

    return {
        chars
    }
}

function cycleQuotes(string, sel){
    const el = $(sel);
    const split = new SplitText(el, string);
    const time = 100 * delay;

    const rev = () => () => this.callback($("new"));

    $(split.chars).each(function(i){
        TweenMax.from($(this), time, {
            opacity: 0,
            x: 0,
            y: random(-200, 200),
            z: random(500, 1000),
            // scale: .1,
            delay: i * delay,
            yoyo: true,
            repeat: 0,
            repeatDelay: time * 4,
            ease: Power1.easeOut
        });

        rev.bind({
            callback: (upd) => {
                $("#current").html(upd).html();

                $(upd).html("");
                TweenMax.fromTo($(this), time, {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    z: 0,
                    // scale: .1,
                    delay: i * delay,
                    yoyo: true,
                    repeat: 0,
                    ease: Power1.easeOut
                }, {
                    opacity: 0,
                    y: random(-200, 200),
                    z: random(500, 1000),
                    yoyo: true,
                    delay: i * delay,
                    ease: Power1.easeOut
                });
            }
        });
    });

    return rev();
}

$(document).ready(function() {
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
   let last = null;
   socket.on('info:set', (data) => {
       if (last)
           last();
       signal('message.mp3');
       banner.setInfo();
       last = cycleQuotes(data.text, "#new");
       console.log('info: set', data);
   });
});