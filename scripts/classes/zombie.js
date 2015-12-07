// *****************************************************************
// -------------------  ZOMBIE CONSTANTS  --------------------------
// *****************************************************************
var zombieDataDir = "assets/zombieData/";
var zombieTypes = [
    {"typeID": 0, "name": "creeper", "tsSource": zombieDataDir + "zombie0.png", "tsStates": {
        "stand": "zombie0.json",
        "walk": "zombie0.json"}
    }];


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
var Zombie = function Zombie(id, type, speed, startPoint, targetPoint){
    this.zID = id;
    this.zData = zombieTypes[type];
    this.zSpeed = speed;
    this.zPosition = startPoint;
    this.target = targetPoint;
    this.resourceID = "zombie" + this.zID;

//  Sprite
    //  Create new sprite
    this.zSprite = new Sprite(resources[this.resourceID].texture);
    stage.addChild(this.zSprite);
    //  Set anchor points
    this.zSprite.anchor.x = this.zSprite.width/2;
    this.zSprite.anchor.y = this.zSprite.height;
    //  Set initial start position
    this.zSprite.position.x = gameController.game.numberLine.points[startPoint].x;
    this.zSprite.position.y = gameController.game.numberLine.points[startPoint].y;

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
    function moveZombie(direction){
        if(direction == "left"){
            this.zPosition = this.zPosition -1;
        }
        if(direction == "right"){
            this.zPosition = this.zPosition +1;
        }
        this.position.x = gameController.game.numberLine.points[this.zPosition];
    }

    function checkHit(direction){
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
        var output =
            "ID: " + this.zID +
            "\nName: " + this.zData.name + "(" + this.zData.typeID +")" +
            "\nSpeed: " + this.zSpeed +
            "\nPosition: " + this.zPosition +
            "\nTileSheet: " + this.zData.tsSource +
            "\nStand: " + this.zData.tsStates.stand +
            "\nWalk: " + this.zData.tsStates.walk;
        return output;
    };
};

// *****************************************************************
// -------------------- ZOMBIE CONTROLLER OBJECT -------------------
// *****************************************************************
var ZombieController = function(levelID, lineSize){
    this.lineSize = lineSize;
    console.log("this.lineSize : " + this.lineSize);
    console.log("lineSize : " + lineSize);
    this.zombies = gameController.game.zombies;
    this.level = gameLevels[levelID];
    this.targetPointIndex = ((lineSize - 1) / 2);
    this.maxZombieLevel = gameLevels["zombieTypeMaxID"];
    this.randomZombie = 0;
    this.generateZombies = function(){
        var count = this.level["zombieCount"];
        console.log(count + " zombies of level: " + this.level["descrption"] + "\n will be created!");
        for( var i = 0; i < count; i++){

            if(this.randomZombie == this.maxZombieLevel -1){ this.randomZombie = 0; }else{ this.randomZombie++; }
            //Zombie(id, type, speed, startPoint, targetPoint)
            gameController.game.zombies[i] = new Zombie(i, this.randomZombie, this.level["zombieSpeed"], randomStartIndex(this.lineSize), this.targetPointIndex );
            gameController.game.zombies[i].init(i);
        };
    };

    function randomStartIndex(lineSize){
        var rStart = randomInt(0,1);
        if( rStart == 0){
            return 0;
        }
        else{ return lineSize -1; }
    };
};


//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//  DONT DELETE THIS STUFF YET !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//function ZombieController() {
//
//    var Zombie = function (zombieIndex, zSpeed, zHealth, indexOfTarget, indexOfStart) {
//        this.id = zombieIndex;
//        this.speed = zSpeed;
//        this.health = zHealth;
//        this.target = indexOfTarget;
//        this.start = indexOfStart;
//
//        this.hit = function(){
//            this.health--;
//            if(this.health === 0){
//                //  destroy this zombie
//            }
//        };
//        this.move = function(){
//            //  Check if bonus in effect
//            var bonusInEffect = false;
//            if(!bonusInEffect){
//                //  //  update location
//                if(this.target < this.location){
//                    this.location--;
//                }
//                else{ this.location++;}
//
//                //  Check for hero hit
//                if(this.location === this.target) {
//                    //  Call hero hit routing
//                    //  TIE IN ???
//                }
//                //  update sprite drawing
//                // WHO DO I ADDRESS ???
//                //
//            }
//        };
//    };
//    var gameLevels = [
//        {"levelNum": "0", "levelName": "Level 0", "zombieCount": "1"}
//        //{"levelNum": 1, "levelName": "Level 1", "zombieCount": 2},
//        //{"levelNum": 2, "levelName": "Level 2", "zombieCount": 4},
//        //{"levelNum": 3, "levelName": "Level 3", "zombieCount": 6}
//        ];
//
//    console.log(gameLevels[level].zombieCount);
//    this.zombieArray = [];
//    this.generateZombies = function(){
//        var i;
//        for(i = 0; i < gameLevels[0].zombieCount; i++){
//            console.log("Attempting to create zombie");
//            this.zombieArray[i] = new Zombie(i, 1, 1, 5, 10);
//            console.log("Pushing zombie onto zombieArray!")
//        }
//    };
//
//    /**
//     for (var zombies of this.count){
//        // this.zombieArray.push(Zombie(zombies, ));
//    }
//
//    var updateZombies = function () {
//        for(zombies of this.zombieArray){
//            zombies.move();
//        }
//    };**/
//};