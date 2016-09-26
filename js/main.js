var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update});

	function preload() { //load assets
		game.load.image('background','assets/img/space-background.jpg');	
		game.load.image('pikachu', 'assets/img/pikachu.gif');	
		game.load.spritesheet('bullet', 'assets/img/lightning_1.png', 128, 512);
	}
		var playingField;
		var player;
		var bullets;
		var bullet;
		var bulletTime = 0;
		var cursors;
		var fireButton;
	
	function create(){// do something with the assest liek add it to the scene
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//playing feild background image
   		playingField = game.add.image(0, 0, 'background');

   		//create bullet
   		//  Our bullet group
	    bullets = game.add.group();
	    bullets.enableBody = true;
	    bullets.physicsBodyType = Phaser.Physics.ARCADE;
	    bullets.createMultiple(12, 'bullet');
	    bullets.setAll('anchor.x', 0.5);
	    bullets.setAll('anchor.y',0);
	    bullets.setAll('outOfBoundsKill', true);
	    bullets.setAll('checkWorldBounds', true);


   		//create pikachu character
		player = game.add.sprite(400, 575, 'pikachu');
    	player.anchor.setTo(0.5, 0.5);
    	game.physics.enable(player, Phaser.Physics.ARCADE);

    	 //  And some controls to play the game with
    	cursors = game.input.keyboard.createCursorKeys();
    	fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	}
	function update(){//things to do on each tick
		// if (player.alive){
  //       //  Reset the player, then check for movement keys
        player.body.velocity.setTo(0, 0);

        if (cursors.left.isDown)
        {
            player.body.velocity.x = -150;
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = 150;
        }
        else {
        	player.animations.stop();

        }

        //  Firing

        if (fireButton.isDown)
        {
            fireBullet();
        }
        

        //collision events
        // game.physics.arcade.overlap(bullets);

	}
	function fireBullet () {
    //  set a time limit to regulate bullet speed
    	//translate it to secounds
    	
    	
	    if (game.time.totalElapsedSeconds() > bulletTime){
	        var bullet = bullets.getFirstExists(false);
	     	bullet.animations.add('thunder', [0,1,2,3,4,5,6,7], 15, true); //add new name, array for the pi, framespersec, loop
	     	console.log(bullet);
	        
	        if (bullet){
	            //  And fire it
	            bullet.play('thunder');
	            bullet.reset(player.x, 600);
	            bullet.body.velocity.y = -800;
	            bulletTime = game.time.totalElapsedSeconds() + 1;
	        }
        }
    }

// function resetBullet (bullet) {

//     //  Called if the bullet goes out of the screen
//     bullet.kill();

// }


	