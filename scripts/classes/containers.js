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
    launchButton.tap = () => {
        // Only do buttons if not draggin fruit
        if (dragParams.currentFruit === null) {
            //Only do if both baskets are full
            if(dragParams.leftBasket != null && dragParams.rightBasket != null){
                // Also make sure that there is no launch in progress
                if (launchInProgress === false) {
                    gameController.launch();
                    launchInProgress = true;
                }

            }
        }
    };
    hud.addChild(launchButton);
    
    // menu button
    var genericButtonFrames = [
        resources.buttonUp.texture,
        resources.buttonOver.texture,
        resources.buttonDown.texture
    ];
    var menuButton = tink.button(genericButtonFrames, 0, zombie.height);


    //help button
    var helpFrame = [
        resources["help_up"].texture,
        resources["help_over"].texture,
        resources["help_down"].texture
    ];

    helpButton = tink.button(helpFrame, 0, zombie.height+50);
    helpButton.tap = () => {
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
    resetButton.tap = () => {
        var i;
        // Only do buttons if we aren't dragging fruit nor is there a launch in progress
        if (dragParams.currentFruit === null && gameController.launchInProgress === false) {
            console.log("Trying to reset fruit");
            //reset left basket
            if (dragParams.leftBasket != null){
                dragParams.leftBasket.fruitSprite.position.x = dragParams.leftBasket.previousPos.x;
                dragParams.leftBasket.fruitSprite.position.y = dragParams.leftBasket.previousPos.y;
                dragParams.leftBasket.fruitSprite.draggable = true;
                dragParams.leftBasket.fruitSprite.scale.set(1,1);
                dragParams.leftBasket = null;
            //reset right basket
            } if (dragParams.rightBasket != null){
                dragParams.rightBasket.fruitSprite.position.x = dragParams.rightBasket.previousPos.x;
                dragParams.rightBasket.fruitSprite.position.y = dragParams.rightBasket.previousPos.y;
                dragParams.rightBasket.fruitSprite.draggable = true;
                dragParams.rightBasket.fruitSprite.scale.set(1,1);
                dragParams.rightBasket = null;
            }
            gameController.currentFruitBin = [];
            gameController.currentFruitValue = 0;
        }
    };
    hud.addChild(resetButton);

    //hud.addChild(menuButton);
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
                                    +"some butter - or maybe even the \nlegendary power of the sun!"
                                    +"\n\nHow To Play\n"
                                    +"Zombies will appear on the number line. They are trying to eat you and steal your butter! Find their position\n"
                                    +"on the number line, and "
                                    +"pick two fruit whose values equal that on the number line. Then click launch, and\n"
                                    +"if you got it right, you will take them out, maybe even earning a bonus!\n"
                                    +"But beware, miss too many and you just might find yourself on the receiving end of an attack yourself!\n\nGood luck!",
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
    backButton.tap = () => {
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

    var playAgainButton = tink.button(genericButtonFrames, playAgainPosition.x, playAgainPosition.y);

    gameOverStage.addChild(playAgainButton);

    playAgainButton.press = () => {
        window.location.replace('./index.html');
    }

}

function buildStaticGraphics() {

}

function buildMainMenu() {

}
