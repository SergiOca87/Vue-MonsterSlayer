new Vue({
    el: '#app',
    data: {
        hero_health: 100,
        monster_health: 100,
        heroDmg : 0,
        monsterDmg : 0,
        heroHealPoints : 0,
        heroMana : 100,
        show: false,
        deactivatedControls : false,
        bannerShow: false,
        bannerText: "",
        bannerWon : null,
        bannerLost : null,
        singleDeactivated: false,
        combatLog: []
    },
    methods: {
        //Restart everything
        startGame: function() {
            this.show = true;
            this.bannerShow = false;
            this.hero_health = 100;
            this.monster_health = 100;
            this.deactivatedControls = false;
            this.heroMana = 100;
            this.combatLog = [];
        },
        //Generate random numbers between a range
        randomGenerator: function(min, max) {
            return Math.floor(Math.random()*(max - min + 1) + min);
        },
        heroAttack: function() {
            //Deactivate controls (prevent attack spam)
            this.deactivatedControls = true;

            //Store the damage done this turn (used in floating damage animation and to add it to the log)
            this.heroDmg = this.randomGenerator(4, 8);
            this.monster_health -= this.heroDmg;

            //Store the damage done this turn into the log
            this.combatLog.unshift({
                isPlayer: true,
                text: `The hero deals ${this.heroDmg} points of damage`
            });

            //Change the images for animation
            let parent = document.querySelector('.hero-image-wrap');
            parent.innerHTML = `
                <img src="./assets/hero/Player_Attack_Sword_Defence0_1.png" class="hero-attack hero-attack-one">
                <img src="./assets/hero/Player_Attack_Sword_Defence0_2.png" class="hero-attack hero-attack-two">
            `;

            //After 2 seconds return to original iddle animation
            setTimeout(function(){
                parent.innerHTML = `
                <img src="./assets/hero/Player_Idle_Sword_Defence0_1.png" class="hero-iddle hero-iddle-one">
                <img src="./assets/hero/Player_Idle_Sword_Defence0_2.png" class="hero-iddle hero-iddle-two">
            `;
           }, 2000); 

           //Floating damage animation
            document.querySelector('.monster .floating-damage').classList.add('active');
        
            //Floating damage is over and check if game is over
            const vm = this;
            setTimeout(function(){
                document.querySelector('.monster .floating-damage').classList.remove('active');

                if( vm.monster_health <= 0 ) {
                    vm.deactivatedControls = true;
                    vm.gameOver();
                } else {
                    vm.monsterAttack();
                }
                
           }, 3000); 
            
        },
        monsterAttack: function() {
            const vm = this;

            this.monsterDmg = this.randomGenerator(5, 10);
            
            this.hero_health -= vm.monsterDmg;

            //check if health will go under 100
            if( this.hero_health <= 0) {
                this.hero_health = 0;
            } 

            this.combatLog.unshift({
                isMonster: true,
                text: `The monster deals ${this.monsterDmg} points of damage`
            });

            let parent = document.querySelector('.monster-image-wrap');
            parent.innerHTML = `
            <img src="./assets/monster/DungeonMaster_Walk_0.png" class="monster-attack monster-attack-one">
            `;

            document.querySelector('.monster-projectile-one').classList.add('active');
            document.querySelector('.monster-projectile-two').classList.add('active');

            document.querySelector('.hero .floating-damage').classList.add('active');

            setTimeout(function(){
                parent.innerHTML = `
                    <img src="./assets/monster/DungeonMaster_Walk_3.png" class="monster-iddle monster-iddle-one">
                    <img src="./assets/monster/DungeonMaster_Walk_2.png" class="monster-iddle monster-iddle-two">
                `;

                document.querySelector('.monster-projectile-one').classList.remove('active');
                document.querySelector('.monster-projectile-two').classList.remove('active');
                document.querySelector('.hero .floating-damage').classList.remove('active');

                if( vm.hero_health <= 0 ){
                    vm.deactivatedControls = true;
                    vm.gameOver();
                } else {
                    vm.deactivatedControls = false;
                }

           }, 3000); 

        },
        heroSpecial: function() {
            const vm = this;

            this.deactivatedControls = true;

            this.heroDmg = this.randomGenerator(10, 20);
            this.monster_health -= vm.heroDmg;

            this.heroMana -= 20;

            this.combatLog.unshift({
                isPlayer: true,
                text: `The hero deals ${this.heroDmg} points of damage`
            });

            if( this.heroMana <= 0 ) {
                this.singleDeactivated = true;
            }

             //change the image
             let parent = document.querySelector('.hero-image-wrap');
             parent.innerHTML = `
                 <img src="./assets/hero/Player_Walk_Sword_Defence0_2.png" class="hero-attack hero-attack-one">
                 <img src="./assets/hero/Player_Walk_Sword_Defence0_3.png" class="hero-attack hero-attack-two">
            `;

            setTimeout(function(){
                parent.innerHTML = `
                <img src="./assets/hero/Player_Idle_Sword_Defence0_1.png" class="hero-iddle hero-iddle-one">
                <img src="./assets/hero/Player_Idle_Sword_Defence0_2.png" class="hero-iddle hero-iddle-two">
            `;
           }, 2000); 

            document.querySelector('.monster .floating-damage').classList.add('active');
            
            setTimeout(function(){
                document.querySelector('.monster .floating-damage').classList.remove('active');

                if( vm.monster_health <= 0 ) {
                    vm.deactivatedControls = true;
                    vm.gameOver();
                } else {
                    vm.monsterAttack();
                }
                
           }, 3000); 
  
        },
        heroHeal: function() {
            const vm = this;

            this.deactivatedControls = true;

            this.heroHealPoints = this.randomGenerator(10, 15);
            this.hero_health += this.heroHealPoints;

            this.heroMana -= 20;

            //check if health will go above 100
            if( this.hero_health >= 100) {
                this.hero_health = 100;
            } 

            if( this.heroMana <= 0 ) {
                this.singleDeactivated = true;
            }

            //change the image
            let parent = document.querySelector('.hero-image-wrap');
            parent.innerHTML = `
                <img src="./assets/hero/Player_Attack_Sword_Defence0_3.png" class="hero-heal">
            `;

            

            this.combatLog.unshift({
                isPlayer: true,
                text: `The hero recovers ${this.heroHealPoints} points of health`
            });

            document.querySelector('.hero .floating-health').classList.add('active');

            setTimeout(function(){
                parent.innerHTML = `
                <img src="./assets/hero/Player_Idle_Sword_Defence0_1.png" class="hero-iddle hero-iddle-one">
                <img src="./assets/hero/Player_Idle_Sword_Defence0_2.png" class="hero-iddle hero-iddle-two">
            `;

                document.querySelector('.hero .floating-health').classList.remove('active');
            
            }, 2000); 

            setTimeout(function(){
                vm.monsterAttack();
            }, 3000); 

        },
        gameOver: function() {
            const vm = this;

            //Check if the hero or monster health is equal or smaller than 0 to end game and display a banner message
            if( this.hero_health <= 0 ) {

                //Change the images for animation
                let parent = document.querySelector('.hero-image-wrap');
                parent.innerHTML = `
                    <img src="./assets/hero/Player_Death_Sword_0.png" class="hero-attack hero-death-one">
                    <img src="./assets/hero/Player_Death_Sword_3.png" class="hero-attack hero-death-two">
                `;

                setTimeout(function(){
                    vm.bannerShow = true;
                    vm.bannerLost = true;
                    vm.bannerText = "You've Lost...";
                    vm.show = false;
                    return true;
                }, 3000); 

            }  else if( this.monster_health <= 0 ) {

                console.log('monster died');

                //Change the images for animation
                let parent = document.querySelector('.monster-image-wrap');
                parent.innerHTML = `
                    <img src="./assets/monster/DungeonMaster_Death_04.png" class="monster-iddle monster-death-one">
                    <img src="./assets/monster/DungeonMaster_Death_11.png" class="monster-iddle monster-death-two">
                `;
                
                setTimeout(function(){
                    vm.bannerShow = true;
                    vm.bannerWon = true;
                    vm.bannerText = "You've Won!";
                    vm.show = false;
                    return true;
                }, 3000); 
            } else {
                return;
            }
        }
    }  
});