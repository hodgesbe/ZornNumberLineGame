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
var stage;                  // The container for PIXI.JS, also called "stage" by a lot of documentation
var gameStage;              // The container for all game sprites, a child of stage
var infoStage;              // Container for our information screen
var renderer;               // Will create either a Canvas or WebGL renderer depending on the user's computer
var renderWidth = 1024;
var renderHeight = 720;
var gameAssets;             // Contains references to our game's loaded assets
var level;                  // Current level of game
var tink;                   // Handler to access the Tink library of functions. See: https://github.com/kittykatattack/tink

//  Graphic Items coordinates as JSON array object.
var itemAreas;
itemAreas = {
    "background": {"x": 0, "y": 0, "width": 1024, "height": 768},
    "tree1": {"x": 70, "y": 350, "width": 200, "height": 160},
    "tree2": {"x": 770, "y": 350, "width": 200, "height": 160},
    "basket1": {"x": 380, "y": 360, "width": 80, "height": 80},
    "basket2": {"x": 600, "y": 360, "width": 80, "height": 80},
    "sidewalk": {"x": 0, "y": 642, "width": 1024, "height": 30},
    "sun": {"x": renderWidth -150, "y": 30, "width": 50, "height": 50},
    "zombieCounter": {"x": 0, "y": 0, "width": renderWidth / 4, "height": 100},
    "bonusCounter": {"x": renderWidth / 2 - 150, "y": 0, "width": 300, "height": 100}
};

//arrays of fruit objects for positive values and negative values
var posFruitBin = [], 
    negFruitBin = [];

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
    // These variables do not refer to logic inside game, but rather the graphics objects themselves.
    this.zombies = [];
    this.sun = "";
    this.numberLine = "";
    this.game = new Game(this);
    
    //Alias
    var game = this.game;
    
    this.init = function () {
        
        console.log("Initializing game controller and PIXI window.");

        htmlWindow = document.getElementById("renderWindow");
        renderer = PIXI.autoDetectRenderer(renderWidth, renderHeight);
        stage = new PIXI.Container();
        gameStage = new PIXI.Container();
        infoStage = new PIXI.Container();
        
        // Child all screens to the main stage
        stage.addChild(gameStage);
        stage.addChild(infoStage);
        
        renderer.backgroundColor = 0x33CCFF; 
        htmlWindow.appendChild(renderer.view);
        
        // Load in assets
        PIXI.loader
        .add("staticBG", "assets/artwork/staticBG.png")
        .add("image_sun", "assets/artwork/sun.png")
        .add("iZombie", "assets/artwork/zombie8.png")
        .add("infoButton", "assets/ui/Info.png")
        .add("apple", "assets/artwork/apple.png")
        .load(function (loader, resources) {
            gameAssets = resources;
            gameController.onAssetsLoaded();
        });
        console.log(resources);
    };
    
    // We have to wait for the assets to finish loading before we can start anything else
    // They load asynchronously, so this is called in the PIXI.loader itself.
    this.onAssetsLoaded = function () {
        console.log("Assets have been loaded");
    
        tink = new Tink(PIXI, renderer.view);

        game.init();
        this.buildGameWindow();
        this.buildLevelGraphics();
    };
    
    // Graphics that stay the same throughout levels should be put here.
    this.buildGameWindow = function () {
        console.log("2 - Level logic has been loaded.");
        var i;
        
        // STATIC OBJECTS

//  THERE'S GOT TO BE A BETTER WAY TO ADDRESS THE json OBJECT, BUT I'M AT A LOSS FOR NOW, WILL REVISIT
        /*itemAreas = {
            "areas": [
                {"item": "background", "_x": 0, "_y": 0, "width": 1024, "height": 768},*/
        this.staticBG = new Sprite(gameAssets.staticBG.texture);
        //this.staticBG.position.x = itemAreas.areas['item.background']._x;
        //this.staticBG.position.y = itemAreas.areas['item.background']._y;
        this.staticBG.position.x = itemAreas.background.x;
        this.staticBG.position.y = itemAreas.background.y;
        gameStage.addChild(this.staticBG);

        this.sun = new Sprite(gameAssets.image_sun.texture);
        this.sun.position.x = itemAreas.sun.x;
        this.sun.position.y = itemAreas.sun.y;
        gameStage.addChild(this.sun);
        
        // Build the HUD
        buildHud();

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
    renderer.render(stage);
}

function Game(gc) {
    this.gameController = gc;
    this.bonus = new Bonus();
    this.hero = new Hero();
    this.numberLine = ""; // We want to initialize this again every new level
    this.directHits = 0;
    this.fruitBucket = "";
    
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
        this.fruitBin = new FruitBin();
        this.fruitBin.init();
        
        // this.gameController.onLevelLoaded(this.numberLine);
        console.log("(1) - level created.");
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
var zombie = function (id, speed, health, indexOfTarget, indexOfStart) {
    this.id = id;
    this.speed = speed;
    this.health = health;
    this.target = indexOfTarget;
    this.location = indexOfStart;

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


var zombieController = function () {
    var gameLevels = {"levels": [
        {"levelNum": 1, "levelName": "Level 1", "levelRange": 20, "zombieCount": 2},
        {"levelNum": 2, "levelName": "Level 2", "levelRange": 15, "zombieCount": 4},
        {"levelNum": 3, "levelName": "Level 3", "levelRange": 10, "zombieCount": 6}
        ]},
        i,
        zombies;
    this.range = range;
    this.count = count;
    this.zombieArray = {};

    for(i = 0; i < count; i++){
        this.zombieArray.push(zombie(i, 1, 1, 5, 10));
    }
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
        console.log(level);
        var i;
        // Set size based on level
        switch (level) {
        case 0:
                console.log("Numberline case 0");
            this.start = -10;
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
    this.init = function () {
        this.health = 100;
        console.log("Current Hero health: " + this.health);
    };

    //default damage (decrements by 5)
    this.takeDamage = function () {
        this.health = this.health - 5;
        console.log("Current Hero health: " + this.health);
    };

    //decreases hero health by amount passed to function as int
    this.takeDamage = function (amountToDecrease) {
        this.health = this.health - amountToDecrease;
        console.log("Current Hero health: " + this.health);
    };

    //returns hero health
    this.returnHealth = function(){
        return this.health;
    };
}

//Creates Bonus Objects with getter and setter methods
function Bonus(){

    //creates bonus object with empty sun and butter values
    this.init = function(){
        this.sunValues = 2;
        this.butterValues =0;
        console.log("Bonus init. Sun: " + this.sunValues + ", Butter:" + this.butterValues + ".");
    };

    //adds butter bonus value. Takes an int for added bonus
    this.addButterBonus = function(butterAdded){
      this.butterValues = butterAdded;
    };

    //adds sun bonus value. Takes an int for added bonus
    this.addSunBonus = function(sunAdded){
        this.sunValues = sunAdded;
    };

    //returns the amount of butter bonuses
    this.getButterBonus = function(){
      return this.butterValues;
    };

    //returns the amount of sun bonuses
    this.getSunBonus = function(){
        return this.sunValues;
    };

}

//Creates a fruit object which contains the graphic
var Fruit = function Fruit (fruitValue){
    //Constructor
    this.fruitValue = fruitValue; //value to be displayed on fruit
    this.fruitGraphic = new Graphics(); //Graphic that contains both fruit sprite and value message
    this.fruitSprite = new Sprite(resources.apple.texture); //actual sprite
    var message = new PIXI.Text("" + this.fruitValue); //message which displays value
    
    //---Function to update sprites location and adjust message location as well
    this.addLoc = function (X, Y){
        //adjust sprite to be correct size and location
        this.fruitSprite.position.set(X,Y);
        this.fruitSprite.scale.set(0.07, 0.07);
        this.fruitSprite.anchor.set(0.5, 0.5);
        //overlay message on sprite
        message.anchor.set(0.5, 0.5);
        message.position.set(X,Y+4);
        //add sprite and message to graphic
        this.fruitGraphic.addChild(this.fruitSprite);
        this.fruitGraphic.addChild(message);
    }
};

var FruitBin = function FruitBin(){
    
    var fruitTarget, //target sum of all fruit values        
        fruitMin, //minimum number of all fruit needed for level
        possibleValues = [], //array of values for fruit
        i; //index for iteration
    this.posLocation = [];
    this.negLocation = [];
        
    //---Function to create 2d array of coordinates to display fruit based off tree1 and tree2item areas
    this.setLocation = function (){
        //Alias
        var pos = itemAreas.tree2,
            neg = itemAreas.tree1,
            row,
            col;
        console.log("Setting location:");
        for (row = 19; row < pos.width; row += 38){
            for (col = 21; col < pos.height; col += 41){
                this.posLocation.push([pos.x+row,pos.y+col]);
                this.negLocation.push([neg.x+row,neg.y+col]);
            }
        }
    }
    
    //---Function to set sprite locations for each fruit
    this.addFruit = function (){
        
        var i,
            index,
            coords = [];
        
        this.setLocation(); //fill pos and neg arrays with possible values
        //randomly select a location for each fruit from posible location
        for (i = 0; i < posFruitBin.length; i++){
            //randomly select positve location
            index = randomInt(0,this.posLocation.length-1);
            coords = this.posLocation.splice(index, 1);
            posFruitBin[i].addLoc(coords[0][0],coords[0][1]);
            
            //randomly select negative location
            index = randomInt(0,this.negLocation.length-1);
            coords = this.negLocation.splice(index, 1);
            negFruitBin[i].addLoc(coords[0][0],coords[0][1]);
            
            //add graphics to gameStage container      -----------------------------------NOT WORKING HERE-----------------------
            gameStage.addChild(posFruitBin[i].fruitGraphic);
            gameStage.addChild(negFruitBin[i].fruitGraphic);
        }
    }
    
    //---Randomly select fruit values, create fruit with those values
    this.init = function (){
        console.log("Creating a fruit bin");
        var posFruitValues = [],
            negFruitValues = [];
        
        switch (level) {
            case 0:            
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
    console.log("Displaying the numberline.");
    var i,
        line,
        dash,
        dashWidth = 3,
        label,
        message,
        numberLine = gameController.game.numberLine;
    
    
    // First, the line
    // No longer needed since we have a lovely sidewalk now!
    /**
    line = new Graphics();
    line.lineStyle(4, 0x000000, 1);
    line.moveTo(numLineParams.startX, numLineParams.Y);
    line.lineTo(numLineParams.endX, numLineParams.Y);
    stage.addChild(line); **/
    
    // Next, each point and label
    for (i = 0; i < numberLine.length; i++) {
        console.log("Creating a point!");
        // Create a point
        dash = new Graphics();
        dash.beginFill(0x000000);
        //console.log("x: " + numberLine.points[i].x + ", y: " + numberLine.points[i].y);
        dash.drawRect(numberLine.points[i].x, numberLine.points[i].y, dashWidth, itemAreas.sidewalk.height);
        dash.endFill();
        gameStage.addChild(dash);
        
        // Create a number
        // It should be placed beneath the bottom of the dash that has just been drawn
        message = new PIXI.Text(numberLine.points[i].value,
                               {font: "24px sans-serif", fill: "white"});
        message.position.set(numberLine.points[i].x, numberLine.points[i].y + itemAreas.sidewalk.height);
        message.anchor.set(0.5, 0);
        gameStage.addChild(message);
    }
}

// Builds the static HUD elements like counters, buttons, etc.
function buildHud() {

    var hud = new Graphics(),
        message,
        infoButton,
        i,
    //Alias
        counter = itemAreas.bonusCounter,
        zombie = itemAreas.zombieCounter;
        //pos = itemAreas.tree2,
        //neg = itemAreas.tree1;
    
    // Bonus counter
    hud.lineStyle(3);
    hud.drawRect(counter.x, counter.y, counter.width, counter.height);
    message = new PIXI.Text("Bonus Counter");
    message.position.set(counter.x + counter.width/2, counter.y);
    message.anchor.x = 0.5;
    hud.addChild(message);
    // Zombie counter
    hud.drawRect(zombie.x, zombie.y, zombie.width, zombie.height);
    message = new PIXI.Text("Zombie Counter");
    message.position.set(zombie.x + zombie.width/2, zombie.y);
    message.anchor.x = 0.5;
    hud.addChild(message);
    
    infoButton = new Sprite(resources.infoButton.texture);
    infoButton.position.y = zombie.height;
    infoButton.width = 32;
    infoButton.height = 32;
    hud.addChild(infoButton);
 
    for (i = 0; i < posFruitBin.length; i++){            
        //add graphics to gameStage container      
        hud.addChild(posFruitBin[i].fruitGraphic);
        hud.addChild(negFruitBin[i].fruitGraphic);
    }
    
    gameController.hud = hud;
    gameStage.addChild(gameController.hud); 

}

//Random number helper function with inclusive bounds
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}