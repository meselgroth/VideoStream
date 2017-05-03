(function () {
    'use strict';

    
    let streamer = new ServerStreamer();
    let button = document.getElementById('pauseButton');
    button.addEventListener('click', () => streamer.Pause());
    
    let watcher = document.getElementById('watch');
    streamer.Receive(watcher);
})();