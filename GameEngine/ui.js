class UiRenderer {
    renderCurrentWeapon(weapon) {
        document.querySelector('#ui-current-weapon img').src = `./Assets/img/weapons/${weapon.sprite}.png`;
        document.querySelector('#ui-current-weapon span.dmg').innerHTML = weapon.damage;
        document.querySelector('#ui-current-weapon span.spd').innerHTML = weapon.speed;
        document.querySelector('#ui-current-weapon span.rng').innerHTML = weapon.range;
    }
}