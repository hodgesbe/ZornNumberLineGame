// Contains functions for text we want on a timer. If we had more time or wanted to extend this game, we could make this a generic class
// to handle all timed sprites / events
// Nicholas Blum

// Display a new level message every new level, then disappear
var LevelText = function LevelText() {
    var text,
        timer,
        maxTime;
    
    this.init = function() {
        gameController.hud.removeChild(text);
        text = new PIXI.Text("Level " + level + "!",
                            {font: "48px sans-serif", fill: "black"});
        text.position.set(renderWidth/2, renderHeight/4);
        text.anchor.set(0.5, 0.5);
        gameController.hud.addChild(text);
        maxTime = 60;
        timer = 0;
        this.show();
    };
    
    this.hide = function() {
        text.visible = false;
    };
    
    this.show = function() {
        text.visible = true;
    };
    
    this.updateText = function() {
        if (timer < maxTime) {
            timer++;
        } else {
            this.hide();
        }
    };
};