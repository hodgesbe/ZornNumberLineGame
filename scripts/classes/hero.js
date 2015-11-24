//Hero Object
function Hero() {

    //Creates a new Hero object with full health
    var healthBar = new PIXI.Container();
    var innerBar = new Graphics();
    var outerBar = new PIXI.Graphics();
    var healthTitle;
    var damageCount = 0;

    //should display character on initilization but is not working
    //the function is called and the console logs show up
    //possibly is being called before the stage is being built?
    this.init = function () {
        this.health = 100;
        console.log("Current Hero health: " + this.health);
        this.showHero();
    };

    //temporary function to display hero until we can figure out why it wont display during initialization
    this.showHero = function () {
        var hero_sprite = new Sprite(resources.game_character.texture);
        hero_sprite.position.x = 590;
        hero_sprite.position.y = 500;
        gameStage.addChild(hero_sprite);


        //Health Bar (Should probably be moved to game hero init but doesnt currently work from there)
        healthBar.position.set(910, 45);
        gameStage.addChild(healthBar);

        //healthBar Inner
        innerBar.beginFill(0x000000);
        innerBar.drawRect(0, 0, 200, 30);
        innerBar.endFill();
        healthBar.addChild(innerBar);

        //HealthBar Outer
        outerBar.beginFill(0xFF3300);
        outerBar.drawRect(0, 0, 200, 30);
        outerBar.endFill();
        healthBar.addChild(outerBar);
        healthBar.outer = outerBar;


        //text with health is not working properly as health is not updating when player takes damage.
        //should also be placed in the "play" function or outside of the hero function
        healthTitle = new PIXI.Text(
            "Hero's Health: " + this.health + "%",
            {font: "32px Sans-serif", fill: "white"}
        );
        healthTitle.x = 878;
        healthTitle.y = 2;
        gameStage.addChild(healthTitle);

    };


    //default damage (decrements by 10)
    this.takeDamage = function () {
        if(this.health>0) {
            this.health = this.health - 10;
            console.log("Current Hero health: " + this.health);
            //take damage is not updating health bar.
            //Should be decrementing when takeDamage is called so should be listening outside the hero function
            healthBar.outer.width -= 20;
            gameStage.removeChild(healthTitle);
            healthTitle = new PIXI.Text(
                "Hero's Health: " + this.health + "%",
                {font: "32px Sans-serif", fill: "white"}
            );
            healthTitle.x = 878;
            healthTitle.y = 2;
            gameStage.addChild(healthTitle);

            var pow = new Sprite(resources.pow_effect.texture);
            pow.position.set(550, 400);
            gameStage.addChild(pow);
            //Need to add a remove or fade function.
        }else if(this.health === 0){
            buildGameOverScreen();
            gameStage.visible = false;
            gameOverStage.visible = true;
        }
    };

    //returns hero health
    this.returnHealth = function () {
        return this.health;
    };
}