import $ from 'jquery';

export const Timer = () => {
    let minuts,
        seconds,
        started = false,
        divTimer = $("#timer"),
        divMinuts = $("<p>"),
        divSeconds = $("<p>"),
        timer;
    function init () {
        divTimer.prepend(divMinuts).append(divSeconds);
        minuts = 59;
        seconds = 59;
        setMinuts();
        setSeconds();
    }
    function setTime(time) {
        console.log(time);
        minuts = time.minuts;
        seconds = time.seconds;
        setMinuts();
        setSeconds();
    }
    function setMinuts () {
        divMinuts.html(minuts);
    }
    function setSeconds () {
        divSeconds.html(seconds);
    }
    function tick () {
        const date = new Date();
        console.log(date.getSeconds(), date.getMilliseconds());
        if ( Number(seconds) === 0 ) {
            if ( Number(minuts) > 0 ) {
                seconds = 59;
                minuts--;
                if ( minuts < 10)
                    minuts = '0'+minuts;
            } else {
                seconds = 0;
                minuts = 0;
            }
            setMinuts();
        } else {
            seconds--;
        }
        if ( seconds < 10)
            seconds = '0'+seconds;
        setSeconds();
        if ( seconds === 0 && minuts === 0 )
            stop();
        //timer = setTimeout(tick, 1000);
    }
    function toString () {
        return `${minuts}:${seconds}`;
    }
    function start () {
        if ( !started ) {
            started = true;
            timer = setInterval(tick, 1000);
            //timer = setTimeout(tick, 1000);
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
            minuts,
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