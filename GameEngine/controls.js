class ControlManager {

    defaultBetaPosition = 0;

    constructor() {
      this.setupDefaultDeviceOrientation();
    }

    setupDefaultDeviceOrientation() {
      window.addEventListener('deviceorientation', function(event) {
        this.defaultBetaPosition = event.beta
      }, {once: true})
    }

    addPlayerControls(player){
        window.addEventListener('keydown', function (e) {
          if(e.keyCode == 87){
            player.speed.y = -1 * player.maxSpeed;
          }
          if(e.keyCode == 83){
            player.speed.y = 1 * player.maxSpeed;
          }
          if(e.keyCode == 68){
            player.speed.x = 1 * player.maxSpeed;
          }
          if(e.keyCode == 65){
            player.speed.x = -1 * player.maxSpeed;
          }
        });
      
        window.addEventListener('keyup', function (e) {
          if(e.keyCode == 87){
            player.speed.y = 0;
          }
          if(e.keyCode == 83){
            player.speed.y = 0;
          }
          if(e.keyCode == 68){
            player.speed.x = 0;
          }
          if(e.keyCode == 65){
            player.speed.x = 0;
          }
        });

        window.addEventListener('deviceorientation', function(event) {
          player.speed.y = Math.max(Math.min((event.beta - this.defaultBetaPosition), 1), -1) * player.maxSpeed;
          player.speed.x = Math.max(Math.min((event.gamma), 1), -1) * player.maxSpeed;
        });
    }

    
}