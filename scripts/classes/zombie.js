// *****************************************************************
// -----------------------ZOMBIE STUFF------------------------------
// *****************************************************************



function ZombieController() {

    var zombie = function (zombieIndex, zSpeed, zHealth, indexOfTarget, indexOfStart) {
        this.id = zombieIndex;
        this.speed = zSpeed;
        this.health = zHealth;
        this.target = indexOfTarget;
        this.start = indexOfStart;

        this.hit = function(){
            this.health--;
            if(this.health === 0){
                //  destroy this zombie
            }
        };
        this.move = function(){
            //  Check if bonus in effect
            var bonusInEffect = false;
            if(!bonusInEffect){
                //  //  update location
                if(this.target < this.location){
                    this.location--;
                }
                else{ this.location++;}

                //  Check for hero hit
                if(this.location === this.target) {
                    //  Call hero hit routing
                    //  TIE IN ???
                }
                //  update sprite drawing
                // WHO DO I ADDRESS ???
                //
            }
        };
    };
    var gameLevels = [
        {"levelNum": "0", "levelName": "Level 0", "zombieCount": "1"}
        //{"levelNum": 1, "levelName": "Level 1", "zombieCount": 2},
        //{"levelNum": 2, "levelName": "Level 2", "zombieCount": 4},
        //{"levelNum": 3, "levelName": "Level 3", "zombieCount": 6}
        ];

    console.log(gameLevels[level].zombieCount);
    this.zombieArray = [];
    this.generateZombies = function(){
        var i;
        for(i = 0; i < gameLevels[0].zombieCount; i++){
            console.log("Attempting to create zombie");
            this.zombieArray[i] = new zombie(i, 1, 1, 5, 10);
            console.log("Pushing zombie onto zombieArray!")
        }
    };

    /**
     for (var zombies of this.count){
        // this.zombieArray.push(zombie(zombies, ));
    }

    var updateZombies = function () {
        for(zombies of this.zombieArray){
            zombies.move();
        }
    };**/
};