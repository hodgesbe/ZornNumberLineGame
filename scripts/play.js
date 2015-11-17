// Game Logic for Project ZORN
// Collaborators: Brett, Ben, Jason, Nicholas

// It's okay to have "use strict" outside of a function so tell JSLint that
/*jslint node: true, white: true */
'use strict';

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
var renderer;               // Will create either a Canvas or WebGL renderer depending on the user's computer
var renderWidth = 1024;
var renderHeight = 720;
var gameAssets;             // Contains references to our game's loaded assets
var level;                  // Current level of game

//  Graphic Items coordinates as JSON array object.
var itemAreas;
itemAreas = {
    "background": {"_x": 0, "_y": 0, "width": 1024, "height": 768},
    "tree1": {"_x": 70, "_y": 330, "width": 200, "height": 160},
    "tree2": {"_x": 770, "_y": 330, "width": 200, "height": 160},
    "basket1": {"_x": 380, "_y": 360, "width": 80, "height": 80},
    "basket2": {"_x": 600, "_y": 360, "width": 80, "height": 80},
    "sidewalk": {"_x": 0, "_y": 642, "width": 1024, "height": 30},
    "sun": {"_x": renderWidth -150, "_y": 30, "width": 50, "height": 50},
    "zombieCounter": {"x": 0, "y": 0, "width": renderWidth / 4, "height": 100},
    "bonusCounter": {"x": renderWidth / 2 - 150, "y": 0, "width": 300, "height": 100}
};

var numLineParams = {
    offset: 15,
    startX: 15,
    endX: renderWidth-15,
    Y: itemAreas.sidewalk._y
};

// Easy names for long PIXI strings
var resources = PIXI.loader.resources;
var loadTexture = PIXI.utils.TextureCache;
var graphics = PIXI.graphics;

// Our game chain starts by constructing a game controller
var gameController = new GameController();
gameController.init();


// ---------------------------------
// Controller
// ---------------------------------
// GameController will link the logic and the graphics of the game together
function GameController() {

    this.hud = new PIXI.Graphics();
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
        
        renderer.backgroundColor = 0x33CCFF; 
        htmlWindow.appendChild(renderer.view);
        
        // Load in assets
        PIXI.loader
        .add("staticBG", "assets/artwork/staticBG.png")
        .add("image_sun", "assets/artwork/sun.png")
        .add("iZombie", "assets/artwork/zombie8.png")
        .load(function (loader, resources) {
            gameAssets = resources;
            gameController.onAssetsLoaded();
        });
    };
    
    // We have to wait for the assets to finish loading before we can start anything else
    // They load asynchronously, so this is called in the PIXI.loader itself.
    this.onAssetsLoaded = function () {
        console.log("Assets have been loaded");
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
        this.staticBG = new PIXI.Sprite(gameAssets.staticBG.texture);
        //this.staticBG.position.x = itemAreas.areas['item.background']._x;
        //this.staticBG.position.y = itemAreas.areas['item.background']._y;
        this.staticBG.position.x = itemAreas.background._x;
        this.staticBG.position.y = itemAreas.background._y;
        stage.addChild(this.staticBG);

        this.sun = new PIXI.Sprite(gameAssets.image_sun.texture);
        this.sun.position.x = itemAreas.sun._x;
        this.sun.position.y = itemAreas.sun._y;
        stage.addChild(this.sun);
        
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

// This is our animation loop.
function render() {
    requestAnimationFrame(render); // This line ensures that render is called each frame, not just once.
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
        console.log("Printing points. Length = " + this.length);
        for (i = 0; i < this.length; i += 1) {
            console.log(this.points[i].index);
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

//Creates a fruit object with a getter method
var Fruit = function Fruit (fruitValue){
    //Constructor
    this.fruitValue = fruitValue;
        
    //returns the value of this fruit
    this.getFruitValue = function (){
        return this.fruitValue;
    };
};

var FruitBin = function FruitBin(){
    this.fruitBin = []; //array of fruit objects
    
    var fruitValues, //array of fruit values for level
        fruitTarget, //target sum of all fruit values        
        fruitMin, //minimum number of all fruit needed for level
        possibleValues = [], //array of values for fruit
        i; //index for iteration
                         
    this.init = function (){
        console.log("Creating a fruit bin");
        fruitValues = [];
        switch (level) {
            case 0:            
                fruitTarget = 42;
                fruitMin = 30;
                possibleValues = [1,1,1,2,2,2,2,2,3,3,3,3,3,3,3,4,4,4,4,5];
                break;
        }
        //continue picking fruit until number is larger than minimum number of fruit for level
        while (fruitValues.length < fruitMin){
            //reset fruit sum and list of fruit values
            var fruitSum = 0,
                index,
                fruitValue; 
            fruitValues = [];             
            //pick fruit values up to Max value
            while (fruitSum < fruitTarget){
                index = Math.floor(Math.random()*possibleValues.length);
                fruitValue = possibleValues[index];
                //add positive and negative fruit values to fruit values
                fruitValues.push(fruitValue); 
                fruitValues.push(-fruitValue); 
                fruitSum += fruitValue;  
            }            
        }
        //add fruit objects using value array
        for (i=0; i<fruitValues.length; i++){
            this.fruitBin[i] = new Fruit (fruitValues[i]);
        }
    };
  
    
    this.getFruit = function (){
        return this.fruitBin;
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
    line = new PIXI.Graphics();
    line.lineStyle(4, 0x000000, 1);
    line.moveTo(numLineParams.startX, numLineParams.Y);
    line.lineTo(numLineParams.endX, numLineParams.Y);
    stage.addChild(line); **/
    
    // Next, each point and label
    for (i = 0; i < numberLine.length; i++) {
        console.log("Creating a point!");
        // Create a point
        dash = new PIXI.Graphics();
        dash.beginFill(0x000000);
        //console.log("x: " + numberLine.points[i].x + ", y: " + numberLine.points[i].y);
        dash.drawRect(numberLine.points[i].x, numberLine.points[i].y, dashWidth, itemAreas.sidewalk.height);
        dash.endFill();
        stage.addChild(dash);
        
        // Create a number
        // It should be placed beneath the bottom of the dash that has just been drawn
        message = new PIXI.Text(numberLine.points[i].value,
                               {font: "24px sans-serif", fill: "white"});
        message.position.set(numberLine.points[i].x, numberLine.points[i].y + itemAreas.sidewalk.height);
        message.anchor.set(0.5, 0);
        stage.addChild(message);
    }
}

// Builds the static HUD elements like counters, buttons, etc.
function buildHud() {
    var hud = new PIXI.Graphics(),
        message;
    hud.lineStyle(3);
    
    // Bonus counter
    hud.drawRect(itemAreas.bonusCounter.x, itemAreas.bonusCounter.y, itemAreas.bonusCounter.width, itemAreas.bonusCounter.height);
    message = new PIXI.Text("Bonus Counter");
    message.position.set(itemAreas.bonusCounter.x, itemAreas.bonusCounter.y);
    hud.addChild(message);
    // Zombie counter
    hud.drawRect(itemAreas.zombieCounter.x, itemAreas.zombieCounter.y, itemAreas.zombieCounter.width, itemAreas.zombieCounter.height);
    message = new PIXI.Text("Zombie Counter");
    message.position.set(itemAreas.zombieCounter.x, itemAreas.zombieCounter.y);
    hud.addChild(message);
    
    gameController.hud = hud;
    stage.addChild(gameController.hud); 
}
