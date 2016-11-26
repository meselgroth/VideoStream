(function () {
    'use strict';

    
    let streamer = new Streamer();
    let button = document.getElementById('pauseButton');
    button.addEventListener('click', () => streamer.Pause());
    
    let watcher = document.getElementById('watch');
    setInterval(() => streamer.Receive(watcher), 1000);
})();