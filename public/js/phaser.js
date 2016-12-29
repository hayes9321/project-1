var game = new Phaser.Game(600, 400, Phaser.AUTO, 'game', { preload: preload, create: create, update: update});

	function preload() { //load assets
		game.load.image('background','public/assets/img/space-background.jpg');	
		game.load.image('pikachu', 'public/assets/img/pikachu.gif');	
		game.load.spritesheet('bullet', 'public/assets/img/lightning_1.png', 128 , 512);
		game.load.image('jiggly', 'public/assets/img/jigglyPuff.png');
		game.load.image('brick', 'public/assets/brick_tiles_1.png');
		game.load.audio('battle', ['public/assets/sounds/battle-sound.mp3', 'assets/sounds/battle-sound.ogg']);
		game.load.audio('shoot', ['public/assets/sounds/shoot.mp3','assets/sounds/shoot.ogg']);
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
		var platforms;
		var lives;
		var spawnTimer = 0;
		var numberOfLives = 3;
		var battleSound;
		var shootSound;
	
	function create(){// do something with the assest liek add it to the scene
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//sounds
		battleSound = game.add.audio('battle');
		battleSound.play();
		shootSound = game.add.audio('shoot');


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
		player = game.add.sprite(400, 345, 'pikachu');
		player.anchor.setTo(0.5, 0.5);
		game.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.collideWorldBounds = true;

		//create jiggly puff aka ball
		ball = game.add.sprite(400, 200, 'jiggly');
		game.physics.enable(ball, Phaser.Physics.ARCADE);
		ball.body.velocity.x = 130; 
		ball.body.velocity.y = -70;
		ball.body.collideWorldBounds = true;
		//  This sets the ball bounce energy for the horizontal  and vertical vectors (as an x,y point). "1" is 100% energy return
		ball.body.bounce.set(1);
		ball.body.bounce.setTo(0.9, 0.9);
	
		//create lives bar	
		lives = game.add.group();
		game.add.text(game.world.width - 100, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });

			//  Text
		stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '60px Arial', fill: '#fff' });
		stateText.anchor.setTo(0.5, 0.5);
		stateText.visible = false;

		//set lives
		for (var i = 0; i < numberOfLives; i++) 
		{
			var lifeBar = lives.create(game.world.width - 100 + (40 * i), 60, 'pikachu');
			lifeBar.anchor.setTo(0.5, 0.5);
			lifeBar.alpha = 0.7;
		}

		 //  And some controls to play the game with
		cursors = game.input.keyboard.createCursorKeys();
		fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	   
	}

	function update(){//things to do on each tick
		// if (player.alive){

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
				ball.body.velocity.y += 20;
			}
			if(secondBall && secondBall.body){
				secondBall.body.velocity.y += 20;
			}
			if(secondBall2 && secondBall2.body){
				secondBall2.body.velocity.y += 20;
			}
			gravityTimer = game.time.totalElapsedSeconds() + 0.2;
		}
		//  Firing

		if (fireButton.isDown && game.time.totalElapsedSeconds() > nextFire)
		{
			fireBullet();
			nextFire = game.time.totalElapsedSeconds() + 0.5;

		}
		//bullet hits ball collisions
		game.physics.arcade.overlap(bullets, ball, collisionHandler, null, this);
		game.physics.arcade.overlap(bullets, secondBall, secondCollision, null, this);
		game.physics.arcade.overlap(bullets, secondBall2, secondCollision, null, this);

		//ball hits player collisions
		game.physics.arcade.overlap(player, ball, ballHitsPlayer, null, this);
		game.physics.arcade.overlap(player, secondBall, ballHitsPlayer, null, this);
		game.physics.arcade.overlap(player, secondBall2, ballHitsPlayer, null, this);
		game.physics.arcade.collide(player, ball);

		//ball hits ground collisions (manually set gravity each time)
		game.physics.arcade.collide(platforms, ball, ballHitsFloor, null, this);
		game.physics.arcade.collide(platforms, secondBall, ballHitsFloor, null, this);
		game.physics.arcade.collide(platforms, secondBall2, ballHitsFloor, null, this);
	}
	function collisionHandler(a, b) {
		
		var position = ball.body;
		a.destroy();
		secondBall = game.add.sprite(position.x + 100, position.y, 'jiggly');
		game.physics.arcade.enable(secondBall);
		secondBall.body.collideWorldBounds = true;
		secondBall.body.velocity.x = 100;
		secondBall.body.velocity.y = -50;
		secondBall.body.bounce.set(1);

		secondBall2 = game.add.sprite(position.x -100, position.y, 'jiggly');
		game.physics.arcade.enable(secondBall2);
		secondBall2.body.collideWorldBounds = true;
		secondBall2.body.velocity.x = -150;
		secondBall2.body.velocity.y = -50;
		secondBall2.body.bounce.set(1);
		

		b.destroy();
	
	}
	function secondCollision(d,e){
		e.kill();
		d.kill();

		checkForWin();

		//the "click to restart" handler
		game.input.onTap.addOnce(restart,this);
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
	function ballHitsPlayer (playerObj, ballObj) {
	

	live = lives.getFirstAlive();

	if (live)
	{
		//takes away one life if hit and start the level again with adjust life
		live.kill();
		killAllBalls();
		//the "click to restart" handler
		game.input.onTap.addOnce(unpause,this);
		restartLevel();
	}

	// When the player dies
	if (numberOfLives < 1)
	{
		playerObj.kill();
		killAllBalls();
	   

		stateText.text=" GAME OVER \n Click to restart";
		stateText.visible = true;

		//the "click to restart" handler
		game.input.onTap.addOnce(restart,this);
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
				shootSound.play();
				bullet.play('thunder');
				bullet.reset(player.x, 600);
				bullet.body.velocity.y = -900;
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

	function restart() {
		
		//resets the life count
		lives.callAll('revive');
		//revives the player
		player.revive();
		//hides the text
		numberOfLives = 3;
		stateText.visible = false;
		ball = game.add.sprite(400, 200, 'jiggly');
		game.physics.enable(ball, Phaser.Physics.ARCADE);
		ball.body.velocity.x = 100;
		ball.body.velocity.y = -100;
		ball.body.collideWorldBounds = true;
		ball.body.bounce.set(1);
		

	}
	function restartLevel(){
		numberOfLives = numberOfLives - 1;
		stateText.text=" Ouch Try Again \n Click to restart";
		stateText.visible = true;
		game.paused = true;
		ball = game.add.sprite(400, 200, 'jiggly');
		game.physics.enable(ball, Phaser.Physics.ARCADE);
		ball.body.velocity.x = 100;
		ball.body.velocity.y = - 100;
		ball.body.collideWorldBounds = true;
		ball.body.bounce.set(1);

		
	}
	function unpause(){
		game.paused = false;
		stateText.visible = false;
	}

	function killAllBalls() {
		if (ball){
			ball.kill(); 
		} 
		if(secondBall){
			secondBall.kill();
		}
		if(secondBall2){
			secondBall2.kill();
		}
	}
	function checkForWin(){
		if(!ball.alive && !secondBall.alive && !secondBall2.alive){
			stateText.text=" YOU WIN! \n Click to restart";
			stateText.visible = true;
		}
	}































	