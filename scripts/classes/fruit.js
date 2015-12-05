//Creates a fruit object which contains the graphic
var Fruit = function Fruit (fruitValue){
    //Constructor
    this.fruitValue = fruitValue; //value to be displayed on fruit
    this.fruitGraphic = new Graphics(); //Graphic that contains both fruit sprite and value message
    this.fruitSprite = new Sprite(resources.apple.texture); //actual sprite
    this.previousPos = {x: 0, y: 0};
    var message = new PIXI.Text("" + this.fruitValue,
                               {font: "16px sans-serif", fill: "white"}), //message which displays value
       //find and save center of baskets
       leftBasketCenter = {x: itemAreas.leftBasket.x + (itemAreas.leftBasket.width/2) - (this.fruitSprite.width/2) * 1.25,
                           y: itemAreas.leftBasket.y + (itemAreas.leftBasket.height/2) - (this.fruitSprite.height) * 1.25},
       rightBasketCenter = {x: itemAreas.rightBasket.x + (itemAreas.rightBasket.width/2) - (this.fruitSprite.width/2) * 1.25,
                            y: itemAreas.rightBasket.y + (itemAreas.rightBasket.height/2) - (this.fruitSprite.height) * 1.25};

    //---Function to update sprites location and adjust message location as well
    this.addLoc = function (X, Y){
        //adjust sprite to be correct size and location
        this.fruitSprite.position.set(X,Y);
        //overlay message on sprite
        if (fruitValue < 0) {
            message.anchor.set(-0.5, -0.55);
        } else {
            message.anchor.set(-1.1, -0.55);
        }

        message.position.set(0,0);

        // Sprite event handlers
        // this.fruitSprite.circular = true;
        tink.makeDraggable(this.fruitSprite);
        tink.makeInteractive(this.fruitSprite);

        // If the mouse is pressed while over this sprite and not currently dragging something else,
        // pick this sprite up and remember its previous position.
        this.fruitSprite.press = () => { // Using = () => over function () binds this object's referencing environment
            if (dragParams.currentFruit === null) {
                console.log("Fruit clicked: " + this.fruitValue);
                dragParams.previousPos.x = this.fruitSprite.position.x;
                dragParams.previousPos.y = this.fruitSprite.position.y;
                dragParams.currentFruit = this.fruitSprite;
                topLayer.addChild(this.fruitSprite);
            }
        };

        // If the mouse is released while dragging this sprite, return it to previous position
        this.fruitSprite.release = () => {
            if (dragParams.currentFruit === this.fruitSprite) {
                if (dragParams.overBasket(this.fruitSprite) === 'left' && dragParams.leftBasket === null) {
                    gameController.currentFruitValue += this.fruitValue;
                    gameController.currentFruitBin.push(this.fruitSprite);
                    console.log("Fruit in left basket = " + gameController.currentFruitValue);
                    this.fruitSprite.draggable = false;
                    dragParams.leftBasket = this;
                    //console.log(dragParams.fruitsInBasket.length);
                    this.previousPos.x = dragParams.previousPos.x;
                    this.previousPos.y = dragParams.previousPos.y;
                    //place fruit in center
                    this.fruitSprite.position.set(leftBasketCenter.x, leftBasketCenter.y);
                    this.fruitSprite.scale.set(1.25,1.25);
                } else if (dragParams.overBasket(this.fruitSprite) === 'right' && dragParams.rightBasket === null) {
                    gameController.currentFruitValue += this.fruitValue;
                    gameController.currentFruitBin.push(this.fruitSprite);
                    console.log("Fruit in right basket = " + gameController.currentFruitValue);
                    this.fruitSprite.draggable = false;
                    dragParams.rightBasket = this;
                    //console.log(dragParams.fruitsInBasket.length);
                    this.previousPos.x = dragParams.previousPos.x;
                    this.previousPos.y = dragParams.previousPos.y;
                    //place fruit in center
                    console.log(rightBasketCenter);
                    this.fruitSprite.position.set(rightBasketCenter.x, rightBasketCenter.y);
                    this.fruitSprite.scale.set(1.25,1.25);
                } else {
                    this.fruitSprite.position.x = dragParams.previousPos.x;
                    this.fruitSprite.position.y = dragParams.previousPos.y;

                }
                dragParams.currentFruit = null;
                dynamicLayer.addChild(this.fruitSprite);

            }
        };


        //add sprite and message to graphic
        this.fruitGraphic.addChild(this.fruitSprite);
        this.fruitSprite.addChild(message);
        // dynamicStage.addChild(this.fruitSprite);
    }
};

function FruitBin() {

    var fruitTarget, //target sum of all fruit values
        fruitMin, //minimum number of all fruit needed for level
        possibleValues = [], //array of values for fruit
        i; //index for iteration
    this.posLocation = [];
    this.negLocation = [];

    //---Function to create 2d array of coordinates to display fruit based off leftTree and tree2item areas
    this.setLocation = function (){
        //Alias
        var pos = itemAreas.rightTree,
            neg = itemAreas.leftTree,
            row, col,
            fruitSprite = new Sprite(resources.apple.texture),
            fx, fy,
            posLoc = [[],[],[],[],[],[],[],[],[]], negLoc = [[],[],[],[],[],[],[],[],[]],
            r, c, box;

            fx = fruitSprite.width,
            fy = fruitSprite.height;

        //Fill location values with all available locations within tree boxes
        for (row = fx/2; row < neg.width-0.5*fx; row += 1.5*fx){
            if (row < neg.width/3){r=0;}
            else if (row < neg.width*2/3){r=1;}
            else {r=2;}
            for (col = fy/2; col < neg.height-0.5*fy; col += 1.5*fy){
                if (col < neg.height/3){c=0;}
                else if (col < neg.height*2/3){c=1;}
                else {c=2;}
                box = 3*r+c;
                posLoc[box].push([pos.x-(fx/2)+row,pos.y+col]);
                negLoc[box].push([neg.x-(fx/2)+row,neg.y+col]);
            }
        }
        this.posLocation = posLoc;
        this.negLocation = negLoc;
    }

    //---Function to set sprite locations for each fruit
    this.addFruit = function (){
        console.log("Adding fruit");

        var i,
            posPool,
            negPool,
            index,
            coords = [],
            box,
            counter = 0;

        //fill pos and neg arrays with possible values
        this.setLocation();
        console.log("Needed Fruit: "+posFruitBin.length);
        console.log("Setting fruit location:");

        //randomly select a location for each fruit from posible location
        for (i = 0; i < posFruitBin.length; i++){
            counter++;
            box = i%9;
            posPool = this.posLocation[box];
            negPool = this.negLocation[box];
            //randomly select positve location from pool of positive indices
            index = randomInt(0, posPool.length-1);
            coords = posPool.splice(index, 1);
            posFruitBin[i].addLoc(coords[0][0],coords[0][1]);

            //randomly select negative location from pool of negative indices
            index = randomInt(0, negPool.length-1);
            coords = negPool.splice(index, 1);
            negFruitBin[i].addLoc(coords[0][0],coords[0][1]);

            //add graphics to dynamicStage container
            dynamicLayer.addChild(posFruitBin[i].fruitGraphic);
            dynamicLayer.addChild(negFruitBin[i].fruitGraphic);
        }
        console.log("Ending fruit: "+counter);
    }

    //---Randomly select fruit values, create fruit with those values
    this.init = function (){
        console.log("Creating a fruit bin");
        var posFruitValues = [],
            negFruitValues = [];

        switch (level) {
            case 0:
                console.log("Switching on level creating bin - level: " + level);
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

//Random number helper function with inclusive bounds
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
