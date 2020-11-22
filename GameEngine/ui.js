class UiRenderer {

    menuRenderer = null;

    constructor(speechInfrastructure, weaponChangerWorker, weapons) {
        this.speechInfrastructure = speechInfrastructure;
        this.weaponChangerWorker = weaponChangerWorker;
        this.menuRenderer = new MenuRenderer();
        document.querySelector('#ui-current-weapon img'). addEventListener('click', async () => {
            this.menuRenderer.startRecording();
            const text = await this.speechInfrastructure.listenOnce();
            this.menuRenderer.stopRecording();
            this.weaponChangerWorker.postMessage([weapons, text]);
        })
    }
    renderCurrentWeapon(weapon) {
        document.querySelector('#ui-current-weapon img').src = `./Assets/img/weapons/${weapon.sprite}.png`;
        document.querySelector('#ui-current-weapon span.dmg').innerHTML = weapon.damage;
        document.querySelector('#ui-current-weapon span.spd').innerHTML = weapon.speed;
        document.querySelector('#ui-current-weapon span.rng').innerHTML = weapon.range;
    }


    
}