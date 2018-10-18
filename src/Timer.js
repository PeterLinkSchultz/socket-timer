import $ from 'jquery';

export const Timer = () => {
    let minutes,
        seconds,
        started = false,
        divTimer = $("#timer"),
        divMinutes = $("<p>"),
        divSeconds = $("<p>"),
        timer;
    function init () {
        divTimer.prepend(divMinutes).append(divSeconds);
        minutes = 59;
        seconds = 59;
        setMinutes();
        setSeconds();
    }
    function setTime(time) {
        console.log(time);
        minutes = time.minutes;
        seconds = time.seconds;
        setMinutes();
        setSeconds();
    }
    function setMinutes () {
        divMinutes.html(minutes);
    }
    function setSeconds () {
        divSeconds.html(seconds);
    }
    function tick () {
        const date = new Date();
        console.log(date.getSeconds(), date.getMilliseconds());
        if ( Number(seconds) === 0 ) {
            if ( Number(minutes) > 0 ) {
                seconds = 59;
                minutes--;
                if ( minutes < 10)
                    minutes = '0'+minutes;
            } else {
                seconds = 0;
                minutes = 0;
            }
            setMinuts();
        } else {
            seconds--;
        }
        if ( seconds < 10)
            seconds = '0'+seconds;
        setSeconds();
        if ( seconds === 0 && minutes === 0 )
            stop();
    }
    function toString () {
        return `${minutes}:${seconds}`;
    }
    function start () {
        if ( !started ) {
            started = true;
            timer = setInterval(tick, 1000);
        }
    }
    function isStarted () {
        return started;
    }
    function stop () {
        started = false;
        clearInterval(timer);
        //clearTimeout(timer);
    }
    function reset () {
        init();
    }
    function getTime () {
        return {
            minutes,
            seconds
        }
    }
    init();
    return {
        start,
        stop,
        reset,
        getTime,
        setTime,
        isStarted,
        toString
    }
};