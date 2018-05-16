import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import { store } from './store';

import registerServiceWorker from './registerServiceWorker';


import io from 'socket.io-client';

let socket = io('http://localhost:8080', {
    port: 8080,
    autoConnect: true
});
socket.on('connect', (socket) => {
    console.log("connected!");
});

socket.on('info', (socket2) => {
    console.log("info", socket2);
});
socket.on('info2', (socket2) => {
    console.log("info2", socket2);
});
socket.emit('info', { hello: 'world' });
socket.emit('info2', { hello: 'world' });


ReactDOM.render(
    <Provider>
        <App />
    </Provider>, 
    document.getElementById('root')
);
registerServiceWorker();
