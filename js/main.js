var game = new Phaser.Game(800, 600, Phaser.AUTO);

	var gameState = {
		preload: function() { //load assets
			this.load.image('background','assets/img/space-background.jpg');
			// this.game.load.atlasJSONhash('pikachu', )	
			this.load.image('pikachu', 'assets/img/pikachu.gif');	

		},
		create: function(){// do something with the assest liek add it to the scene
			this.background = this.game.add.sprite(0, 0, 'background');
			this.pikachu = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'pikachu');
			this.pikachu.scale.setTo(2);
		},	
		update: function(){//things to do on each tick

		}
	};
	game.state.add('gameState', gameState);
	game.state.start('gameState');

	console.log("working");
	