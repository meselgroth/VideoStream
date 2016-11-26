
class Streamer {
    constructor() {
        this.running = true;
    }
    Send(mousePos) {
        if (this.running) {
            let request = new Request('/api/stream', {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'text/json'
                }),
                body: JSON.stringify(mousePos)
            })
            fetch(request);
        }
    }
    Receive(watcher) {
        if (this.running) {
            fetch('/api/stream')
                .then(response =>
                    response.json()
                ).then(data =>
                    watcher.innerHTML = data.X + ', ' + data.Y);
        }
    }
    Pause() {
        this.running = !this.running;
    }
}
