class SpeechInfrastructure {
    continuousListeningFlag = null;
    speechRecognition = null;
    constructor() {
        this.speechRecognition = new webkitSpeechRecognition();
        // recognition.lang = "en-US";
    }

    async listenOnce() {
        return new Promise((resolve) => {
            this.speechRecognition.abort();
            this.speechRecognition.continuous = false;
            this.speechRecognition.onresult = (event) => {
                if (!event || !event.results || !event.results[0] || !event.results[0][0] || !event.results[0][0].transcript) {
                    resolve('');
                } else {
                    resolve(event.results[0][0].transcript);
                }
            };
            this.speechRecognition.onend = () => {
                resolve('');
            }
            this.speechRecognition.start();
        })
    }

    stopListening() {
        this.speechRecognition.abort();
    }
}