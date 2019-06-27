import $ from 'jquery';
import io from 'socket.io-client';
import { Timer } from './Timer.js';
import './index.css';

import TweenMax from "gsap/TweenMax";
import { Power1 } from "gsap/TweenMax";

function Banner() {
    const banner = $("#banner");

    return {
        setInfo: (text) => {
            banner.addClass('active');
        },
        clearInfo: () => {
            banner.removeClass('active');
            $("#new").html("");
            $("#current").html("");
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

function SplitText(el, string) {
    const chars = [];
    const $_words = [];
    const words = string.split(/\s/);
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

function cycleQuotes(string, sel, img) {
    const el = $(sel);
    const split = new SplitText(el, string);
    const time = 100 * delay;

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
    });
    if (img) {
        const $img = document.createElement("img");

        if (typeof img === "object") {
            $img.setAttribute("src", img.src);
            if (img.id) {
                $img.setAttribute("id", img.id)
            }
            if (img.class) {
                $img.setAttribute("class", img.className)
            }
            if (img.height) {
                $img.setAttribute("height", img.height)
            }
            if (img.width) {
                $img.setAttribute("width", img.width)
            }
        } else {
            $img.setAttribute("src", img);
        }
        el.append($img);

        TweenMax.from($img, time, {
            opacity: 0,
            x: 0,
            y: random(-200, 200),
            z: random(500, 1000),
            // scale: .1,
            delay: delay,
            yoyo: true,
            repeat: 0,
            repeatDelay: time * 4,
            ease: Power1.easeOut
        });
    }

    const rev = () => () => {
        const upd = $("#new");
        const img = upd.find("img");

        if (img.length > 0) {
            TweenMax.fromTo(img[0], time, {
                opacity: 1,
                x: 0,
                y: 0,
                z: 0,
                // scale: .1,
                delay: delay,
                yoyo: true,
                repeat: 0,
                ease: Power1.easeOut
            }, {
                opacity: 0,
                y: random(-200, 200),
                z: random(500, 1000),
                yoyo: true,
                delay: delay,
                ease: Power1.easeOut
            });
        }

        $("#current").html(upd.children()).html();

        $(upd).html("");

        $(split.chars).each(function(i){
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
        });
    };

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
       last = cycleQuotes(data.text, "#new", data.hasOwnProperty("img") ? data.img : null);
       console.log('info: set', data);
   });
});