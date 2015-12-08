// It's okay to have "use strict" outside of a function so tell JSLint that
/*jslint node: true, white: true */

// We need to let JSLint know about PIXI definitions (to avoid PIXI was used before it was defined, etc)
/*global PIXI, requestAnimationFrame */

//This tells jslint to f off on reporting increment warnings
/*jslint plusplus: true */


// *****************************************************************
// -------------------  ZOMBIE CONSTANTS  --------------------------
// *****************************************************************
var zombieDataDir = "assets/zombieData/";
var zombieTypes = [
    {"typeID": 0, "name": "creeper", "tsSource": zombieDataDir + "zombie0.png", "tsStates":
        {
            "stand": "zombie0.json",
            "walk": "zombie0.json"
        }
    }
];


var gameLevels = [
    {"id": 0, "descrption": "beginner", "zombieCount": 1, "zombieSpeed": 1, "lineSize": 20, "zombieTypeMaxID": 1},
    {"id": 1, "descrption": "easy", "zombieCount": 2, "zombieSpeed": 1, "lineSize": 16, "zombieTypeMaxID": 2},
    {"id": 2, "descrption": "moderate", "zombieCount": 4,  "zombieSpeed": 1, "lineSize": 12, "zombieTypeMaxID": 2},
    {"id": 3, "descrption": "insane", "zombieCount": 6, "zombieSpeed": 1, "lineSize": 8, "zombieTypeMaxID": 3}];
var zombieConstants = {"zombieTypesCount": 2};


// var testZombie = new Zombie(0, 0, 1, 11, 5);
// testZombie.getData();
// *****************************************************************
// -------------------- ZOMBIE CONTROLLER OBJECT -------------------
// *****************************************************************
var ZombieController = function ZombieController() {
    
    var i,
        moving = false;
    
    this.levelID = "";
    this.lineSize = "";
    
    this.init = function(levelID, lineSize) {
        console.log("We are creating the zombies for level: " + levelID);
        this.levelID = levelID;
        this.lineSize = lineSize;
        this.zombies = [];
        this.level = gameLevels[this.levelID];
        this.targetPointIndex = ((lineSize - 1) / 2);
        this.maxZombieLevel = this.level.zombieTypeMaxID;
        this.randomZombie = 0;
    };
    
    this.generateZombies = function() {
        var count = this.level.zombieCount;
        // console.log(count + " zombies of level: " + this.level["descrption"] + "\n will be created!");
        for(i = 0; i < count; i++){

            if(this.randomZombie === this.maxZombieLevel -1)
            { 
                this.randomZombie = 0; 
            } else
            { 
                this.randomZombie++; 
            }
            //Zombie(id, type, speed, startPoint, targetPoint)
            var zombie = new Zombie();
            zombie.init(i, this.randomZombie, this.level.zombieSpeed * 8, this.randomStartIndex(this.lineSize), this.targetPointIndex);
            
            this.zombies[i] = zombie;
            // gameController.zombies[i].getData();
        }
    };

    this.randomStartIndex = function(lineSize){
        var rStart = Math.random(0,1);
        console.log("Random index is " + rStart);
        if( rStart < 0.5){
            return 0;
        }
        else
        { 
            return lineSize -1; 
        }
    };
    
    this.moveZombies = function() {
        var checkMoving;
        if (moving === true) {
            console.log("Doing a move, so checkMoving is getting set to false.");
            checkMoving = false;
        }
        for (i = 0; i < this.zombies.length; i++) {
            // console.log("Moving zombie " + i);
            // console.log("Moving zombies!");
            this.zombies[i].moveZombie();
            if (moving === true) {
                console.log("Is zombie moving?" + this.zombies[i].moving);
                if (this.zombies[i].moving === true) {
                    console.log("Setting checkMoving to true!");
                    checkMoving = true;
                }
            }
        }
        // If we are doing a zombie move, but the zombies have finished, we're done
        if (moving === true && checkMoving === false) {
            moving = false;
            gameController.finishLaunch();
            console.log("Zombie has reached its destination");
        } else if (moving === true) {
            console.log("Still moving");
        }
    };
    
    this.updateZombies = function() {
        console.log("Trying to update zombies");
        for (i = 0; i < this.zombies.length; i++) {
            this.zombies[i].updatePoint();
        }
        moving = true;
    };
    
    /**
    * This function should check to see if any of the zombies were hit, and whether they were direct hits or not.
    */
    this.checkZombiesHit = function(value) {
        console.log("Checking if the player has hit a zombie")
        for (i = 0; i < this.zombies.length; i++) {
            // console.log(value + ", " + this.zombies[i].target);
            var zombieHit = false;
            // Check to see if value is greater than zombie if zombie is to the right of number line
            if (value >= this.zombies[i].target > 0) {
                console.log("You shot past zombie on the right");
                zombieHit = true;
                
                // So now we know that you hit a zombie, but we should add a bonus if it was a direct hit
                if (value === this.zombies[i].target) {
                    console.log("Direct hit, adding a bonus");
                    gameController.game.bonus.addButterBonus();
                }
            }
            // Or, check to see if value is less than zombie if zombie is to the left of number line
            else if (value <= this.zombies[i].target < 0) {
                console.log("You shot past zombie on the left");
                zombieHit = true;
                
                // So now we know that you hit a zombie, but we should add a bonus if it was a direct hit
                if (value === this.zombies[i].target) {
                    console.log("Direct hit, adding a bonus");
                    gameController.game.bonus.addSunBonus();
                }
            }
            
            // Remove the zombie if it is hit
            if (zombieHit === true) {
                this.zombies[i].Remove();
                this.zombies.splice(i, 1);
            }
        }
    }
    
    this.checkZombiesAttack = function() {
        for (i = 0; i < this.zombies.length; i++) {
            console.log("Checking zombie target: " + this.zombies[i].target + ", " + this.zombies[i].heroPos);
            if (this.zombies[i].target === this.zombies[i].heroPos) {
                console.log("Zombie attacking hero!");
                this.zombies[i].Remove();
                this.zombies.splice(i, 1);
                this.heroHit();
            }
        }
    }
    
    this.heroHit = function(){
        gameController.game.hero.takeDamage();
    };
};

// *****************************************************************
// -------------------- ZOMBIE OBJECT    ---------------------------
// *****************************************************************
//  Constructor
var Zombie = function Zombie() {
    
    this.init = function(id, type, speed, startPoint, targetPoint) {
        this.moving = false;
        this.zID = id;
        this.typeID = type;
        this.zData = zombieTypes[type];
        this.zSpeed = speed;
        this.zPosition = startPoint;
        this.target = targetPoint; // This is the numeric value of the target point
        this.heroPos = gameController.game.numberLine.getOrigin(); // This is the value of the hero position
        this.resourceID = "zombie" + this.zID;
        console.log("Want zombie resource: " + this.resourceID);
        this.zSprite = new Sprite(resources[this.resourceID].texture);
        dynamicLayer.addChild(this.zSprite);
        //  Set anchor points
        // this.zSprite.anchor.x = this.zSprite.width/2;
        this.zSprite.anchor.set(0.5,1);
        if(this.zPosition < this.heroPos){
            this.zSprite.scale.set(0.5, 0.5);
        }else{this.zSprite.scale.set(-0.5, 0.5); }

        //  Set initial start position
        this.zSprite.position.x = gameController.game.numberLine.getPoint(this.target).x;
        this.zSprite.position.y = gameController.game.numberLine.points[startPoint].y;
        
        // console.log("Zombie sprite created at point " + targetPoint);
        // console.log(this.zSprite);
        // console.log(this.zSprite.position.x + ", " + this.zSprite.position.y);
    };


    this.moveZombie = function(){
        // console.log(targetPos);
        var targetX = gameController.game.numberLine.getPoint(this.target).x;
        var difference = Math.abs(this.zSprite.position.x - targetX);
        // console.log("Trying to move to x: " + targetX)
        // console.log(this.zSprite.position.x);
        if (difference > 5) {
            if (this.zSprite.position.x < targetX) {
                this.zSprite.position.x += 10;
                // console.log("Moving right!");
            } else if (this.zSprite.position.x > targetX) {
                // console.log("Moving left!");
                this.zSprite.position.x -= 10;
            } else {
                // console.log("Not moving!");
            }
        } else if (this.moving === true) {
            console.log("Not moving anymore.");
            this.moving = false;
        }
    };
    
    this.updatePoint = function() {
        // console.log("Updating zombie target point!");
        if (this.target > this.heroPos) { // We are to the right, so go left at speed
            this.target -= this.zSpeed;
            // console.log("New target " + this.target);
            // Check if we've passed the hero now.
            // console.log(this.target + ", " + this.heroPos);
            if (this.target <= this.heroPos) {
                console.log("Zombie has hit the player!");
                this.target = this.heroPos;
            }
        } else { // We are to the left, so go right at speed
            this.target += this.zSpeed;
            console.log(this.target + ", " + this.heroPos);
            // console.log("New target " + this.target);
            // Check if we've passed the target
            if (this.target >= this.heroPos) {
                console.log("Zombie has hit the player!");
                this.target = this.heroPos;
            }
        }
        
        this.moving = true; // We're now moving!
    };

    this.getMC = function(){ return "MovieClip"};

    //  Utility method for determining zombie instance data values
    this.getData = function(){
        console.log(this.zData);
        var output =
            "ID: " + this.zID +
            "\nName: " + this.zData[this.typeID].name + "(" + this.zData["typeID"] +")" +
            "\nSpeed: " + this.zSpeed +
            "\nPosition: " + this.zPosition +
            "\nTileSheet: " + this.zData["tsSource"];

        return output;
    };
    
    this.Remove = function() {
        dynamicLayer.removeChild(this.zSprite);
    };
};