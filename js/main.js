var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update});

	function preload() { //load assets
		game.load.image('background','assets/img/space-background.jpg');	
		game.load.image('pikachu', 'assets/img/pikachu.gif');	


		var playingField;
		var player;
	}
	function create(){// do something with the assest liek add it to the scene
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//playing feild background image
   		playingField = game.add.image(0, 0, 'background');

   		//create pikachu character
		player = game.add.sprite(400, 500, 'pikachu');
    		player.anchor.setTo(0.5, 0.5);
    		game.physics.enable(player, Phaser.Physics.ARCADE);

    	 //  And some controls to play the game with
    	cursors = game.input.keyboard.createCursorKeys();
    	fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	}
	function update(){//things to do on each tick

	}


	