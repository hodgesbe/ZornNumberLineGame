// Game Logic for Project ZORN
// Collaborators: Brett, Ben, Jason, Nicholas

// It's okay to have "use strict" outside of a function so tell JSLint that
/*jslint node: true, white: true */
"use strict";

// We need to let JSLint know about PIXI definitions (to avoid PIXI was used before it was defined, etc)
/*global PIXI, requestAnimationFrame */

//This tells jslint to f off on reporting increment warnings
/*jslint plusplus: true */

// -------------------------------------------------
// Full Scope Variables (not function-specific)
// The scene itself, and positioning of the objects in the scene
// -------------------------------------------------
var htmlWindow;             // This will be the render window

var renderer;               // Will create either a Canvas or WebGL renderer depending on the user's computer
var renderWidth = 1280;
var renderHeight = 720;
var gameAssets;             // Contains references to our game's loaded assets
var level;                  // Current level of game
var tink;                   // Handler to access the Tink library of functions. See: https://github.com/kittykatattack/tink
var pointer;                // Our mouse pointer object

/**
In terms of hierarchy, our scene works as such:
stage
    mainMenu
    gameStage
        backgroundLayer
        cloudLayer
        hudLayer
        dynamicLayer
        topLayer
    infoStage
**/
var stage;                  // The container for PIXI.JS, also called "stage" by a lot of documentation
var gameStage;              // The container for all other game layers
var infoStage;              // Container for our information screen
var gameOverStage;          //Container for our game over screen
var mainMenu;               // Container for main menu screen
var backgroundLayer;        // Contains static background images
var cloudLayer;             // Contains moving clouds
var hudLayer;               // Contains UI elements such as buttons
var dynamicLayer;           // Contains apples, zombies, player, etc.
var topLayer;               // Contains whatever item is currently being dragged

//  Graphic Items coordinates as JSON array object.
var itemAreas;
itemAreas = {
    "background": {"x": 0, "y": 0, "width": 1024, "height": 768},
    "leftTree": {"x": 65, "y": 180, "width": 330, "height": 250},
    "rightTree": {"x": 880, "y": 180, "width": 330, "height": 250},
    "basket1": {"x": 450, "y": 315, "width": 151, "height": 126},
    "basket2": {"x": 695, "y": 315, "width": 151, "height": 126},
    "sidewalk": {"x": 0, "y": 625, "width": 1024, "height": 32},
    "sun": {"x": renderWidth -150, "y": 30, "width": 50, "height": 50},
    "zombieCounter": {"x": 0, "y": 0, "width": renderWidth / 4, "height": 100},
    "bonusCounter": {"x": renderWidth / 2 - 150, "y": 0, "width": 300, "height": 100}
};

//arrays of fruit objects for positive values and negative values
var posFruitBin = [], 
    negFruitBin = [];

// Draggable fruit handler variables and functions
var dragParams = {
    previousPos: {x: 0, y: 0},
    currentFruit: null,
    overBasket: function (fruitSprite) {
        if ((fruitSprite.position.x < itemAreas.basket1.x + itemAreas.basket1.width && fruitSprite.position.x > itemAreas.basket1.x
            && fruitSprite.position.y < itemAreas.basket1.y + itemAreas.basket1.height && fruitSprite.position.y > itemAreas.basket1.y) ||
            (fruitSprite.position.x < itemAreas.basket2.x + itemAreas.basket2.width && fruitSprite.position.x > itemAreas.basket2.x
            && fruitSprite.position.y < itemAreas.basket2.y + itemAreas.basket2.height && fruitSprite.position.y > itemAreas.basket2.y)) {
            return true;
        }
        return false;
    }
};

var numLineParams = {
    offset: 15,
    startX: 15,
    endX: renderWidth-15,
    Y: itemAreas.sidewalk.y
};

// Easy names for long PIXI strings
var resources = PIXI.loader.resources,
    loadTexture = PIXI.utils.TextureCache,
    Graphics = PIXI.Graphics,
    Sprite = PIXI.Sprite;

// Our game chain starts by constructing a game controller
var gameController = new GameController();
gameController.init();


// ---------------------------------
// Controller
// ---------------------------------
// GameController will link the logic and the graphics of the game together
function GameController() {
    console.log("Here we go!");

    this.hud = new Graphics();
    this.zombies = [];
    this.sun = "";
    this.numberLine = "";
    this.clouds = "";
    this.game = new Game(this);
    
    
    fruitAmount: 0;
    this.currentFruitValue = 0;
    
    //Alias
    var game = this.game;
    
    this.init = function () {
        
        console.log("Initializing game controller and PIXI window.");

        htmlWindow = document.getElementById("renderWindow");
        renderer = PIXI.autoDetectRenderer(renderWidth, renderHeight);
        stage = new PIXI.Container();
        gameStage = new PIXI.Container();
        infoStage = new PIXI.Container();
        gameOverStage = new PIXI.Container();
        mainMenu = new PIXI.Container();
        
        backgroundLayer = new PIXI.Container();
        cloudLayer = new PIXI.Container();
        hudLayer = new PIXI.Container();
        dynamicLayer = new PIXI.Container();
        topLayer = new PIXI.Container();
        
        renderer.backgroundColor = 0xAAAAAA; 
        htmlWindow.appendChild(renderer.view);
        
        // Load in assets
        PIXI.loader
        .add("staticBG", "assets/artwork/ZornBG_1280x720-ALT.png")
        .add("image_sun", "assets/artwork/sun.png")
        .add("iZombie", "assets/artwork/zombie8.png")
        .add("infoButton", "assets/ui/Info.png")
        .add("apple", "assets/artwork/apple_small.png")
        .add("buttonUp", "assets/ui/button_up.png")
        .add("buttonOver", "assets/ui/button_over.png")
        .add("buttonDown", "assets/ui/button_down.png")
        .add("launch_up", "assets/artwork/launch_up.png")
        .add("launch_over", "assets/artwork/launch_over.png")
        .add("launch_down", "assets/artwork/launch_down.png")
        .add("help_up", "assets/artwork/help_up.png")
        .add("help_over", "assets/artwork/help_over.png")
        .add("help_down", "assets/artwork/help_down.png")
        .add("cloud1", "assets/artwork/cloud1.png")
        .add("butter_bonus", "assets/artwork/butter.png")
        .add("sun_bonus", "assets/artwork/Bonus_Sun.png")
        .add("game_character", "assets/artwork/hero.png")
        .add("reset_up", "assets/artwork/reset_up.png")
        .add("reset_over", "assets/artwork/reset_over.png")
        .add("reset_down", "assets/artwork/reset_down.png")
        .add("pow_effect", "assets/artwork/pow_effect.png")
        .add("play_again_up", "assets/artwork/play_again.png")
        .add("play_again_over", "assets/artwork/play_again_over.png")
        .add("play_again_down", "assets/artwork/play_again_down.png")
        .load(function (loader, resources) {
            gameAssets = resources;
            gameController.onAssetsLoaded();
        });
        // console.log(resources);
    };
    
    // We have to wait for the assets to finish loading before we can start anything else
    // They load asynchronously, so this is called in the PIXI.loader itself.
    this.onAssetsLoaded = function () {
        console.log("Assets have been loaded");
    
        // Tink stuff for event handlers and what not
        tink = new Tink(PIXI, renderer.view);
        pointer = tink.makePointer();

        game.init();
        this.buildGameWindow();
        this.buildLevelGraphics();
    };
    
    // Graphics that stay the same throughout levels should be put here.
    this.buildGameWindow = function () {
        console.log("Building the game window.");
        var i;
        
        // STATIC OBJECTS
        this.staticBG = new Sprite(gameAssets.staticBG.texture);
        this.staticBG.position.x = itemAreas.background.x;
        this.staticBG.position.y = itemAreas.background.y;
        gameStage.addChild(this.staticBG);

        this.sun = new Sprite(gameAssets.image_sun.texture);
        this.sun.position.x = itemAreas.sun.x;
        this.sun.position.y = itemAreas.sun.y;
        gameStage.addChild(this.sun);
    
        // Build the clouds
        this.clouds = new Clouds();
        
        // add dynamic stage
        // Child all screens to the main stage

        
        // Build the HUD
        buildHud();

        
        // Build other screens
        buildInfoScreen();
        
        // Hide other screens
        infoStage.visible = false;
        gameOverStage.visible = false;

        // Now that everything is constructed, we can add them to the scene
        stage.addChild(gameStage);
        stage.addChild(infoStage);
        stage.addChild(gameOverStage)
        
        gameStage.addChild(backgroundLayer);
        gameStage.addChild(cloudLayer);
        gameStage.addChild(hudLayer);
        gameStage.addChild(dynamicLayer);
        gameStage.addChild(topLayer);
        render();
    };
    
    // Level-specific graphics should go here
    this.buildLevelGraphics = function () {
        displayNumberLine(this.game.getNumberLine());
        // displayFruit
        // displayZombies
    };
}

// This is our animation/game loop.
function render() {
    requestAnimationFrame(render); // This line ensures that render is called each frame, not just once.
    tink.update();
    gameController.clouds.Move();
    renderer.render(stage);
}

function Game(gc) {
    this.gameController = gc;
    this.bonus = new Bonus();
    this.hero = new Hero();
    this.numberLine = ""; // We want to initialize this again every new level
    this.directHits = 0;
    this.fruitBucket = "";
    this.fruitBin = new FruitBin();
    
    // Stuff that should happen once, at the start of a game
    this.init = function () {
        // Level starts at 0
        level = 0;
        this.hero.init();
        this.bonus.init();
        this.buildLevel ();
    };
    
    // Stuff that should happen every level
    this.buildLevel = function () {
        
        this.numberLine = new NumberLine();
        this.numberLine.init();
        this.numberLine.printPoints(); //prints value of each point in console log
        this.fruitBin.init();

        //  Zombie Stuff
        this.zombieController = new ZombieController();
        this.zombieController.generateZombies();
        
        console.log("Level " + " created.");
    };
    
    this.getBonusController = function () {
        return this.bonus;
    };
    
    this.getNumberLine = function () {
        return this.numberLine;
    };
    
}

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

// --------------------------------
// Logic scripts / classes
// --------------------------------
var NumberLine = function NumberLine() {
    // Constructor
    this.points = [];
    this.start = 0;
    this.length = 0;
        
    this.init = function () {
        var i;
        // Set size based on level
        switch (level) {
        case 0:
                console.log("Numberline case 0");
            this.start = randomInt(-10, -2);
            break;
        }
        
        // Length is always a function of start
        this.length = Math.abs(this.start * 2) + 1;
        
        // Build points
        for (i = 0; i < this.length; i += 1) {
            this.points[i] = new Point(this.start + i, i, this.length);
        }
    };
    
    this.printPoints = function () {
        var i;
        //console.log("Printing points. Length = " + this.length);
        for (i = 0; i < this.length; i += 1) {
            //console.log(this.points[i].index);
        }
    };
};

// A Point object knows its index as well as the x and y position on the screen to render
var Point = function Point(value, index, length) {
    this.value = value;
    this.index = index;
    this.x = numLineParams.startX + (numLineParams.endX / length * index) + ((numLineParams.endX / length * (index+1) - (numLineParams.endX / length * index)) / 2);
    this.y = numLineParams.Y;
};

//Hero Object
function Hero() {

    //Creates a new Hero object with full health
    var healthBar = new PIXI.Container();
    var innerBar = new Graphics();
    var outerBar = new PIXI.Graphics();
    var healthTitle;
    var damageCount = 0;

    //should display character on initilization but is not working
    //the function is called and the console logs show up
    //possibly is being called before the stage is being built?
    this.init = function () {
        this.health = 100;
        console.log("Current Hero health: " + this.health);
        this.showHero();
    };

    //temporary function to display hero until we can figure out why it wont display during initialization
    this.showHero = function () {
        var hero_sprite = new Sprite(resources.game_character.texture);
        hero_sprite.position.x = 590;
        hero_sprite.position.y = 500;
        gameStage.addChild(hero_sprite);


        //Health Bar (Should probably be moved to game hero init but doesnt currently work from there)
        healthBar.position.set(910, 45);
        gameStage.addChild(healthBar);

        //healthBar Inner
        innerBar.beginFill(0x000000);
        innerBar.drawRect(0, 0, 200, 30);
        innerBar.endFill();
        healthBar.addChild(innerBar);

        //HealthBar Outer
        outerBar.beginFill(0xFF3300);
        outerBar.drawRect(0, 0, 200, 30);
        outerBar.endFill();
        healthBar.addChild(outerBar);
        healthBar.outer = outerBar;


        //text with health is not working properly as health is not updating when player takes damage.
        //should also be placed in the "play" function or outside of the hero function
        healthTitle = new PIXI.Text(
            "Hero's Health: " + this.health + "%",
            {font: "32px Sans-serif", fill: "white"}
        );
        healthTitle.x = 878;
        healthTitle.y = 2;
        gameStage.addChild(healthTitle);

    };


    //default damage (decrements by 10)
    this.takeDamage = function () {
        if(this.health>0) {
            this.health = this.health - 10;
            console.log("Current Hero health: " + this.health);
            //take damage is not updating health bar.
            //Should be decrementing when takeDamage is called so should be listening outside the hero function
            healthBar.outer.width -= 20;
            gameStage.removeChild(healthTitle);
            healthTitle = new PIXI.Text(
                "Hero's Health: " + this.health + "%",
                {font: "32px Sans-serif", fill: "white"}
            );
            healthTitle.x = 878;
            healthTitle.y = 2;
            gameStage.addChild(healthTitle);

            var pow = new Sprite(resources.pow_effect.texture);
            pow.position.set(550, 400);
            gameStage.addChild(pow);
            //Need to add a remove or fade function.
        }else if(this.health === 0){
            buildGameOverScreen();
            gameStage.visible = false;
            gameOverStage.visible = true;
        }
    };

    //returns hero health
    this.returnHealth = function () {
        return this.health;
    };
}

//Creates Bonus Objects with getter and setter methods
function Bonus() {

    this.butter_sprites_Arr;
    this.sun_sprite_Arr;
    this.butter_bonus_count;
    this.sun_bonus_count;


    //creates bonus object with empty sun and butter values
    this.init = function(){
        console.log("Bonus init. Sun: " + this.sunValues + ", Butter: " + this.butterValues + ".");


        this.butter_bonus_count = 0;
        this.sun_bonus_count = 0;


        //creates 3 butter_bonus sprites
        var butter_sprite1 = new Sprite(resources.butter_bonus.texture);
        var butter_sprite2 = new Sprite(resources.butter_bonus.texture);
        var butter_sprite3 = new Sprite(resources.butter_bonus.texture);

        //assigns position to the sprites
        butter_sprite1.position.set(684, 50);
        butter_sprite2.position.set(747, 50);
        butter_sprite3.position.set(810, 50);

        //adds butter_bonus sprites to an array
        this.butter_sprites_Arr = [butter_sprite1, butter_sprite2, butter_sprite3];

        //Creates 3 sun_bonus_sprite objects
        var sun_bonus_sprite1 = new Sprite(resources.sun_bonus.texture);
        var sun_bonus_sprite2 = new Sprite(resources.sun_bonus.texture);
        var sun_bonus_sprite3 = new Sprite(resources.sun_bonus.texture);

        //assigns position to sun_bonus_sprites
        sun_bonus_sprite1.position.set(537, 50);
        sun_bonus_sprite2.position.set(435, 50);
        sun_bonus_sprite3.position.set(333, 50);

        //adds sun_bonus_sprites to array
        this.sun_sprite_Arr = [sun_bonus_sprite1, sun_bonus_sprite2, sun_bonus_sprite3];

    };

    //adds butter bonus value. Takes an int for added bonus
    this.addButterBonus = function(){
        console.log(this.butterValues);
        if (this.butter_bonus_count<3){
            this.butter_bonus_count++;
            gameStage.addChild(this.butter_sprites_Arr[this.butter_bonus_count-1]);
        }

    };

    //removes butter bonus
    this.removeButterBonus = function(){
        console.log("removing butter!");
        if(this.butter_bonus_count>0){
            gameStage.removeChild(this.butter_sprites_Arr[this.butter_bonus_count-1]);
            this.butter_bonus_count--;
        }
    };

    //adds sun bonus value. Takes an int for added bonus
    this.addSunBonus = function(){
        console.log(this.sunValues);
        if(this.sun_bonus_count<3){
            this.sun_bonus_count++;
            gameStage.addChild(this.sun_sprite_Arr[this.sun_bonus_count-1]);
        }
    };

    this.removeSunBonus = function(){
        console.log("Removing sun bonus!")
        if(this.sun_bonus_count>0){
            gameStage.removeChild(this.sun_sprite_Arr[this.sun_bonus_count-1]);
            this.sun_bonus_count--;
        }
    }

    //returns the amount of butter bonuses
    this.getButterBonus = function(){
      return this.butter_bonus_count;
    };

    //returns the amount of sun bonuses
    this.getSunBonus = function(){
        return this.sun_bonus_count;
    };

}

//Creates a fruit object which contains the graphic
var Fruit = function Fruit (fruitValue){
    //Constructor
    this.fruitValue = fruitValue; //value to be displayed on fruit
    this.fruitGraphic = new Graphics(); //Graphic that contains both fruit sprite and value message
    this.fruitSprite = new Sprite(resources.apple.texture); //actual sprite
    var message = new PIXI.Text("" + this.fruitValue,
                               {font: "16px sans-serif", fill: "white"}); //message which displays value
    
    //---Function to update sprites location and adjust message location as well
    this.addLoc = function (X, Y){
        //adjust sprite to be correct size and location
        this.fruitSprite.position.set(X,Y);
        // this.fruitSprite.scale.set(0.07, 0.07);
        // this.fruitSprite.anchor.set(0.5, 0.5);
        //overlay message on sprite
        if (fruitValue < 0) {
            message.anchor.set(-0.5, -0.55);
        } else {
            message.anchor.set(-1.1, -0.55);
        }
        
        message.position.set(0,0);
        
        // Sprite event handlers
        // this.fruitSprite.circular = true;
        tink.makeDraggable(this.fruitSprite);
        tink.makeInteractive(this.fruitSprite);
        
        // If the mouse is pressed while over this sprite and not currently dragging something else,
        // pick this sprite up and remember its previous position.
        this.fruitSprite.press = () => { // Using = () => over function () binds this object's referencing environment
            if (dragParams.currentFruit === null) {
                console.log("Fruit clicked: " + this.fruitValue);
                dragParams.previousPos.x = this.fruitSprite.position.x;
                dragParams.previousPos.y = this.fruitSprite.position.y;
                dragParams.currentFruit = this.fruitSprite;
                topLayer.addChild(this.fruitSprite);
            }
        };
        
        // If the mouse is released while dragging this sprite, return it to previous position
        this.fruitSprite.release = () => {
            if (dragParams.currentFruit === this.fruitSprite) {
                if (dragParams.overBasket(this.fruitSprite) === true) {
                    gameController.currentFruitValue += this.fruitValue;
                    console.log("Fruit in basket = " + gameController.currentFruitValue);
                    this.fruitSprite.draggable = false;
                } else {
                    this.fruitSprite.position.x = dragParams.previousPos.x;
                    this.fruitSprite.position.y = dragParams.previousPos.y;
                    
                }
                dragParams.currentFruit = null;
                dynamicLayer.addChild(this.fruitSprite);

            }
        };
        
        
        //add sprite and message to graphic
        this.fruitGraphic.addChild(this.fruitSprite);
        this.fruitSprite.addChild(message);
        // dynamicStage.addChild(this.fruitSprite);
    }
};

function FruitBin() { 
    
    var fruitTarget, //target sum of all fruit values        
        fruitMin, //minimum number of all fruit needed for level
        possibleValues = [], //array of values for fruit
        i; //index for iteration
    this.posLocation = [];
    this.negLocation = [];
        
    //---Function to create 2d array of coordinates to display fruit based off leftTree and tree2item areas
    this.setLocation = function (){
        //Alias
        var pos = itemAreas.rightTree,
            neg = itemAreas.leftTree,
            row, col,
            fruitSprite = new Sprite(resources.apple.texture),
            fx, fy,
            posLoc = [[],[],[],[],[],[],[],[],[]], negLoc = [[],[],[],[],[],[],[],[],[]],
            r, c, box;
        
            fx = fruitSprite.width,
            fy = fruitSprite.height;
            
        //Fill location values with all available locations within tree boxes
        for (row = fx/2; row < neg.width-0.5*fx; row += 1.5*fx){
            if (row < neg.width/3){r=0;}
            else if (row < neg.width*2/3){r=1;}
            else {r=2;}
            for (col = fy/2; col < neg.height-0.5*fy; col += 1.5*fy){
                if (col < neg.height/3){c=0;}
                else if (col < neg.height*2/3){c=1;}
                else {c=2;}
                box = 3*r+c;
                posLoc[box].push([pos.x-(fx/2)+row,pos.y+col]);
                negLoc[box].push([neg.x-(fx/2)+row,neg.y+col]);
            }
        }
        this.posLocation = posLoc;
        this.negLocation = negLoc;        
    }
    
    //---Function to set sprite locations for each fruit
    this.addFruit = function (){
        console.log("Adding fruit");
        
        var i,
            posPool,
            negPool,
            index,
            coords = [],
            box,
            counter = 0;
        
        //fill pos and neg arrays with possible values
        this.setLocation(); 
        console.log("Needed Fruit: "+posFruitBin.length);
        console.log("Set location:");
        
        //randomly select a location for each fruit from posible location
        for (i = 0; i < posFruitBin.length; i++){
            counter++;
            box = i%9;
            posPool = this.posLocation[box];
            negPool = this.negLocation[box];
            console.log("Adding fruit: " + box);
            console.log(posPool);
            //randomly select positve location from pool of positive indices
            index = randomInt(0, posPool.length-1);
            coords = posPool.splice(index, 1);
            //console.log("index: "+index+" coords: ");
            //console.log(coords);
            posFruitBin[i].addLoc(coords[0][0],coords[0][1]);
            
            //randomly select negative location from pool of negative indices
            index = randomInt(0, negPool.length-1);
            coords = negPool.splice(index, 1);
            negFruitBin[i].addLoc(coords[0][0],coords[0][1]);
            
            //add graphics to dynamicStage container      -----------------------------------NOT WORKING HERE-----------------------
            //console.log(posFruitBin[i].fruitGraphic);
            dynamicLayer.addChild(posFruitBin[i].fruitGraphic);
            dynamicLayer.addChild(negFruitBin[i].fruitGraphic);
        }
        console.log("Ending fruit: "+counter);
    }
    
    //---Randomly select fruit values, create fruit with those values
    this.init = function (){
        console.log("Creating a fruit bin");
        var posFruitValues = [],
            negFruitValues = [];
        
        switch (level) {
            case 0:
                console.log("Switching on level creating bin - level: " + level);
                fruitTarget = 42;
                fruitMin = 15;
                possibleValues = [1,1,1,2,2,2,2,2,3,3,3,3,3,3,3,4,4,4,4,5];
                break;
        }
        //continue picking fruit until number is larger than minimum number of fruit for level
        while (posFruitValues.length < fruitMin){
            //reset fruit sum and list of fruit values
            var fruitSum = 0,
                index,
                fruitValue; 
            posFruitValues = [];     
            negFruitValues = [];
            //pick fruit values up to Max value
            while (fruitSum < fruitTarget){
                index = Math.floor(Math.random()*possibleValues.length);
                fruitValue = possibleValues[index];
                //add positive and negative fruit values to fruit values
                posFruitValues.push(fruitValue); 
                negFruitValues.push(-fruitValue); 
                fruitSum += fruitValue;  
            }            
        }
        //add fruit objects using value array
        for (i=0; i<posFruitValues.length; i++){
            posFruitBin[i] = new Fruit (posFruitValues[i]);
            negFruitBin[i] = new Fruit (negFruitValues[i]);
        }
        this.addFruit();
    };
  
};

// --------------------------------
// View scripts
// --------------------------------

function displayNumberLine() {
    // console.log("Displaying the numberline.");
    var i,
        line,
        dash,
        dashWidth = 3,
        label,
        message,
        numberLine = gameController.game.numberLine;
    
    
    // Create a dash and a number at each "point" on the number line.
    for (i = 0; i < numberLine.length; i++) {
        console.log("Creating a point!");
        // Create a point
        dash = new Graphics();
        dash.beginFill(0x000000);
        //console.log("x: " + numberLine.points[i].x + ", y: " + numberLine.points[i].y);
        dash.drawRect(numberLine.points[i].x, numberLine.points[i].y, dashWidth, itemAreas.sidewalk.height);
        dash.endFill();
        backgroundLayer.addChild(dash);
        
        // Create a number
        // It should be placed beneath the bottom of the dash that has just been drawn
        message = new PIXI.Text(numberLine.points[i].value,
                               {font: "24px sans-serif", fill: "white"});
        message.position.set(numberLine.points[i].x, numberLine.points[i].y + itemAreas.sidewalk.height);
        message.anchor.set(0.5, 0);
        backgroundLayer.addChild(message);
    }
}

// Builds the static HUD elements like counters, buttons, etc.
function buildHud() {

    var hud = new Graphics(),
        message,
        i,
        launchButton,
        helpButton,
        resetButton,
    //Alias
        counter = itemAreas.bonusCounter,
        zombie = itemAreas.zombieCounter,
        fruitAmount;
        //pos = itemAreas.rightTree,
        //neg = itemAreas.leftTree;
    
    // Bonus counter
    hud.lineStyle(3);
    // hud.drawRect(counter.x, counter.y, counter.width, counter.height);
    message = new PIXI.Text("Bonus!");
    message.position.set(counter.x + counter.width/2, counter.y);
    message.anchor.x = 0.5;
    hud.addChild(message);
    // Zombie counter
    hud.drawRect(zombie.x, zombie.y, zombie.width, zombie.height);
    message = new PIXI.Text("Zombies Left");
    message.position.set(zombie.x + zombie.width/2, zombie.y);
    message.anchor.x = 0.5;
    hud.addChild(message);
    

    // ---Buttons---

    //launch button
    var launchFrame = [
        resources["launch_up"].texture,
        resources["launch_over"].texture,
        resources["launch_down"].texture
    ];

    launchButton = tink.button(launchFrame, renderWidth / 2.3, 250);
    hud.addChild(launchButton);

    //help button
    var helpFrame = [
        resources["help_up"].texture,
        resources["help_over"].texture,
        resources["help_down"].texture
    ];

    helpButton = tink.button(helpFrame, 0, zombie.height);
    helpButton.press = () => {
        // Only do buttons if we aren't dragging fruit
        if (dragParams.currentFruit === null) {
            infoStage.visible = true;
            gameStage.visible = false;
            gameStage.interactive = false;
            infoStage.interactive = true;
        }

    };
    //reset button
    var resetFrame = [
        resources["reset_up"].texture,
        resources['reset_over'].texture,
        resources["reset_down"].texture
    ];
    resetButton = tink.button(resetFrame, renderWidth / 1.9, 270);
    hud.addChild(resetButton);
    
    
    hud.addChild(helpButton);
    
    gameController.hud = hud;
    gameController.fruitAmount = fruitAmount;
    hudLayer.addChild(gameController.hud); 

}

//Random number helper function with inclusive bounds
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildInfoScreen() {
    var title = new PIXI.Text("Project Zorn",
                              {font: "48px sans-serif", fill: "black"});
    infoStage.addChild(title);
    title.position.x = 25;
    var information = new PIXI.Text("Thanks for trying out our cool game!\n\n"
                                    + "The zombie apocalypse has happened! You are the lone survivor of your town, trying to hold out for rescue.\n"
                                    +"Using your fruit, target and destroy incoming zombies - get a direct hit and earn "
                                    +"some butter - or maybe even the \nlegendary power of the sun!",
                                    {font: "24px sans-serif", fill: "black"});
    infoStage.addChild(information);
    information.position.y = 100;
    information.position.x = 25;
    
    // Back button
    // Generic button stuff
    var genericButtonFrames = [
        resources.buttonUp.texture,
        resources.buttonOver.texture,
        resources.buttonDown.texture
    ];
    var backPosition = {
        x: 25,
        y: renderHeight - 100
    };
    
    var backButton = tink.button(genericButtonFrames, backPosition.x, backPosition.y);
    var backMessage = new PIXI.Text("Back");
    backMessage.position.x = backPosition.x;
    backMessage.position.y = backPosition.y;
    backMessage.anchor.x = -0.6;
    backMessage.anchor.y = -0.6;
    infoStage.addChild(backButton);
    infoStage.addChild(backMessage);
    backButton.press = () => {
        infoStage.visible = false;
        gameStage.visible = true;
        gameStage.interactive = true;
        infoStage.interactive = false;
    }
}

function buildGameOverScreen() {
    var title = new PIXI.Text("Game Over",
        {font: "48px sans-serif", fill: "black"});
    gameOverStage.addChild(title);
    title.position.x = 25;
    var information = new PIXI.Text("Sorry, Captain Corn was defeated by the zombies.",
        {font: "24px sans-serif", fill: "black"});
    gameOverStage.addChild(information);
    information.position.y = 100;
    information.position.x = 25;

    var genericButtonFrames = [
        resources.play_again_up.texture,
        resources.play_again_over.texture,
        resources.play_again_down.texture
    ];
    var playAgainPosition = {
        x: 25,
        y: renderHeight - 100
    };

    var backButton = tink.button(genericButtonFrames, playAgainPosition.x, playAgainPosition.y);

    gameOverStage.addChild(backButton);

}

function buildStaticGraphics() {
    
}

function buildMainMenu() {
    
}

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
        // console.log(currentTicks);
    };
    
    this.addCloud = function() {
        var cloud = new Cloud();
        cloud.init(clouds.length);
        clouds[clouds.length] = cloud;
    }
    
    /**
    this.removeCloudAt = function (index) {
        clouds.splice(index, 1);
    }; **/
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
        // TODO: Fix this so that we don't have a massive array memory leak
        // gameController.clouds.removeCloudAt(index);
    };
}