class PlayerStats {
    xp = 0;
    hp = 0;
    speed = 0;
    damage = 0;
    weapons = [];
    xpLevelDifference = 250;
    xpToUnlockWeapon = 500;

    constructor(xp, weapons) {
        this.xp = xp;
        this.calculateStats();
        this.weapons = weapons;
        this.enableWeapons();
    }

    calculateStats() {
        this.hp = 100 + (Math.floor(this.xp / this.xpLevelDifference) * 20);
        this.speed = 10 + (Math.floor(this.xp / this.xpLevelDifference) * 5);
        this.damage = 1 + (Math.floor(this.xp / this.xpLevelDifference) * 0.1);
    }

    enableWeapons() {
        for (let i = 0; i <= this.xp / this.xpToUnlockWeapon; i++) {
            if (!this.weapons[i]) { break; }
            this.weapons[i].enabled = true;
        }
    }

    getWeapons() {
        return this.weapons;
    }

    getXpToUnlockWeapon() {
        return this.xpToUnlockWeapon;
    }
}

class EnemyStats {
    hp = 0;
    type = '';
    speed = 0;
    range = 0;
    damage = 0;
    constructor(level) {
        this.calculateStats(level);
    }

    calculateStats(level) {
        this.hp = 50 + (Math.floor(Math.random() * level * 20));
        this.speed = 1 + (Math.floor(Math.random() * level * 2));
        this.damage = 20 + (Math.floor(Math.random() * level * 10));
        this.range = 70 + (Math.floor(Math.random() * level * 15));
    }
}

class RewardStats {
    reward = 0;
    constructor() {
        this.calculateStats();
    }

    calculateStats() {
        this.reward = 100 + (Math.floor(Math.random() * 500));
    }
}

class Weapon {
    name = '';
    sprite = 1;
    range = 0;
    speed = 0;
    damage = 0;
    type = '';
    enabled = false;
    constructor(name, defaultWeapon = false) {
        this.name = name || '';
        if (!defaultWeapon) {
            this.calculateStats();
        } else {
            this.defaultWeapon();
        }
    }

    calculateStats() {
        this.sprite = 1 + (Math.floor(Math.random() * 10));
        this.range = 100 + (Math.floor(Math.random() * 20));
        this.speed = 1 + (Math.floor(Math.random()* 15));
        this.damage = 20 + (Math.floor(Math.random() * 100));
    }

    defaultWeapon() {
        this.sprite = 1;
        this.range = 100;
        this.speed = 2;
        this.damage = 20;
        this.enabled = true;
    }
}