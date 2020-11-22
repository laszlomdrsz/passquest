class ApplicationManager {

    menuRenderer = null;
    gameManager = null;
    shareInfrastructure = null
    speechInfrastructure = null

    startingData = null;

    constructor() {
        this.speechInfrastructure = new SpeechInfrastructure();
        this.menuRenderer = new MenuRenderer(this.speechInfrastructure);
        this.shareInfrastructure = new ShareInfrastructure();
    }

    async startApplication() {
        const urlData = this.parseUrlParams();
        if (urlData && urlData.seed && urlData.level) {
            this.startingData = new StartingData(urlData);
            await this.menuRenderer.renderStartScreen(this.startingData.level);
            this.gameManager = new GameManager(this.menuRenderer, this.startingData.seed, 
                this.startingData.level, this.startingData.xp, this.startingData.weaponNames);
        } else {
            await this.menuRenderer.renderStartScreen();
            this.gameManager = new GameManager(this.menuRenderer);
        }

        await this.gameManager.init();
        const shareDetails = await this.gameManager.startGame();
        this.menuRenderer.menuMode();
        this.finalScreen(shareDetails);
    }

    async shareResult(shareDetails) {
        try {
            await this.shareInfrastructure.share(shareDetails);
            this.finalScreen(shareDetails);
        } catch (error) {
            this.finalScreen(shareDetails);
        }
    }

    async finalScreen(shareDetails) {
        await this.menuRenderer.renderEndScreen(shareDetails);
        this.shareResult(shareDetails);
        this.finalScreen(shareDetails);

    }

    parseUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.has('p')) { return null; }
        const urlDataB64 = urlParams.get('p');
        const urlDataStringified = window.atob(urlDataB64);
        console.log(urlDataStringified);
        const urlData = JSON.parse(urlDataStringified);
        return urlData; // ShareDetails
    }
}

class StartingData {
    seed = '';
    success = false;
    level = 1;
    xp = 0;
    weaponNames = [];
    constructor(shareDetails) {
        this.success = shareDetails.success;
        this.xp = shareDetails.xp;
        this.seed = shareDetails.seed;
        this.level = shareDetails.level;
        this.weaponNames = shareDetails.weaponNames;
    }
}