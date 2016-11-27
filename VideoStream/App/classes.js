
class ServerStreamer {
    constructor(watchers) {
        this.watchers = watchers;
        this.running = true;
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
        let sample = e.inputBuffer.getChannelData(0);
        let dataview = ArrayConversion.encodeWAV(sample, this.sampleRate);
        let waveblob = new Blob([dataview], { type: "octet/stream" })

        this.watchers.SetupAudio(waveblob);

        let request = new Request('/api/stream', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/octet-stream'
            }),
            body: waveblob
        });
        fetch(request);
    }
    Receive(watcher) {
        if (this.running) {
            fetch('/api/stream')
                .then(response =>
                    response.blob()
                ).then(data =>
                    watcher.src = URL.createObjectURL(data));
        }
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

class ArrayConversion {
    static floatTo16BitPCM(output, offset, input) {
        for (var i = 0; i < input.length; i++ , offset += 2) {
            var s = Math.max(-1, Math.min(1, input[i]));
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
    }

    static encodeWAV(samples, sampleRate) {
        function writeString(view, offset, string) {
            for (var i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        }

        var buffer = new ArrayBuffer(44 + samples.length * 2);
        var view = new DataView(buffer);

        /* RIFF identifier */
        writeString(view, 0, 'RIFF');
        /* file length */
        view.setUint32(4, 32 + samples.length * 2, true);
        /* RIFF type */
        writeString(view, 8, 'WAVE');
        /* format chunk identifier */
        writeString(view, 12, 'fmt ');
        /* format chunk length */
        view.setUint32(16, 16, true);
        /* sample format (raw) */
        view.setUint16(20, 1, true);
        /* channel count */
        //view.setUint16(22, 2, true); /*STEREO*/
        view.setUint16(22, 1, true); /*MONO*/
        /* sample rate */
        view.setUint32(24, sampleRate, true);
        /* byte rate (sample rate * block align) */
        //view.setUint32(28, sampleRate * 4, true); /*STEREO*/
        view.setUint32(28, sampleRate * 2, true); /*MONO*/
        /* block align (channel count * bytes per sample) */
        //view.setUint16(32, 4, true); /*STEREO*/
        view.setUint16(32, 2, true); /*MONO*/
        /* bits per sample */
        view.setUint16(34, 16, true);
        /* data chunk identifier */
        writeString(view, 36, 'data');
        /* data chunk length */
        view.setUint32(40, samples.length * 2, true);

        ArrayConversion.floatTo16BitPCM(view, 44, samples);

        return view;
    }
}