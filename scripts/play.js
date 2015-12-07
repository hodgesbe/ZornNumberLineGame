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
    "leftBasket": {"x": 450, "y": 315, "width": 151, "height": 126},
    "rightBasket": {"x": 695, "y": 315, "width": 151, "height": 126},
    "sidewalk": {"x": 0, "y": 625, "width": 1024, "height": 32},
    "sun": {"x": renderWidth -150, "y": 30, "width": 50, "height": 50},
    "zombieCounter": {"x": 0, "y": 0, "width": renderWidth / 4, "height": 100},
    "bonusCounter": {"x": renderWidth / 2 - 150, "y": 0, "width": 300, "height": 100}
};

//arrays of fruit objects for positive values and negative values
var posFruitBin = [],
    negFruitBin = [];

// Draggable fruit handler variables and functions
var dragParams;

function dragParamsInit (){
    dragParams = {
        previousPos: {x: 0, y: 0},
        currentFruit: null,
        overBasket: function (fruitSprite) {
            if ((fruitSprite.position.x < itemAreas.leftBasket.x + itemAreas.leftBasket.width && fruitSprite.position.x > itemAreas.leftBasket.x
                && fruitSprite.position.y < itemAreas.leftBasket.y + itemAreas.leftBasket.height && fruitSprite.position.y > itemAreas.leftBasket.y)
                ) {
                    return 'left';
                }
                else if((fruitSprite.position.x < itemAreas.rightBasket.x + itemAreas.rightBasket.width && fruitSprite.position.x > itemAreas.rightBasket.x
                    && fruitSprite.position.y < itemAreas.rightBasket.y + itemAreas.rightBasket.height && fruitSprite.position.y > itemAreas.rightBasket.y)){
                        return 'right';
                    }
                else{
                    return null;
                }
        },
        leftBasket: null,
        rightBasket: null
    };
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
    Sprite = PIXI.Sprite,
    Container = PIXI.Container;

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
    this.leftBasket = "";
    this.rightBasket = "";
    this.rocks = "";


    fruitAmount: 0;
    this.currentFruitValue = 0;
    this.currentFruitBin = [];
    dragParamsInit();
    //Alias
    var game = this.game;

    this.init = function () {

        console.log("Initializing game controller and PIXI window.");

        htmlWindow = document.getElementById("renderWindow");
        renderer = PIXI.autoDetectRenderer(renderWidth, renderHeight);
        stage = new Container();
        gameStage = new Container();
        infoStage = new Container();
        gameOverStage = new Container();
        mainMenu = new Container();

        backgroundLayer = new Container();
        cloudLayer = new Container();
        hudLayer = new Container();
        dynamicLayer = new Container();
        topLayer = new Container();

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
        .add("basket", "assets/artwork/Basket.png")
        .add("Rock","assets/artwork/Rock.png")
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

        this.leftBasket = new Sprite(gameAssets.basket.texture);
        this.leftBasket.position.x = itemAreas.leftBasket.x;
        this.leftBasket.position.y = itemAreas.leftBasket.y;
        this.rightBasket = new Sprite(gameAssets.basket.texture);
        this.rightBasket.position.x = itemAreas.rightBasket.x;
        this.rightBasket.position.y = itemAreas.rightBasket.y;
        gameStage.addChild(this.leftBasket);
        gameStage.addChild(this.rightBasket);

        // Build the clouds
        this.clouds = new Clouds();

        // add dynamic stage
        // build the rock handler
        this.rocks = new RockHandler();
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

    /**
    Function to perform necessary steps when player has clicked lauch button:
    1. Use currentFruitValue to determine how far rock will fly
    2. Determine if zombie exists at point of rock landing
        2a. If so, damage zombie, increase necessary bonuses, determine if last zombie in level
            2aI. If so, build new level
    3. Remove Fruit from board
    4. If bonuses used, decrement bonus used
        4a. Else, move zombies
    5. Reset currentFruitValue
    */
    this.launch = function (){
        console.log("Nuclear launch detected.");
        //Determine flight of rock
        this.game.numberLine.printPoints();
        this.rocks.addRocks(this.game.numberLine.getPoint(this.currentFruitValue));

    };
    
    this.finishLaunch = function() {
        //Determine if zombie exists at target location
        //Remove Fruit from board
        console.log(this.currentFruitValue);
        console.log(gameController.currentFruitBin);
        dynamicLayer.removeChild(gameController.currentFruitBin[0]);
        dynamicLayer.removeChild(gameController.currentFruitBin[1]);
        dragParamsInit();
        gameController.currentFruitBin = [];
        //Check for bonuses used and if not, move zomibes
        this.currentFruitValue = 0;
    };
}

// This is our animation/game loop.
function render() {
    requestAnimationFrame(render); // This line ensures that render is called each frame, not just once.
    tink.update();
    gameController.clouds.Move();
    gameController.rocks.Move();
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
        //this.hero.init();
        this.bonus.init();
        this.buildLevel ();
    };

    // Stuff that should happen every level
    this.buildLevel = function () {

        this.numberLine = new NumberLine();
        this.numberLine.init();
        this.numberLine.printPoints(); //prints value of each point in console log
        this.fruitBin.init();
        this.hero.init();
        //  Zombie Stuff
        //this.zombieController = new ZombieController();
        //this.zombieController.generateZombies();

        console.log("Level " + " created.");
    };

    this.getBonusController = function () {
        return this.bonus;
    };

    this.getNumberLine = function () {
        return this.numberLine;
    };
}