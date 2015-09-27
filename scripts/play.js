// Game Logic for Project ZORN
// Collaborators: Brett, Ben, Jason, Nicholas

"use strict";

// *****************************************************************
// -----------------------PIXI JS Stuff-----------------------------
// *****************************************************************
// Get the location we want to append this to
var renderWindow = document.getElementById("renderWindow");

// Create a new scene
var scene = new PIXI.Container();

// create a renderer instance.
// These two variables will be our render height and width
var renderWidth = 1280;
var renderHeight = 720;

var renderer = PIXI.autoDetectRenderer(renderWidth, renderHeight);
renderer.backgroundColor = 0x33CCFF; // Set the temporary background color here

// add the renderer view element to the DOM. We are going to place it inside our
// "renderWindow" div
renderWindow.appendChild(renderer.view);

var graphics = new PIXI.Graphics(); // We need this for things like lines, rectangles, etc.
scene.addChild(graphics);

// *****************************************************************
// --------------------------NUMBER LINE STUFF----------------------
// *****************************************************************

// A NumberLine object contains an array of integers starting at number "start" and continuing
// on for "length" distance
// This may not be the best implementation ie we might want each point to have a PIXIJS number corresponding to its actual number, for instance...but for now it works
var NumberLine = function NumberLine(start, length) {
    var end;
    var points = [];
    this.length = length;
    this.start = start;
    end = start + length;
    
    // Create an array of points to size length, with the value from start to end
    var i;
    for (i = 0; i < length; i += 1) {
        points[i] = i + start;
    }
};

// Build number line will handle the scaling of the number line based on a levelScalar variable (tutorial, advanced tutorial,
// full game). For now, it just builds a debug number line
var BuildNumberLine = function (levelScalar) {
    var numberLine = new NumberLine (0, 10); // Build the number line (scalar does nothing at the moment)
    var offset = 20; // How high to render the number line above the bottom of the window

    // ** Draw a line from one side of the view to the other **
    // set the line style to have a width of 3 and set the color to black
    graphics.lineStyle(3, 0x000000);
    graphics.drawRect(0, renderHeight - offset, renderWidth, 1);
    
    // ** Draw "dots" at each number point, and scale it accordingly based on how many points there are
    var distance = (renderWidth) / numberLine.length;

    
    var i;
    for (i = 0; i < numberLine.length; i += 1) {
        // console.log("drawing dot");
        graphics.drawRect(distance * i, renderHeight - offset, 10, 10);
    }
};

// *****************************************************************
// -----------------------BONUS ITEM STUFF--------------------------
// *****************************************************************
var BUTTER_BONUS;
var SUN_BONUS;

// *****************************************************************
// --------------------General Level Stuff--------------------------
// *****************************************************************

// Initial setup stuff goes here. This only runs once
var setup = function() {
    BuildNumberLine(100);
    
    BUTTER_BONUS = 0;
    SUN_BONUS = 0;
}

// Continually rendered stuff goes here
var render = function() {

    renderer.render(scene);
    requestAnimationFrame(render);
    
    // console.log("Forever looping");
};

setup(); // Call this once
render(); // Gets called forever