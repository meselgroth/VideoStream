(function () {
    'use strict';

    
    let streamer = new ServerStreamer();
    let button = document.getElementById('pauseButton');
    button.addEventListener('click', () => streamer.Pause());
    
    let watcher = document.getElementById('watch');
    setInterval(() => streamer.Receive(watcher), 1000);
})();