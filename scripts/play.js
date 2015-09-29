// Game Logic for Project ZORN
// Collaborators: Brett, Ben, Jason, Nicholas

// It's okay to have "use strict" outside of a function so tell JSLint that
/*jslint node: true */
'use strict';

// We need to let JSLint know about PIXI definitions (to avoid PIXI was used before it was defined, etc)
/*global PIXI, requestAnimationFrame */

// -------------------------------------------------
// Full Scope Variables (not function-specific)
// -------------------------------------------------
var renderWindow; // This will be the render window
var scene; // The container for PIXI.JS, also called "stage" by a lot of documentation
var renderer; // Will create either a Canvas or WebGL renderer depending on the user's computer

// Change these to modify the render width and height. Note that the HTML container in css also will need
// to be modified. Maybe we can link those two somehow, by pulling information from html
var renderWidth = 1280;
var renderHeight = 720;

var graphics;

// All resources should be loaded into a resources object for us to use
// Call this after creating PIXI but before running any other setup functions
// It loads all external files into the variables that we declare here, and then we can use them in our project
// for things like texturing sprites, etc.
var GameAssets = function GameAssets() {
    // Asset fields
    // var tnr_f; // The Times New Roman Bitmap font
    
    this.init = function () {
        PIXI.loader
            // add resources here (to get stored in GameAssets() field
            // .add('tnr_f', 'resources/bitmap_fonts/tnr_f.fnt')
            // can do listen for progress
            // .on('progress', onProgressCallback)
            // can do listen for completion
            // .on('complete', onCompleteCallback)
            // load resources
            .load(function (loader, resources) {
                // resources is an object containing the loaded resources, keyed by the names you used above.
                // don't forget to type them!
                // tnr_f = new PIXI.Extras.BitmapText(resources.tnr_f);
            });
    };

};
var gameAssets; // Use this to hold an instance of GameAssets

// Game logic objects. These should PROBABLY be moved into the main game logic object once that's created
var bonus; // Bonus handler


// *****************************************************************
// --------------------------NUMBER LINE STUFF----------------------
// *****************************************************************

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

// *****************************************************************
// --------------------General Level Stuff--------------------------
// *****************************************************************

// Initial setup stuff goes here. This only runs once
var setup = function () {
    // ------------------
    // Set up PIXI window
    renderWindow = document.getElementById("renderWindow");
    scene = new PIXI.Container();
    renderer = PIXI.autoDetectRenderer(renderWidth, renderHeight);
    renderer.backgroundColor = 0x33CCFF; // Set the temporary background color here
    // add the renderer view element to the DOM. We are going to place it inside our
    // "renderWindow" div
    renderWindow.appendChild(renderer.view);
    
    // --------------------------
    // Load in external resources
    // --------------------------
    gameAssets = new GameAssets();
    gameAssets.init();
    
    // ------------------------
    // Add global PIXI handlers
    // ------------------------
    graphics = new PIXI.Graphics(); // We need this for things like lines, rectangles, etc.
    scene.addChild(graphics);
    
    // -------------
    // Do game logic
    // -------------
    // Build the number line - probably should be level specific
    buildNumberLine(100);
    
    // Build the Bonus Handler
    bonus = new BonusHandler();
    bonus.init(10, 10);
    
};

// Continually rendered stuff goes here
var render = function () {

    renderer.render(scene);
    requestAnimationFrame(render);
    
    // console.log("Forever looping");
};

setup(); // Call this once
render(); // Gets called forever

// Useful documentation for PIXI:
// http://www.goodboydigital.com/pixi-js-v3/