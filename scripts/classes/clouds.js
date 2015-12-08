// Cloud scripts
// Nicholas Blum

var Clouds = function Clouds() {
    var currentTicks = 0,
        createNewAtTick = Math.random() * 120 + 120, // Every 2 to 4 seconds
        clouds = [];
    
    this.Move = function() {
        currentTicks++;
        if (currentTicks > createNewAtTick) {
            currentTicks = 0;
            createNewAtTick = Math.random() * 120 + 120;
            // console.log(clouds.length);
            var cloud = new Cloud();
            cloud.init(clouds.length);
            clouds[clouds.length] = cloud;
            // console.log(clouds.length);
        }
        var i;
        for (i = 0; i < clouds.length; i++) {
            clouds[i].Move();
            if(clouds[i].isOffscreen()) {
                clouds[i].Remove();
                clouds.splice(i, 1);
            }
        }
    };
    
    this.addCloud = function() {
        var cloud = new Cloud();
        cloud.init(clouds.length);
        clouds[clouds.length] = cloud;
    }
}

var Cloud = function Cloud() {
    var speed,
        sprite,
        index;
    
    this.init = function (index) {
        this.index = index;
        sprite = new Sprite(resources.cloud1.texture);
        sprite.position.x -= sprite.width;
        sprite.position.y = Math.random() * 100;
        speed = Math.random()*1.5 + 1; // 1-2.5 
        cloudLayer.addChild(sprite);
        
    };
    
    this.Move = function() {
        sprite.position.x += speed;
    };
    
    this.isOffscreen = function() {
        return sprite.position.x > renderWidth;
    };
    
    this.Remove = function() {
        cloudLayer.removeChild(sprite);
    };
}