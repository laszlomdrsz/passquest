class ShareInfrastructure {

    async share(shareDetails) {
        
        const shareParam = this.urlParamEncode(shareDetails);
        const url = `/?p=${shareParam}`;
        const text = 'Continue my game in PassQuest!';
        const title = 'PassQuest';
        const shareData = new ShareData(url, text, title);

        try {
            const hostname = window.location.hostname;
            navigator.clipboard.writeText(hostname + url)
        } catch (error) {
            console.log('Clipboard write failed');
        }
        return navigator.share(shareData);
    }

    urlParamEncode(shareDetails) {
        let shareDetailsStringified = JSON.stringify(shareDetails);
        let shareDetailsB64 = window.btoa(shareDetailsStringified);
        return shareDetailsB64;
    }
}

class ShareData {
    url = '';
    text = '';
    title = '';
    constructor(url, text, title) {
        this.url = url;
        this.text = text;
        this.title = title;
    }
}