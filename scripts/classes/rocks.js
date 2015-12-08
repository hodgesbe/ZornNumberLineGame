// Rock scripts
// Nicholas Blum

// Rock handler is responsible for creating, maintaining, and destroying rock objects.
var RockHandler = function RockHandler() {
    
    var rocks = [],
        turnEnding = false,
        numRocks = 0;
    
    this.Move = function() {
        // For each sprite, move, check to see if current X = target X, if so delete
        var i;
        if (turnEnding === true) {
            for (i = 0; i < rocks.length; i++) {
                rocks[i].move();
                if (rocks[i].hitTarget()) {
                    rocks[i].Remove();
                    rocks.splice(i, 1);
                    numRocks--;
                    // console.log("Removing rock, number of rocks remaining: " + numRocks);
                }
            }
            if (numRocks === 0) {
                // console.log("Rocks have reached targets, calling finish launch.");
                turnEnding = false;
                gameController.checkZombies();
            }
        }

    };
    
    // Add rocks, then let the handler know that it is ok to move the rocks
    this.addRocks = function(targetPoint) {
        // console.log("Adding a rock with value: " + targetPoint.value);
        var rock = new Rock();
        if (targetPoint === false) {
            // console.log("No point found, shoot rock off screen!");
            if (gameController.currentFruitValue > 0) {
                rock.createSpaceRock(true);
            } else {
                rock.createSpaceRock(false);
            }
            
        } else {
            rock.init(targetPoint);
        }
        rocks[rocks.length] = rock;
        numRocks++;
        turnEnding = true;
    };
    
};

// Rock handles updating a singular rock sprite
var Rock = function Rock() {
    var targetX,
        sprite,
        speed = 8.0;
    
    this.init = function(targetPoint) {
        targetX = targetPoint.x;
        // console.log(targetPoint.x);
        sprite = new PIXI.Sprite(resources.Rock.texture);
        sprite.position.y = itemAreas.sidewalk.y - 100;
        sprite.position.x = renderWidth / 2;
        sprite.scale.set(0.2, 0.2);
        topLayer.addChild(sprite);
    }
    
    // If the player tried to hit something outside of the number line, this rock will shoot off into space
    this.createSpaceRock = function(isPositive) {
        if (isPositive) {
            targetX = 1400;
        } else {
            targetX = -200;
        }
        
        // console.log(targetPoint.x);
        sprite = new PIXI.Sprite(resources.Rock.texture);
        sprite.position.y = itemAreas.sidewalk.y - 100;
        sprite.position.x = renderWidth / 2;
        sprite.scale.set(0.2, 0.2);
        topLayer.addChild(sprite);
    }
    
    this.move = function() {
        // console.log(targetX + ", " + sprite.position.x);
        if (targetX > sprite.position.x) {
            sprite.position.x += speed;
        } else if (targetX < sprite.position.x) {
            sprite.position.x -= speed;
        }
    };
    
    this.hitTarget = function() {
        var difference = Math.abs(sprite.position.x - targetX);
        // console.log(difference);
        if (difference < 15) { // Difference should always be greater than speed, otherwise the rock will bounce back and forth without ever getting detected as close enough to remove. I recommend about twice the speed.
            return true;
        } else {
            return false;
        }
    }
    
    // Delete this rock and create an explosion where it hit!
    this.Remove = function() {
        gameController.explosions.addExplosion(45, sprite.position.x, sprite.position.y);
        topLayer.removeChild(sprite);
    }
}

