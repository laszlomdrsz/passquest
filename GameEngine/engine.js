`use strict`

var config = {
  "tileSize": 64,
  "fps": 30,
};


class GameControllerFactory {
  canvas = null;
  player = null;
  enemy = null;
  gameController = null;
  controlManager = null;
  

  constructor(mapRenderInstructions) {
    this.controlManager = new ControlManager();
    this.canvas = new Canvas('canvas#game');
    this.player = new Player(
      mapRenderInstructions.entities.player.startingPosition.x * config.tileSize,
      mapRenderInstructions.entities.player.startingPosition.y * config.tileSize,
      mapRenderInstructions.entities.player.stats.hp,
      mapRenderInstructions.entities.player.stats.speed,
      "",
      mapRenderInstructions.entities.player.stats.damage,
      mapRenderInstructions.entities.player.stats.range,
      mapRenderInstructions.entities.player.stats.xp,
      mapRenderInstructions.entities.player.stats.weapons,
    );
    const enemies = [];
    for (const enemy of mapRenderInstructions.entities.enemies) {
      const newEnemy = new Enemy(
        enemy.startingPosition.x  * config.tileSize,
        enemy.startingPosition.y  * config.tileSize,
        enemy.stats.hp,
        enemy.stats.speed,
        enemy.stats.type,
        enemy.stats.damage,
        enemy.stats.range,
      )
      newEnemy.active = true;
      enemies.push(newEnemy);
    }
    this.controlManager.addPlayerControls(this.player);
    this.gameController = new GameController(
      this.canvas,
      new Map(mapRenderInstructions.tiles),
      [this.player, ...enemies]
    );
    return this.gameController;
  }
  
}

class GameController {
  uiRenderer = null;
  weaponChangerWorker = null;
  speechInfrastructure = null;

  constructor(canvas, map, entities){
    
    this.weaponChangerWorker = new Worker('Workers/weaponchanger.js');
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");;
    this.map = map;
    this.player = entities[0];
    [, ...this.enemies] = entities;
    this.speechInfrastructure = new SpeechInfrastructure();
    this.weaponChangerWorker.addEventListener('message', (message) => {
      const data = message.data;
      this.player.chooseWeapon(data.weaponIndex);
    });
    this.uiRenderer = new UiRenderer(this.speechInfrastructure, this.weaponChangerWorker, this.player.weapons);
  }



  start(){
    return new Promise((resolve) => {
      this.interval = setInterval(this.run.bind(this), 1000 / config.fps, resolve); // todo separate update freq and graphic
    })
  }

  run(resolve){
    this.update();
    if (this.checkGameEnd()) {
      clearInterval(this.interval);
      const gameResult = this.checkGameEnd();
      if (gameResult) {
        this.weaponChangerWorker.terminate();
        resolve(gameResult);
      }
    };
    this.render(this.ctx);
  }

  checkGameEnd() {
    if (this.player.isDead()) {
      return {
        success: false,
        xp: this.player.xp
      }
    }
    if (this.player.pos.y < 1 * config.tileSize) {
      return {
        success: true,
        xp: this.player.xp
      }
    };
    return false;
  }

  update() {
    this.map.update();
    this.player.update(this.map);
    for (const enemy of this.enemies) {
      this.player.tryAttack(enemy);
      enemy.tryAttack(this.player);
      if (enemy.isDead()) {
        const index = this.enemies.indexOf(enemy);
        this.enemies.splice(index, 1);
        if (this.enemies.length === 0) {
          this.player.lastAttack.opponent = null;
        }
      }
    }
  }

  render(){
    this.map.render(this.ctx);
    this.player.renderAll(this.ctx);
    this.enemies.forEach((enemy)=>{
      enemy.renderAll(this.ctx);
    });
    this.ctx.setTransform(1, 0, 0, 1, -this.player.pos.x + this.canvas.width/2, -this.player.pos.y + this.canvas.height * 0.8);
    this.uiRenderer.renderCurrentWeapon(this.player.currentWeapon);
  }
}

class Map {
  constructor(tiles){
    this.tiles = this.generate(tiles);
    try{
      this.height = tiles.length;
      this.width = tiles[0].length;
    }catch(err){
      console.log("Invalid map size!");
    }
  }

  generate(data) {
    let tiles = [];
    let i;
    for(i = 0; i < data.length; i++){
      let j;
      tiles[i] = [];
      for(j = 0; j < data[i].length; j ++){
        tiles[i][j] = new Tile(data[i][j].type);
      }
    }
    return tiles;
  }

  get(x,y){
    if(typeof this.tiles[y] === 'undefined'){
      return new Tile("hill");
    }else if(typeof this.tiles[y][x] === 'undefined'){
      return new Tile("hill");
    }else{
      return this.tiles[y][x]
    }
  }

  getTileOnPos(x,y){
    return this.get(Math.floor(x / config.tileSize), Math.floor(y / config.tileSize));
  }

  update(){
    /*this.tiles.forEach((tile)=>{
      tile.update();
    });*/
  }

  render(ctx){
    const patterns = {
      hill: imgUrlToPattern(ctx, '/Assets/img/tiles/hill.jpg'),
      ground: imgUrlToPattern(ctx, '/Assets/img/tiles/ground.jpg'),
      water: imgUrlToPattern(ctx, '/Assets/img/tiles/forest.jpg')
    }
    let i;
    for(i = -20; i < this.height + 20; i++){
      let j;
      for(j = -20; j < this.width + 20; j ++){
        this.get(i,j).render(ctx, i, j, patterns);
      }
    }
  }
}

class Tile {
  constructor(type){
    this.type = type;
  }

  render(ctx, x, y, patterns){
    let color = "red";
    switch(this.type) {
      case "ground":
      color = patterns.ground;
      break;
      case "hill":
      color = patterns.hill;
      break;
      case "water":
      color = patterns.water;
      break;
      default:
      console.log("Undefined tile, drawing red square!");
    }
    let ts = config.tileSize;
    if (this.type === 'ground' || true) {
      drawRect(ctx, x * ts, y * ts, ts, ts, color);
    }
  }

  isSolid(){
    switch(this.type) {
      case "ground":
      return false;
      break;
      case "hill":
      return true;
      break;
      case "water":
      return true;
      break;
      default:
      return false;
    }
  }
}

class Canvas {
  canvasElem = null;
  constructor(selector) {
    const canvas = document.querySelector(selector);
    let style_height = window.getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    let style_width = window.getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    // sets dpi for canvas
    let dpi = window.devicePixelRatio; 
    canvas.setAttribute('height', style_height * dpi);
    canvas.setAttribute('width', style_width * dpi);
    this.canvasElem = canvas;
    return this.canvasElem;
  }
}

