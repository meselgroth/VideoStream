(function () {
    'use strict';

    //import Streamer from 'Streamer';
    
    let streamer = new Streamer();
    let button = document.getElementById('pauseButton');
    button.addEventListener('click', () => streamer.Pause());
    button.addEventListener("mousemove", ev => streamer.Send({ X: ev.screenX, Y: ev.screenY }));
})();