(function () {
    'use strict';

    //import Streamer from 'Streamer';

        let watchers = new Watchers(document.getElementById('watch'));
    let streamer = new ServerStreamer(watchers);
    let mediaController = new MediaController(navigator.mediaDevices, streamer);


    let button = document.getElementById('pauseButton');
    button.addEventListener('click', () => mediaController.Stop());
})();

