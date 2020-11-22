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

    // Ezt fogjuk használni a fegyverváltáshoz
    listenContinously(callback) {
        this.continuousListeningFlag = true;
        this.listenContinouslyInstance(callback);
    }

    stopContinousListening() {
        this.continuousListeningFlag = false;
        this.speechRecognition.abort();
    }

    listenContinouslyInstance(callback) {
        this.speechRecognition.abort();
        this.speechRecognition.onresult = (event) => {
            callback(event.results[event.resultIndex][0].transcript);
        };
        this.speechRecognition.onend = () => {
            if (this.continuousListeningFlag) {
                this.listenContinouslyInstance(callback);
            }
        }
        try {
            this.speechRecognition.start();
        } catch (err) {
            console.log('elkapva');
        }
    }

    stopListening() {
        this.speechRecognition.abort();
    }
}