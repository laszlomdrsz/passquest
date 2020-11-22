class ShareInfrastructure {

    async share(shareDetails) {
        const hostname = window.location.hostname;
        const shareParam = this.urlParamEncode(shareDetails);
        const url = `/?p=${shareParam}`;
        const text = 'Are you good enough?';
        const title = 'Continue my game!';
        const shareData = new ShareData(url, text, title);
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