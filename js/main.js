var game = new Phaser.Game(800, 500, Phaser.AUTO, 'game', { preload: preload, create: create, update: update});

	function preload() { //load assets
		game.load.image('background','assets/img/space-background.jpg');	
		game.load.image('pikachu', 'assets/img/pikachu.gif');	
		game.load.spritesheet('bullet', 'assets/img/lightning_1.png', 128 , 512);
		game.load.image('jiggly', 'assets/img/jigglyPuff.png');
		game.load.image('brick', 'assets/brick_tiles_1.png');
	}
		var playingField;
		var player;
		var bullets;
		var bullet;
		var bulletTime = 0;
		var cursors;
		var fireButton;
		var ball;
		var secondBall;
		var secondBall2;
		var nextFire = 0;
		var gravityTimer = 0;
		var map;
		var layer;
		var platforms;
	
	function create(){// do something with the assest liek add it to the scene
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//playing feild background image
   		playingField = game.add.image(0, 0, 'background');

   	    //floor
   	    platforms = game.add.group();
   	    platforms.enableBody = true;
	    platforms.physicsBodyType = Phaser.Physics.ARCADE;
   	    createPlatform();
   		

   		//create bullet
   		//  Our bullet group
	    bullets = game.add.group();
	    bullets.enableBody = true;
	    bullets.physicsBodyType = Phaser.Physics.ARCADE;
	    bullets.createMultiple(10, 'bullet');
	    bullets.setAll('anchor.x', 0.5);
	    bullets.setAll('anchor.y', 0.5);
	    bullets.setAll('outOfBoundsKill', true);
	    bullets.setAll('checkWorldBounds', true);



   		//create pikachu character
		player = game.add.sprite(400, 445, 'pikachu');
    	player.anchor.setTo(0.5, 0.5);
    	game.physics.enable(player, Phaser.Physics.ARCADE);
    	player.body.collideWorldBounds = true;

    	//create jiggly puff aka ball
    	ball = game.add.sprite(400, 200, 'jiggly');
	    game.physics.enable(ball, Phaser.Physics.ARCADE);
	    //  This gets it moving
	    ball.body.velocity.x = 100; 
	    ball.body.velocity.y = -100;
	    //  This makes the game world bounce-able
	    ball.body.collideWorldBounds = true;
	    //  This sets the ball bounce energy for the horizontal  and vertical vectors (as an x,y point). "1" is 100% energy return
	    ball.body.bounce.set(1);
	    ball.body.bounce.setTo(0.9, 0.9);
	


    	 //  And some controls to play the game with
    	cursors = game.input.keyboard.createCursorKeys();
    	fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	}
	function update(){//things to do on each tick
		// if (player.alive){
        //  Reset the player, then check for movement keys
        player.body.velocity.setTo(0, 0);

        if (cursors.left.isDown)
        {
            player.body.velocity.x = -250;
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = 250;
        }
        else {
        	player.animations.stop();

        }

        if(game.time.totalElapsedSeconds() > gravityTimer ){
        	if(ball && ball.body){
        		ball.body.velocity.y += 10;
        	}
        	if(secondBall && secondBall.body){
        		secondBall.body.velocity.y += 10;
        	}
        	if(secondBall2 && secondBall2.body){
        		secondBall2.body.velocity.y += 10;
        	}
        	gravityTimer = game.time.totalElapsedSeconds() + 0.2;
        }
        //  Firing

        if (fireButton.isDown && game.time.totalElapsedSeconds() > nextFire)
        {
            fireBullet();
            nextFire = game.time.totalElapsedSeconds() + 0.5;

        }
        game.physics.arcade.overlap(bullets, ball, collisionHandler, null, this);
        game.physics.arcade.overlap(player, ball);
        game.physics.arcade.collide(platforms, ball, ballHitsFloor, null, this);
		game.physics.arcade.collide(platforms, secondBall, ballHitsFloor, null, this);
		game.physics.arcade.collide(platforms, secondBall2, ballHitsFloor, null, this);
	}
	function collisionHandler (a, b) {
		
		secondBall = game.add.sprite(ball.body.x, ball.body.y, 'jiggly');
		game.physics.arcade.enable(secondBall);
		secondBall.body.collideWorldBounds = true;
		secondBall.body.velocity.x = 100;
		secondBall.body.velocity.y = -50;
		secondBall.body.bounce.set(1);

		secondBall2 = game.add.sprite(ball.body.x, ball.body.y, 'jiggly');
		game.physics.arcade.enable(secondBall2);
		secondBall2.body.collideWorldBounds = true;
		secondBall2.body.velocity.x = -150;
		secondBall2.body.velocity.y = -50;
		secondBall2.body.bounce.set(1);
		

		ball.destroy();
		console.log("working"); 
	
    }
    function finalCollision(d,e){
    	secondBall.destroy();
    	secondBall2.destroy();
    }
    function ballHitsFloor() {

    	if(ball && ball.body){
    		ball.body.velocity.y = -120;
        }
        if(secondBall && secondBall.body){
    		secondBall.body.velocity.y = -120;
        }
        if(secondBall2 && secondBall2.body){
        	secondBall2.body.velocity.y = -120;
        }
    }
	function fireBullet () {
    //  set a time limit to regulate bullet speed
    	//translate it to secounds
    	
    	
	    if (game.time.totalElapsedSeconds() > bulletTime){
	        var bullet = bullets.getFirstExists(false);
	     	bullet.animations.add('thunder', [0,1,2,3,4,5,6,7], 15, true); //add new name, array for the pi, framespersec, loop
	     	//bullet.body.setSize(10,512,59,0);
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
    function createPlatform(){
    	for(i = 0; i < game.world.width; i += 34){
    		var ground = platforms.create(i, game.world.height - 33, 'brick');
    		ground.body.immovable = true;
    	}
    }

// function resetBullet (bullet) {

//     //  Called if the bullet goes out of the screen
//     bullet.kill();

// }


































	