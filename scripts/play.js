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
    },
    maxFruit: 2,
    fruitsInBasket: []
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
    this.basket1 = "";
    this.basket2 = "";
    
    
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
        .add("basket", "assets/artwork/Basket.png")
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
        
        this.basket1 = new Sprite(gameAssets.basket.texture);
        this.basket1.position.x = itemAreas.basket1.x;
        this.basket1.position.y = itemAreas.basket1.y;
        this.basket2 = new Sprite(gameAssets.basket.texture);
        this.basket2.position.x = itemAreas.basket2.x;
        this.basket2.position.y = itemAreas.basket2.y;
        gameStage.addChild(this.basket1);
        gameStage.addChild(this.basket2);
    
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
    // hud.drawRect(zombie.x, zombie.y, zombie.width, zombie.height);
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
    launchButton.press = () => {
        if (dragParams.currentFruit === null) {
            
        }
    };
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
    resetButton.press = () => {
        var i;
        // Only do buttons if we aren't dragging fruit
        if (dragParams.currentFruit === null) {
        for (i = 0; i < dragParams.fruitsInBasket.length; i++) {
            console.log("Trying to reset fruit");
            console.log(dragParams.fruitsInBasket[i].fruitSprite.position.x)
            dragParams.fruitsInBasket[i].fruitSprite.position.x = dragParams.fruitsInBasket[i].previousPos.x;
            dragParams.fruitsInBasket[i].fruitSprite.position.y = dragParams.fruitsInBasket[i].previousPos.y;
            dragParams.fruitsInBasket[i].fruitSprite.draggable = true;
        }
        dragParams.fruitsInBasket = [];
        }
    };
    hud.addChild(resetButton);
    
    
    hud.addChild(helpButton);
    
    gameController.hud = hud;
    gameController.fruitAmount = fruitAmount;
    hudLayer.addChild(gameController.hud); 

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