// *****************************************************************
// -----------------------ZOMBIE STUFF------------------------------
// *****************************************************************
var zombies = [];

var zombieTypes = [
    {"typeID": 0, "name": "creeper", "tsSource": "zombie0ts.png", "tsStates": {
        "stand": "zombie0ts_stand.json",
        "walk": "zombie0ts_walk.json"}
    },
    {"typeID": 1, "name": "stinker", "tsSource": "zombie1ts.png", "tsStates": {
        "stand": "zombie1ts_stand.json",
        "walk": "zombie1ts_walk.json"}
    }];

var loader = PIXI.loader;
loader.add("zombie0ts_stand.json").load(onZombieLoad);
loader.on('loaded', function(evt) {
    evt.content.json;
});
var movie;
function onZombieLoad(){
    var frames = [];
    for(var i = 1; i < 4; i++){
        frames.push(PIXI.Texture.fromFrame('standing0' + i));
    }
    movie = new PIXI.extras.MovieClip(frames);

    movie.position.set(300);
    movie.anchor.set(0.5);
    movie.aniamtionSpeed = 600;
    movie.play();
    stage.addChild(movie);

    animate();
}


console.log(loader);
var gameLevels = [
    {"id": 0, "descrption": "beginner", "zombieCount": 1, "zombieSpeed": 1, "lineSize": 20},
    {"id": 1, "descrption": "easy", "zombieCount": 2, "zombieSpeed": 1, "lineSize": 16},
    {"id": 2, "descrption": "moderate", "zombieCount": 4,  "zombieSpeed": 1, "lineSize": 12},
    {"id": 3, "descrption": "insane", "zombieCount": 6, "zombieSpeed": 1, "lineSize": 8}];
var zombieConstants = {"zombieTypesCount": 2};

var ZombieController = function(levelID){
    var level = gameLevels[levelID];
    var maxZombies = zombieConstants["zombieTypesCount"];
    this.createZombies = function(){
        var count = level["zombieCount"];
        console.log(count + " zombies of level: " + level["descrption"] + "\n will be created!");
        var randomZombie = 0;
        var startSide = -1;
        for( var i = 0; i < count; i++){
            if(randomZombie == maxZombies -1){ randomZombie = 0; }else{ randomZombie++; }
            startSide *= -1;
            zombies.push(new zombie(i, randomZombie, level["zombieSpeed"], level["lineSize"] * startSide ));
            zombies[i].init(i);
        };
    };
};
var zombie = function zombie(id, type, speed, start){
    var zID = id;
    var zData = zombieTypes[type];
    var zSpeed = speed;
    var zPosition = start;

    this.getMC = function(){ return "MovieClip"}
    this.getData = function(){
        var output =
            "ID: " + zID +
            "\nName: " + zData.name + "(" + zData.typeID +")" +
            "\nSpeed: " + zSpeed +
            "\nPosition: " + zPosition +
            "\nTileSheet: " + zData.tsSource +
            "\nStand: " + zData.tsStates.stand +
            "\nWalk: " + zData.tsStates.walk;
        return output;
    };
    this.init = function(index){
        loader.add('zombie' + index, zData.tsStates.stand).load(onLoadZombie);
    }
    function onLoadZombie(){
        console.log("Zombie " + this.getMC() + "has loaded");
    }
};

//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//  DONT DELETE THIS STUFF YET !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//function ZombieController() {
//
//    var zombie = function (zombieIndex, zSpeed, zHealth, indexOfTarget, indexOfStart) {
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
//            this.zombieArray[i] = new zombie(i, 1, 1, 5, 10);
//            console.log("Pushing zombie onto zombieArray!")
//        }
//    };
//
//    /**
//     for (var zombies of this.count){
//        // this.zombieArray.push(zombie(zombies, ));
//    }
//
//    var updateZombies = function () {
//        for(zombies of this.zombieArray){
//            zombies.move();
//        }
//    };**/
//};