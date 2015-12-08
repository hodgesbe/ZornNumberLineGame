// Explosion scripts
// Nicholas Blum

var Explosion = function Explosion() {
    var sprite,
        timer = 0,
        fadeTime = 0;
    
    this.init = function(f, x, y) {
        fadeTime = f;
        console.log("Explosion initialized at " + x + ", " + y);
        console.log("Fadetime of: " + fadeTime);
        sprite = new Sprite(resources.pow_effect.texture);
        sprite.position.x = x;
        sprite.position.y = y
        sprite.anchor.set(0.5, 0.5);
        topLayer.addChild(sprite);
    };
    
    this.timedOut = function() {
        // console.log("Timer: " + timer + ", fadeTime: " + fadeTime);
        if (timer < fadeTime) {
            // console.log("removing explosion!");
            return false;
        } else {
            return true;
        }
    }
    
    this.fade = function() {
        timer++;
        // console.log("Timer: " + timer);
    };
    
    this.delete = function() {
        console.log("Removing sprite");
        topLayer.removeChild(sprite);
    }
}

var ExplosionHandler = function ExplosionHandler() {
    var explosions = [],
        i;
    
    this.addExplosion = function(fadeTime, x, y) {
        console.log("Creating an explosion: " + x + ", " + y);
        var explosion = new Explosion();
        explosion.init(fadeTime, x, y);
        explosions[explosions.length] = explosion;
    }
    
    // Fade explosions, delete them when their time is up
    this.Update = function() {
        
        for (i = 0; i < explosions.length; i++) {
            // console.log("Updating explosions!");
            explosions[i].fade();
            if (explosions[i].timedOut() === true) {
                explosions[i].delete(); 
                explosions.splice(i, 1);
            }
        }
    }
}