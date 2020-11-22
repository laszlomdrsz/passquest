class Entity{

    lastAttack = {
      opponent: null,
      framesElapsed: 0
    }

    speedCounter = 0;
    stepLimit = 20;

    constructor(x, y, size = config.tileSize, mass = 1){
      this.pos = {"x": x, "y": y};
      this.speed = {"x": 0, "y": 0};
      this.size = config.tileSize;
    }
  
    update(map){
      let newX = this.pos.x + this.speed.x;
      if(map.getTileOnPos(newX ,this.pos.y).isSolid()){
        newX = this.pos.x;
      }
  
      let newY = this.pos.y + this.speed.y;
      if(map.getTileOnPos(this.pos.x, newY).isSolid()){
        newY = this.pos.y;
      }
      this.pos.x = newX;
      this.pos.y = newY;
    }

    getHealthColorNumber() {
      return Math.max((this.hp / this.maxHp) * 16 - 1, 0).toString(16).charAt(0);
    }
  
    render(ctx){
      if (this.speed.y === 0) {
        drawImageCentered(ctx, this.sprites[0], this.pos.x, this.pos.y, this.size, this.size);
        this.speedCounter = 0;
      } else {
        this.speedCounter += this.speed.y;
        let spriteNumber = Math.floor(Math.abs(this.speedCounter) / this.stepLimit) % 4
        spriteNumber = spriteNumber === 3 ? 0 : spriteNumber;
        drawImageCentered(ctx, this.sprites[spriteNumber], this.pos.x, this.pos.y, this.size, this.size);

      }
    }

    renderHealthbar(ctx) {
      const hpRatio = this.hp / this.maxHp;
      const healthBarLength = this.size * hpRatio;
      drawRect(ctx, this.pos.x - this.size / 2, this.pos.y - this.size, healthBarLength, 15, '#f00');
    }

    renderAll(ctx) {
      this.render(ctx);
      this.renderAttack(ctx);
      this.renderHealthbar(ctx);
    }
}

class Player extends Entity {
  sprites = [
    imgUrlToImg('/Assets/img/entities/player-0.png'),
    imgUrlToImg('/Assets/img/entities/player-1.png'),
    imgUrlToImg('/Assets/img/entities/player-2.png'),
  ];
  currentWeapon = null;
    constructor(x, y, hp, speed, type, damage, range, xp, weapons){
      super(x, y);
      this.hp = hp;
      this.maxHp = hp;
      this.maxSpeed = speed;
      this.type = type;
      this.damage = damage;
      this.range = range;
      this.xp = xp;
      this.active = false;
      this.weapons = weapons;
      this.chooseWeapon(0);
    }

    chooseWeapon(index) {
      console.log(index, this.weapons);
      this.currentWeapon = this.weapons[index];
    }

    renderAttack(ctx) {
      const attackFrameCount = 10;
      if (!this.lastAttack.opponent || this.lastAttack.framesElapsed > attackFrameCount) { return; }
      drawLine(ctx, this.pos.x, this.pos.y, this.lastAttack.opponent.pos.x, this.lastAttack.opponent.pos.y, '#0f0');
    }
  
    update(map){
      super.update(map);
    }

    tryAttack(enemy) {
      if (this.checkAttack(enemy)) {
        this.attack(enemy);
      }
    }

    checkAttack(enemy) {
      if (getDistance(this.pos, enemy.pos) < this.currentWeapon.range && this.lastAttack.framesElapsed > this.currentWeapon.speed) { 
        return true; 
      }
      this.lastAttack.framesElapsed++;
      return false;
    }

    attack(enemy) {
      this.lastAttack.framesElapsed = 0;
      this.lastAttack.opponent = enemy;
      enemy.getDamaged(this.currentWeapon.damage);
      if (enemy.isDead()) {
        this.xp += enemy.maxHp;
      }
    }

    getDamaged(damage) {
      this.hp -= damage;
      console.log(this.hp);
    }

    isDead() {
      return this.hp <= 0;
    }
}

class Enemy extends Entity {
  sprites = [
    imgUrlToImg('/Assets/img/entities/enemy-0.png'),
    imgUrlToImg('/Assets/img/entities/enemy-1.png'),
    imgUrlToImg('/Assets/img/entities/enemy-2.png'),
  ];
    constructor(x, y, hp, speed, type, damage, range){
      super(x, y);
      this.hp = hp;
      this.maxHp = hp;
      this.maxSpeed = speed;
      this.type = type;
      this.damage = damage;
      this.range = range;
      this.active = false;
      this.path = [];
      this.attackSpeed = 30;
    }

    renderAttack(ctx) {
      const attackFrameCount = 10;
      if (!this.lastAttack.opponent || this.lastAttack.framesElapsed > attackFrameCount) { return; }
      drawLine(ctx, this.pos.x, this.pos.y, this.lastAttack.opponent.pos.x, this.lastAttack.opponent.pos.y, '#f00');
    }
  
    update(map){
      super.update(map);
    }

    tryAttack(player) {
      if (this.checkAttack(player)) {
        this.attack(player);
      }
    }

    checkAttack(player) {
      if (getDistance(this.pos, player.pos) < this.range && this.lastAttack.framesElapsed > this.attackSpeed) {
        return true; 
      }
      this.lastAttack.framesElapsed++;
      return false;
    }

    attack(player) {
      this.lastAttack.framesElapsed = 0;
      this.lastAttack.opponent = player;
      player.getDamaged(this.damage);
    }

    getDamaged(damage) {
      this.hp -= damage;
    }

    isDead() {
      return this.hp <= 0;
    }
  }