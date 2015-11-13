// Game Logic for Project ZORN
// Collaborators: Brett, Ben, Jason, Nicholas

// It's okay to have "use strict" outside of a function so tell JSLint that
/*jslint node: true, white: true */
'use strict';

// We need to let JSLint know about PIXI definitions (to avoid PIXI was used before it was defined, etc)
/*global PIXI, requestAnimationFrame */

// -------------------------------------------------
// Full Scope Variables (not function-specific)
// The scene itself, and positioning of the objects in the scene
// -------------------------------------------------
var htmlWindow; // This will be the render window
var stage; // The container for PIXI.JS, also called "stage" by a lot of documentation
var renderer; // Will create either a Canvas or WebGL renderer depending on the user's computer
var renderWidth = 1280;
var renderHeight = 720;
var lineOffset = renderHeight - 100;
var lineWidth = renderWidth - 100;
var gameAssets;
var sunPosition = {x: renderWidth - 150,
                   y: 30};
var housePosition = {x: renderWidth / 2,
                     y: renderHeight / 2};
var numLineParams = {startX: 0,
                     startY: renderHeight - 100,
                     endX: renderWidth,
                     endY: renderHeight - 100};

// Variables to make our lives easier. Here we create naming convention variables for pixi objects, so that
// (1), we can type one word instead of 3-5 each time
// (2), if PIXI updates their workflow we can hopefully just modify the variables here and they will keep meaning the same thing
// in our program.
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
    
    // These variables do not refer to logic inside game, but rather the graphics objects themselves.
    this.zombies = [];
    this.house = "";
    this.sun = "";
    this.numberLine = "";
    this.game = new Game(this);
    
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
        .add("image_sun", "assets/artwork/sun.png")
        .add("iZombie", "assets/artwork/zombie8.png")
        .add("iHouse", "assets/artwork/house.png")
        .load(function (loader, resources) {
            gameAssets = resources;
            gameController.onAssetsLoaded();
        });
    };
    
    this.onAssetsLoaded = function () {
        console.log("Assets have been loaded");
        game.init();
    };
    
    this.onLevelLoaded = function () {
        console.log("Level logic has been loaded.");
        var i;
        
        // STATIC OBJECTS
        this.sun = new PIXI.Sprite(gameAssets.image_sun.texture);
        this.sun.position.x = sunPosition.x;
        this.sun.position.y = sunPosition.y;
        stage.addChild(this.sun);
        
        this.house = new PIXI.Sprite(gameAssets.iHouse.texture);
        this.house.position.x = housePosition.x;
        this.house.position.y = housePosition.y;
        this.house.anchor.set(0.5, 0.5); // We want the house centered
        stage.addChild(this.house);
        
        displayNumberLine(game.getNumberLine());
        
        console.log("Starting graphics built. Begin rendering!");
        render();
    };
}

function render() {
    // requestAnimationFrame(render);
    renderer.render(stage);
}

function Game(gc) {
    this.gameController = gc;
    this.bonus = new Bonus();
    this.hero = new Hero();
    this.numberLine = ""; // We want to initialize this again every new level
    this.directHits = 0;
    this.fruitBucket = "";
    
    this.init = function () {
        console.log("Game Logic object initializing.");
        this.hero.init();
        this.bonus.init();
        
        this.buildLevel (0);
    };
    
    this.buildLevel = function (level) {
        
        this.numberLine = new NumberLine(level);
        this.numberLine.init();
        this.numberLine.printPoints();
        this.fruitBucket = new FruitBucket(level);
        this.fruitBucket.init();
        
        this.gameController.onLevelLoaded(this.numberLine);
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


var zombieController = function (level) {
    var gameLevels = {"levels": [
        {"levelNum": 1, "levelName": "Level 1", "levelRange": 20, "zombieCount": 2},
        {"levelNum": 2, "levelName": "Level 2", "levelRange": 15, "zombieCount": 4},
        {"levelNum": 3, "levelName": "Level 3", "levelRange": 10, "zombieCount": 6}
        ]},
        i,
        zombies;
    this.level = level;
    this.range = range;
    this.count = count;
    this.zombieArray = {};

    for(i = 0; i < count; i++){
        this.zombieArray.push(zombie(i, 1, 1, 5, 10));
    }
    /**
     for (var zombies in this.count){
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


// A Point object knows its index as well as the x and y position on the screen to render
var Point = function Point(value, index, length) {
    this.value = value;
    this.index = index;
    this.x = index * (renderWidth / length);
    this.y = lineOffset;
};

var NumberLine = function NumberLine(level) {
    // Constructor
    this.level = level;
    this.points = [];
    this.start = 0;
    this.length = 0;
    

    
    this.init = function () {
        var i;
        // Set size based on level
        switch (this.level) {
        case 0:
            this.start = -5;
            this.length = 10;
            break;
        }
        
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

//Hero Object
function Hero() {

    var health;

    //Creates a new Hero object with full health
    this.init = function () {
        health = 100;
    };

    //default damage (decrements by 5)
    this.takeDamage = function () {
        health = health - 5;
    };

    //decreases hero health by amount passed to function as int
    this.takeDamage = function (amountToDecrease) {
        health = health-amountToDecrease;
    };

    //returns hero health
    this.returnHealth = function(){
        return health;
    };
}

//Creates Bonus Objects with getter and setter methods
function Bonus(){
    var sunValues,
        butterValues;

    //creates bonus object with empty sun and butter values
    this.init = function(){
        sunValues = 2;
        butterValues =0;
        console.log("Bonus init. Sun: " + sunValues + ", " + butterValues + ".");
    };

    //adds butter bonus value. Takes an int for added bonus
    this.addButterBonus = function(butterAdded){
      butterValues = butterAdded;
    };

    //adds sun bonus value. Takes an int for added bonus
    this.addSunBonus = function(sunAdded){
        sunValues = sunAdded;
    };

    //returns the amount of butter bonuses
    this.getButterBonus = function(){
      return butterValues;
    };

    //returns the amount of sun bonuses
    this.getSunBonus = function(){
        return sunValues;
    };

}

//Creates a fruit object with a getter method
var Fruit = function Fruit (fruitValue){
    //Constructor
    this.fruitValue = fruitValue;
        
    //returns the value of this fruit
    this.getFruitValue = function (){
        return fruitValue;
    };
};

var FruitBucket = function FruitBucket(level){
    this.level = level;
    this.fruit = []; //array of fruit objects
    
    var fruitValues, //array of fruit values for level
        fruitTarget, //target sum of all fruit values        
        fruitMin, //minimum number of all fruit needed for level
        possibleValues = []; //array of values for fruit
         
        
        
    this.init = function (){
        console.log("Creating a fruit bucket");
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
            console.log(possibleValues.length);
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
        var i;
        for (i=0; i<fruitValues.length; i++){
            this.fruit[i] = new Fruit (fruitValues[i]);
        }
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
        label,
        message;
    
    var numberLine = gameController.game.numberLine;
    
    
    // First, the line
    line = new PIXI.Graphics();
    line.lineStyle(4, 0x000000, 1);
    line.moveTo(numLineParams.startX, numLineParams.startY);
    line.lineTo(numLineParams.endX, numLineParams.endY);
    stage.addChild(line);
    
    // Next, each point and label
    for (i = 0; i < numberLine.length; i++) {
        console.log("Creating a point!");
        // Create a point
        dash = new PIXI.Graphics();
        dash.beginFill(0x000000);
        console.log("x: " + numberLine.points[i].x + ", y: " + numberLine.points[i].y);
        dash.drawRect(numberLine.points[i].x, numberLine.points[i].y, 25, 25);
        dash.endFill();
        stage.addChild(dash);
        
        // Create a number
        console.log(numberLine.points[i].value);
        message = new PIXI.Text(numberLine.points[i].value,
                               {font: "32px sans-serif", fill: "white"});
        message.position.set(numberLine.points[i].x, numberLine.points[i].y);
        stage.addChild(message);
    }
}


// *****************************************************************
// --------------------------NUMBER LINE STUFF----------------------
// *****************************************************************
/**
// A NumberLine object contains an array of integers starting at number "start" and continuing
// on for "length" distance
// This may not be the best implementation ie we might want each point to have a PIXIJS number corresponding to its actual number, for instance...but for now it works
// We might want a Point data structure to contain a pixi text and int value?
var NumberLine = function NumberLine(start, length) {
    var end;
    var points = {};
    this.length = length;
    this.start = start;
    end = start + length;
    
    // Create an array of points to size length, with the value from start to end
    var i;
    for (i = 0; i < length; i += 1) {
        points[i] = i + start;
    }
    
    this.getPoints = function () {
        return points;
    };
};

// Build number line will handle the scaling of the number line based on a levelScalar variable (tutorial, advanced tutorial,
// full game). For now, it just builds a debug number line
var buildNumberLine = function (levelScalar) {
    var numberLine = new NumberLine(0, 10); // Build the number line (scalar does nothing at the moment)
    var lineHeight = renderHeight - 100; // How high to render the number line above the bottom of the window
    var numberHeight = renderHeight - 80; // How high to render the numbers in the number line above the bottom of the window

    // ** Draw a line from one side of the view to the other **
    // set the line style to have a width of 3 and set the color to black
    console.log(renderHeight);
    graphics.lineStyle(3, 0x000000);
    graphics.drawRect(0, lineHeight, renderWidth, 1);
    
    // ** Draw "dots" at each number point, and scale it accordingly based on how many points there are
    var distance = (renderWidth) / numberLine.length;
    var numberLabel;
    
    var i;
    for (i = 0; i < numberLine.length; i += 1) {
        // Build the sidewalk graphics
        graphics.drawRect(distance * i, lineHeight, 10, 10);
        
        // Build the numbers
        numberLabel = new PIXI.Text(numberLine.getPoints()[i]); // Create a label showing the value of this point's number
        numberLabel.position.x = distance * i;
        numberLabel.position.y = numberHeight;
        scene.addChild(numberLabel);
    }
};

// *****************************************************************
// -----------------------BONUS ITEM STUFF--------------------------
// *****************************************************************
// BonusHandler handles the display and use of bonus objects. It should be declared
// and then have its init() function run to generate the fields and on-screen labels
var BonusHandler = function BonusHandler() {
    var BUTTER_BONUS; // How much butter I got, yo
    var butterT; // Onscreen butter label
    var butterPosX = renderWidth - 300;
    var butterPosY = 0;
    var SUN_BONUS; // The sun, it burns
    var sunT; // Onscreen sun label
    var sunPosX = renderWidth - 300;
    var sunPosY = 40;
    
    // Strings to build text for labels
    var butterS = "Butter Bonus: ";
    var sunS = "Sun Bonus: ";
    
    // "Constructor" for this object, builds the graphics based on how much starting bonus we got
    this.init = function (startingButter, startingSun) {
        BUTTER_BONUS = startingButter;
        SUN_BONUS = startingSun;
    
        butterT = new PIXI.Text(butterS + BUTTER_BONUS);
        butterT.position.x = butterPosX;
        butterT.position.y = butterPosY;
        scene.addChild(butterT);
        sunT = new PIXI.Text(sunS + SUN_BONUS);
        sunT.position.x = sunPosX;
        sunT.position.y = sunPosY;
        scene.addChild(sunT);
    };
    
    // Use some butter
    this.useButterBonus = function () {
        // Visual stuff - decrement value shown
        BUTTER_BONUS -= 1;
        butterT.setText(butterS + BUTTER_BONUS);
    };

    // I don't want to set the world on fire
    this.useSunBonus = function () {
        // Visual stuff - decrement value shown
        SUN_BONUS -= 1;
        sunT.setText(sunS + SUN_BONUS);
    };
    
    this.awardButter = function (amount) {
        BUTTER_BONUS += amount;
        butterT.setText(butterS + BUTTER_BONUS);
    };
    
    this.awardSun = function (amount) {
        SUN_BONUS += amount;
        sunT.setText(sunS + SUN_BONUS);
    };
};

**/
