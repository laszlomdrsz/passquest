class MenuRenderer {

    speechInfrastructure = null;

    constructor(speechInfrastructure) {
        this.speechInfrastructure = speechInfrastructure;
    }

    async renderStartScreen(level) {
        return new Promise((resolve) => {
            const levelNumberSpan  = document.querySelector('#level-number');
            levelNumberSpan.innerHTML = level || 1;
            const startScreen = document.querySelector('#start-screen');
            startScreen.style.display = 'block';
            document.querySelector('#game-start-button').addEventListener("click", function() {
                startScreen.style.display = 'none';
                resolve();
            }); 
        })
    }

    renderEndScreen(shareDetails) {
        return new Promise(async (resolve) => {
            console.log(shareDetails);
            const endScreen = document.querySelector('#end-screen');
            document.querySelector('#end-success-text').innerHTML = shareDetails.success ? 
            'Congratulations!' : 'Game over';
            document.querySelector('#end-xp').innerHTML = shareDetails.xp;
            endScreen.style.display = 'block';
            document.querySelector('#share-button').addEventListener("click", function() {
                document.querySelector('#share-clipboard-text').style.display = 'block';
                resolve()
            });
        })
    }

    async renderNewWeaponScreen(weapons, newWeaponIndexes) {
        return new Promise(async (resolve) => {
            const newWeaponNames = [];
            for (const newWeaponIndex of newWeaponIndexes) {
                const newWeaponName = await this.singleNewWeaponScreen(weapons[newWeaponIndex], newWeaponIndex);
                newWeaponNames.push(newWeaponName);
            }
            resolve(newWeaponNames);
        })
    }

    async singleNewWeaponScreen(weapon, newWeaponIndex) {
        return new Promise(async (resolve) => {
            const newWeaponScreen = document.querySelector('#new-weapon-screen');
            const weaponNameInput = document.querySelector('#weapon-name-input');
            weaponNameInput.value = '';
            document.querySelector('.weapon-image img').src = `./Assets/img/weapons/${weapon.sprite}.png`
            document.querySelector('span.weapon-rng').innerHTML = weapon.range;
            document.querySelector('span.weapon-spd').innerHTML = weapon.speed;
            document.querySelector('span.weapon-dmg').innerHTML = weapon.damage;
            newWeaponScreen.style.display = 'block';
            this.newWeaponNameInput(weaponNameInput);
            document.querySelector('#weapon-name-again-button').addEventListener("click", async () => {
                this.newWeaponNameInput(weaponNameInput)
            }); 
            document.querySelector('#weapon-name-submit-button').addEventListener("click", () => {
                if (weaponNameInput.value) { // Legyen muszáj nevet adni a fegyvernek
                    newWeaponScreen.style.display = 'none';
                    resolve(weaponNameInput.value);
                }
            }); 
        })
    }

    menuMode() {
        document.querySelector('.container').style.display = 'block';
        document.querySelector('#canvas-container').style.display = 'none';
        document.querySelector('#ui-current-weapon').style.display = 'none';
    }

    canvasMode() {
        document.querySelector('.container').style.display = 'none';
        document.querySelector('#canvas-container').style.display = 'block';
        document.querySelector('#ui-current-weapon').style.display = 'block';
    }

    async newWeaponNameInput(weaponNameInput) {
        weaponNameInput.value = '';
        this.startRecording();
        const speechInputValue = await this.speechInfrastructure.listenOnce();
        this.stopRecording()
        weaponNameInput.value = speechInputValue;
    }

    startRecording() {
        const recordingIcon = document.querySelector('#recording-icon');
        recordingIcon.style.display = 'block';
    }

    stopRecording() {
        const recordingIcon = document.querySelector('#recording-icon');
        recordingIcon.style.display = 'none';
    }
}