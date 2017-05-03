
class LoadingWorker {
    constructor(window) {
        window.onmessage = this.workerMethods;
    }
    workerMethods(e) {
        switch (e.data.command) {
            case 'init':
                init(e.data.config);
                break;
            case 'record':
                record(e.data.samples);
                break;
        }
    }
    init(config) {
        ws = new WebSocket(config.uri, config.protocol);
    }
    record(samples) {
        ws.send(samples);
    }
}

class ServerStreamer {
    constructor() {
        this.running = true;
        this.broadcastWorker = new Worker('/App/BroadcastWorker.js');
    }

    Send(mediaStream) {
        let audioContext = new AudioContext();
        let source = audioContext.createMediaStreamSource(mediaStream);
        let contextNode = audioContext.createScriptProcessor(16384, 2, 2);
        this.sampleRate = audioContext.sampleRate;
        contextNode.onaudioprocess = e => this.nodeAndXhrRecording(e);

        source.connect(contextNode);
        contextNode.connect(audioContext.destination);    //this should not be necessary, but it is
    }
    nodeAndXhrRecording(e) {
        if (!this.running) return;
        this.broadcastWorker.postMessage({ sampleRate: this.sampleRate, chunk: e.inputBuffer.getChannelData(0) });
    }
    Receive(watcher) {
        this.fetchBlob;
        this.playBlob;
        let fetchCount = 5;

        setInterval(() => this.fetchNew(), 199);
        setTimeout(() => this.playFetched(watcher), 550);
        watcher.onended = () => this.playFetched(watcher);
    }
    fetchNew() {
        if (!this.running) return;
        fetch('/api/stream')
            .then(response =>
                response.blob())
            .then(data => this.fetchBlob = data);
    }
    playFetched(watcher) {
        this.playBlob = this.fetchBlob;
        watcher.src = URL.createObjectURL(this.playBlob);
        watcher.play();
    }
    Pause() {
        this.running = !this.running;
    }
}
class MediaController {
    constructor(devices, streamer) {
        this.streamer = streamer;
        this.devices = devices;
        devices.getUserMedia({ audio: true, video: false }).then(s => this.initializeRecorder(s));
    }

    initializeRecorder(s) {
        this.stream = s;
        this.streamer.Send(this.stream);
        console.log(this.stream);
    }
    Stop() {
        this.streamer.running = false;
        this.stream.getTracks().forEach(t => t.stop());
    }
}

class Watchers {
    constructor(audioWatcher) {
        this.audioWatcher = audioWatcher;
    }
    SetupAudio(sample) {
        this.audioWatcher.src = URL.createObjectURL(sample);
        this.audioWatcher.play();
    }
}

