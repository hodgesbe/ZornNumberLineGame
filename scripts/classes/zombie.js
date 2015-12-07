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
// *****************************************************************
// -------------------- ZOMBIE OBJECT    ---------------------------
// *****************************************************************
//  Constructor
var Zombie = function Zombie() {
    
    this.init = function(id, type, speed, startPoint, targetPoint) {
        this.zID = id;
        this.typeID = type;
        this.zData = zombieTypes[type];
        this.zSpeed = speed;
        this.zPosition = startPoint;
        this.target = targetPoint;
        this.resourceID = "zombie" + this.zID;
        console.log("Want zombie resource: " + this.resourceID);
        this.zSprite = new Sprite(resources[this.resourceID].texture);
        topLayer.addChild(this.zSprite);
        //  Set anchor points
        // this.zSprite.anchor.x = this.zSprite.width/2;
        this.zSprite.anchor.set(0.5,1);
        this.zSprite.scale.set(0.1, 0.1);
        //  Set initial start position
        this.zSprite.position.x = gameController.game.numberLine.points[startPoint].x;
        this.zSprite.position.y = gameController.game.numberLine.points[startPoint].y;
        
        console.log("Zombie sprite created at point " + targetPoint);
        console.log(this.zSprite);
        console.log(this.zSprite.position.x + ", " + this.zSprite.position.y);
    }

    //  Sprite
    //  Create new sprite

    
    //  Function to update the zombies location on the number line
    this.goToNextPoint = function(){
        if(this.zPosition > this.target) {
            //  The zombie is right of the target
            if(checkHit("right")){
                //  Zombie has hit the target
                //  Call target-hit subroutine
                heroHit();
            }
            else{
                //  Move Zombie left
                moveZombie("left");
            }
        }
        if(this.zPosition < this.target){
            //  The zombie is left of the target
            if(checkHit("left")){
                //  Zombie has hit the target
                //  Call target-hit subroutine
                heroHit();
            }
            else{
                //  Move Zombie right
                moveZombie("right");
            }
        }
    };
//gameController.numberLine.points[currentPoint].x
    this.moveZombie = function(direction){
        if(direction == "left"){
            this.zPosition = this.zPosition -1;
        }
        if(direction == "right"){
            this.zPosition = this.zPosition +1;
        }
        this.position.x = gameController.game.numberLine.points[this.zPosition];
    }

    this.checkHit = function(direction){
        if(direction == "right"){
            if(this.target = this.zPosition -1){
                return true;
            }else{ return false; }
        }
        else{
            if(this.target = this.zPosition +1){
                return true;
            }else{ return false; }
        }
    };

    function heroHit(){
        gameController.game.hero.takeDamage()
    }


    this.getMC = function(){ return "MovieClip"}

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
};

// var testZombie = new Zombie(0, 0, 1, 11, 5);
// testZombie.getData();
// *****************************************************************
// -------------------- ZOMBIE CONTROLLER OBJECT -------------------
// *****************************************************************
var ZombieController = function ZombieController(){
    
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
        for( var i = 0; i < count; i++){

            if(this.randomZombie == this.maxZombieLevel -1)
            { 
                this.randomZombie = 0; 
            } else
            { 
                this.randomZombie++; 
            }
            //Zombie(id, type, speed, startPoint, targetPoint)
            var zombie = new Zombie();
            zombie.init(i, this.randomZombie, 2, this.randomStartIndex(this.lineSize), this.targetPointIndex);
            
            gameController.zombies[i] = zombie;
            // gameController.zombies[i].getData();
        };
    };

    this.randomStartIndex = function(lineSize){
        var rStart = randomInt(0,1);
        if( rStart == 0){
            return 0;
        }
        else{ return lineSize -1; }
    };
};