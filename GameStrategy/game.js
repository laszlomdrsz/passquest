class GameFactory {
    mapSize = {
        x: 16,
        y: 16
    };
    level = 1
    seed = '';
    levelSeed = '';
    xp = 0;
    weaponNames = [];

    playerStats = null;
    enemiesStats = [];
    rewardsStats = [];
    weapons = [];

    map = null;
    mapRenderInstructions = null;

    constructor(seed, level, xp, weaponNames) {
        this.seed = seed;
        this.levelSeed = seed + '_' + level;
        this.xp = xp;
        Math.seedrandom(seed);
        this.generateWeapons(weaponNames);
        Math.seedrandom(this.levelSeed);
        this.generateRewardsStats();
        this.generatePlayerStats(this.xp, this.weapons);
        this.generateEnemiesStats(this.level);
        this.map = new MapElement(level, this.mapSize);
        this.map.addPlayer(this.playerStats);
        this.map.addEnemies(this.enemiesStats);
        this.map.addRewards(this.rewardsStats);
        this.mapRenderInstructions = this.map.getMapRenderInstructions();
    }

    generateWeapons(weaponNames) {
        const weapons = [];
        const weaponsCount = 10;
        for (let i = 0; i < weaponsCount; i++) {
            let weapon;
            if (i === 0) {
                weapon = weaponNames[i] ? new Weapon(weaponNames[i], true) : new Weapon('', true);
            } else {
                weapon = weaponNames[i] ? new Weapon(weaponNames[i]) : new Weapon();
            }
            weapons.push(weapon);
        }
        this.weapons = weapons;
    }

    generatePlayerStats(xp, weapons) {
        this.playerStats = new PlayerStats(xp, weapons);
    }

    generateEnemiesStats(level, levelSeed) {
        const enemiesCount = this.mapSize.x * this.mapSize.y / 50 * level;
        const enemiesStats = [];
        for (let i = 0; i < enemiesCount; i++) {
            enemiesStats.push(new EnemyStats(level));
        }
        this.enemiesStats = enemiesStats;
    }

    generateRewardsStats() {
        this.playerStats = new RewardStats();
    }

    getMapRenderInstructions() {
        return this.mapRenderInstructions;
    }

    getPlayerWeapons() {
        return this.playerStats.getWeapons();
    }

    getXpToUnlockWeapon() {
        return this.playerStats.getXpToUnlockWeapon();
    }
}

class GameManager {
    level = 1
    seed = '';
    xp = 0;
    weaponNames = [];

    gameController = null;
    gameFactory = null;
    menuRenderer = null;

    gameResult = null;

    constructor(menuRenderer, seed, level, xp, weaponNames) {
        this.seed = seed || this.generateSeed();
        this.xp = xp || 0;
        this.weaponNames = weaponNames || new Array();
        this.level = level || 1;
        this.menuRenderer = menuRenderer;
        // CALL init()!a
    }

    async init() {
        if (this.weaponNames.length < 1) {
            await this.setFirstWeaponName();
        }
        this.gameFactory = new GameFactory(this.seed, this.level, this.xp, this.weaponNames);
        return this;
    }

    generateSeed() {
        return randomString(6);
    }

    async setFirstWeaponName() {
        const weapons = [new Weapon('', true)];
        const newWeaponNames = await this.menuRenderer.renderNewWeaponScreen(weapons, [0]);
        this.weaponNames.push(...newWeaponNames); 
        return;
    }

    async startGame() {
        const mapRenderInstructions = this.gameFactory.getMapRenderInstructions();
        this.gameController = new GameControllerFactory(mapRenderInstructions);
        this.menuRenderer.canvasMode();
        const gameResult = await this.gameController.start();
        const shareDetails = await this.endGame(gameResult);
        
        return shareDetails;
    }

    async endGame(gameResult) {
        this.xp = gameResult.xp;
        if (gameResult.success) {
            this.level++;
        }
        const weapons = this.gameFactory.getPlayerWeapons();
        const newWeaponIndexes = this.checkNewWeapons(weapons);
        if (newWeaponIndexes.length > 0) {
            const newWeaponNames = await this.menuRenderer.renderNewWeaponScreen(weapons, newWeaponIndexes);
            this.weaponNames.push([...newWeaponNames]);
        }
        
        const shareDetails = new ShareDetails(gameResult.success, this.xp, this.seed, this.level, this.weaponNames);
        return shareDetails;
    }

    checkNewWeapons(weapons) {
        const newWeaponIndexes = [];
        const xpToUnlockWeapon = this.gameFactory.getXpToUnlockWeapon();
        for (let i = 0; i <= this.xp / xpToUnlockWeapon; i++) {
            if (!weapons[i]) { break; }
            if (!weapons[i].enabled) {
                newWeaponIndexes.push(i);
            }
        }
        return newWeaponIndexes;
    }


}

class GameResult {
    success = false;
    xp = 0;
    constructor(success, xp) {
        this.success = success;
        this.xp = xp;
    }
}

class ShareDetails {
    seed = '';
    success = false;
    level = 1;
    xp = 0;
    weaponNames = [];
    constructor(success, xp, seed, level, weaponNames) {
        this.success = success;
        this.xp = xp;
        this.seed = seed;
        this.level = level;
        this.weaponNames = weaponNames;
    }
}