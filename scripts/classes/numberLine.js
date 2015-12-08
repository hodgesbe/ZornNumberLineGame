// Numberline scripts
// Nicholas Blum

var NumberLine = function NumberLine() {
    // Constructor
    this.points = [];
    this.start = 0; // The numeric start point of the number line, should be negative so that it is equally sized to the left and right of 0.
    this.length = 0;
    this.dashes = [];
    this.messages = [];
        
    this.init = function () {
        var i;
        // Set size based on level
        switch (level) {
            case 0:
                this.start = -7;
                break;
            case 1:
                this.start = -10;
                break;
            case 2:
                this.start = -15;
            default:
                break;
        }
        
        // Length is always a function of start
        this.length = Math.abs(this.start * 2) + 1;
        
        // Build points
        for (i = 0; i < this.length; i += 1) {
            // console.log(this.start+i);
            this.points[i] = new Point(this.start + i, i, this.length);
        }
    };
    
    // Print out all of the points
    this.printPoints = function () {
        var i;
        console.log("Printing points. Length = " + this.length);
        for (i = 0; i < this.length; i += 1) {
            console.log("Point " + this.points[i].index + " has value " + this.points[i].value);
        }
    };
    
    // Return a reference to the point on the numberline with the passed value,
    // or false if it doesn't exist.
    this.getPoint = function (value) {
        for (i = 0; i < this.length; i++) {
            // console.log("Does " + this.points[i].value + " equal " + this.points[i].value);
            if (this.points[i].value === value) {
                //console.log("Yes!");
                return this.points[i];
            }
        }
        // console.log("No points found, returning 0.");
        return false;
    };
    
    this.getPointIndex = function(index) {
        return (this.points[index]);
    };
    
    // Returns the origin point of the hero
    this.getOrigin = function() {
        return 0;
    }
};

// A Point object knows its index as well as the x and y position on the screen to render
var Point = function Point(value, index, length) {
    this.value = value;
    this.index = index;
    this.x = numLineParams.startX + (numLineParams.endX / length * index) + ((numLineParams.endX / length * (index+1) - (numLineParams.endX / length * index)) / 2);
    this.y = numLineParams.Y;
};

function displayNumberLine(firstTime) {
    // console.log("Displaying the numberline.");
    var i,
        line,
        dash,
        dashWidth = 3,
        label,
        message,
        numberLine = gameController.game.numberLine;
    
    // If the number line already exists, destroy it. New level!
    if (firstTime === false) {
        console.log("Not the first time, clean up the number line!");
        for (i = 0; i < numberLine.dashes.length; i++) {
            backgroundLayer.removeChild(numberLine.dashes[i]);
            backgroundLayer.removeChild(numberLine.messages[i]);
        }
        numberLine.dashes = [];
        numberLine.messages= [];
    }
    
    
    // Create a dash and a number at each "point" on the number line.
    for (i = 0; i < numberLine.length; i++) {
        // console.log("Creating a point!");
        // Create a point
        dash = new Graphics();
        dash.beginFill(0x000000);
        //console.log("x: " + numberLine.points[i].x + ", y: " + numberLine.points[i].y);
        dash.drawRect(numberLine.points[i].x, numberLine.points[i].y, dashWidth, itemAreas.sidewalk.height);
        dash.endFill();
        backgroundLayer.addChild(dash);
        numberLine.dashes.push(dash);
        
        // Create a number
        // It should be placed beneath the bottom of the dash that has just been drawn
        message = new PIXI.Text(numberLine.points[i].value,
                               {font: "24px sans-serif", fill: "white"});
        message.position.set(numberLine.points[i].x, numberLine.points[i].y + itemAreas.sidewalk.height);
        message.anchor.set(0.5, 0);
        backgroundLayer.addChild(message);
        numberLine.messages.push(message);
    }
}