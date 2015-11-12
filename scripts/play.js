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

// Variables to make our lives easier. Here we create naming convention variables for pixi objects, so that
// (1), we can type one word instead of 3-5 each time
// (2), if PIXI updates their workflow we can hopefully just modify the variables here and they will keep meaning the same thing
// in our program.
var resources = PIXI.loader.resources;
var loadTexture = PIXI.utils.TextureCache;


function loadGameAssets() {
    PIXI.loader
    .add("image_sun", "assets/artwork/sun.png")
    .add("image_zombie", '/assets/artwork/zombie8.png')
    .load(console.log("Loaded"));
}


// Our game chain starts by constructing a game controller
var gameController = new GameController();
gameController.init();

// ---------------------------------
// Controller
// ---------------------------------
// GameController will link the logic and the graphics of the game together
function GameController() {
    
    // Private vars
    var graphics = new PIXI.Graphics(),
        game = new Game(this),
        sunSprites = [];
    
    this.init = function () {

        htmlWindow = document.getElementById("renderWindow");
        renderer = PIXI.autoDetectRenderer(renderWidth, renderHeight);
        stage = new PIXI.Container();
        
        // renderer.backgroundColor = 0x33CCFF; 
        htmlWindow.appendChild(renderer.view);
        
        // Load in assets
        loadGameAssets();
        
        // Start the logic model
        game.init();
    };
    
    this.buildLevel = function () {
        var suns = game.getBonusController().getSunBonus(),
            texture,
            sprite,
            i;
        for (i = 0; i < suns; i++) {
            console.log("Adding a sun");
            // console.log(gameAssets.getSunSprite());
            // sunSprites[i] = new PIXI.Sprite.fromImage(resources.image_sun);
            /**
            sunSprites[i].position.x = 200;
            sunSprites[i].position.y = 200;
            sunSprites[i].width = 200;
            sunSprites[i].height = 200; 
            stage.addChild(sunSprites[i]); **/
            console.log(resources.image_zombie);
            console.log(resources.image_zombie.url);
            
            // var texture = PIXI.Texture.fromImage(resources.image_zombie.texture);
            texture = loadTexture["image_zombie"];
            sprite = new PIXI.Sprite(texture);
            console.log(texture);
            stage.addChild(sprite);
        }
        
        /**
        for (i = 0; i < suns; i++) {
            console.log(sunSprites[i]);
        } **/
        
        this.startLevel();
    };
    
    this.startLevel = function () {
        render();
    };
    // Other items have to be redrawn when an event happens
    // An event will always start in the view, so it should call functions here which call functions in the Game, and then
    // query the Game object to figure out how to change how the game looks
}


// Render should continuously render the scene
function render() {
    // requestAnimationFrame(render);
    renderer.render(stage);
}

function Game(gc) {
    this.gameController = gc;
    
    var game = this,
        directHits,
        hero,
        bonus;
    
    this.init = function () {
        hero = new Hero();
        hero.init();
        bonus = new Bonus();
        bonus.init();
        
        this.buildLevel (0);
    };
    
    this.buildLevel = function (level) {
        
        
        gc.buildLevel();
    };
    
    this.getBonusController = function () {
        return bonus;
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

};


var zombieController = function (level) {
    var gameLevels = {"levels": [
        {"levelNum": 1, "levelName": "Level 1", "levelRange": 20, "zombieCount": 2},
        {"levelNum": 2, "levelName": "Level 2", "levelRange": 15, "zombieCount": 4},
        {"levelNum": 3, "levelName": "Level 3", "levelRange": 10, "zombieCount": 6}
    ]};
    this.level = level;
    this.range = range;
    this.count = count;
    this.zombieArray = {};
    /**
    for (var zombies in this.count){
        // this.zombieArray.push(zombie(zombies, ));
    } **/
};

// --------------------------------
// Logic scripts / classes
// --------------------------------


// A Point object knows its index as well as the x and y position on the screen to render
var Point = function Point(index, length) {
    this.index = index;
    this.x = lineWidth / length * index + lineWidth / 2;
    this.y = renderHeight - lineOffset;
};

var NumberLine = function NumberLine(level) {
    // Constructor
    this.level = level;
    
    var points,
        start,
        length;
    
    this.init = function () {
        // Set size based on level
        switch (level) {
        case 0:
            this.start = -5;
            this.length = 10;
            break;
        }
        
        // Build points
        var i;
        for (i = 0; i < length; i += 1) {
            points[i] = new Point(i, length);
        }
    };
    
    this.printPoints = function () {
        var i;
        for (i = 0; i < length; i += 1) {
            console.log(points[i].index);
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
    
    var fruitValues, //array of fruit values for level
        fruitTarget, //target sum of all fruit values        
        fruitMin, //minimum number of all fruit needed for level
        possibleValues, //array of values for fruit
        fruit; //array of fruit objects
        
        
    this.init = function (){
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
                index = Math.floor(Math.random*this.fruitValues.length);
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
            fruit[i] = new Fruit (fruitValues[i]);
        }
    };
};




// --------------------------------
// View scripts
// --------------------------------

function displayNumberLine(numberline) {

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
