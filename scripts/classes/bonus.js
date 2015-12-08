//Creates Bonus Objects with getter and setter methods
function Bonus() {

    this.butter_sprites_Arr;
    this.sun_sprite_Arr;
    this.butter_bonus_count;
    this.sun_bonus_count;


    //creates bonus object with empty sun and butter values
    this.init = function(){
        console.log("Bonus init. Sun: " + this.sunValues + ", Butter: " + this.butterValues + ".");


        this.butter_bonus_count = 0;
        this.sun_bonus_count = 0;


        //creates 3 butter_bonus sprites
        var butter_sprite1 = new Sprite(resources.butter_bonus.texture);
        var butter_sprite2 = new Sprite(resources.butter_bonus.texture);
        var butter_sprite3 = new Sprite(resources.butter_bonus.texture);

        //assigns position to the sprites
        butter_sprite1.position.set(684, 50);
        butter_sprite2.position.set(747, 50);
        butter_sprite3.position.set(810, 50);

        //adds butter_bonus sprites to an array
        this.butter_sprites_Arr = [butter_sprite1, butter_sprite2, butter_sprite3];

        //Creates 3 sun_bonus_sprite objects
        var sun_bonus_sprite1 = new Sprite(resources.sun_bonus.texture);
        var sun_bonus_sprite2 = new Sprite(resources.sun_bonus.texture);
        var sun_bonus_sprite3 = new Sprite(resources.sun_bonus.texture);

        //assigns position to sun_bonus_sprites
        sun_bonus_sprite1.position.set(537, 50);
        sun_bonus_sprite2.position.set(435, 50);
        sun_bonus_sprite3.position.set(333, 50);

        //adds sun_bonus_sprites to array
        this.sun_sprite_Arr = [sun_bonus_sprite1, sun_bonus_sprite2, sun_bonus_sprite3];

        //Creates a sun bonus button
        var useSunBonusFrame = [
            resources["use_sun_up"].texture,
            resources['use_sun_over'].texture,
            resources["use_sun_down"].texture
        ]
        useSunButton = tink.button(useSunBonusFrame, 462, 0);

        //function that arms a bonus on button press
        useSunButton.press  = () => {
            gameController.sunBonusArmed = true;
            this.removeSunBonus();
        }

        //Creates a butter bonus button
        var useButterFrame = [
            resources["use_butter_up"].texture,
            resources['use_butter_over'].texture,
            resources["use_butter_down"].texture
        ]
        useButterButton = tink.button(useButterFrame, 712, 0);

        //updates game controller boolean if pushed
        useButterButton.press = () => {
            gameController.butterBonusArmed = true;
            this.removeButterBonus();
        }


    };

    //adds butter bonus value. Takes an int for added bonus
    this.addButterBonus = function(){
        console.log(this.butterValues);
        if (this.butter_bonus_count<3){
            this.butter_bonus_count++;
            gameStage.addChild(this.butter_sprites_Arr[this.butter_bonus_count-1]);
        }

        //adds a use bonus botton if bonus is available
        if (this.butter_bonus_count>=1){
            gameStage.addChild(useButterButton);
        }

    };

    //removes butter bonus
    this.removeButterBonus = function(){
        console.log("removing butter!");
        if(this.butter_bonus_count>0){
            gameStage.removeChild(this.butter_sprites_Arr[this.butter_bonus_count-1]);
            this.butter_bonus_count--;
        }
        //removes use bonus button if no bonuses are available
        if (this.butter_bonus_count < 1){
            gameStage.removeChild(useButterButton);
        }
    };

    //adds sun bonus value. Takes an int for added bonus
    this.addSunBonus = function(){
        console.log(this.sunValues);
        if(this.sun_bonus_count<3){
            this.sun_bonus_count++;
            gameStage.addChild(this.sun_sprite_Arr[this.sun_bonus_count-1]);
        }
        //adds a use bonus botton if bonus is available
        if(this.sun_bonus_count>=1){
            gameStage.addChild(useSunButton);
        }
    };

    this.removeSunBonus = function(){
        console.log("Removing sun bonus!")
        if(this.sun_bonus_count>0){
            gameStage.removeChild(this.sun_sprite_Arr[this.sun_bonus_count-1]);
            this.sun_bonus_count--;
        }
        //removes use bonus button if no bonuses are available
        if(this.sun_bonus_count < 1){
            gameStage.removeChild(useSunButton);
        }
    }

    //returns the amount of butter bonuses
    this.getButterBonus = function(){
      return this.butter_bonus_count;
    };

    //returns the amount of sun bonuses
    this.getSunBonus = function(){
        return this.sun_bonus_count;
    };

}