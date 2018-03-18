window.addEventListener('load', () => {
	let canvas = document.getElementById('canvas');
	if (!canvas.getContext) return; // if canvas unsupported don't proceed
	
	Apple.init(canvas);
	Snake.init(canvas);
	
});

let Snake = {
	
	ctx: null,
	step: 25,
	pxSize: 25,
	pos: [ { x: 25*4, y: 25*5 },
				 { x: 25*4, y: 25*6 },
				 { x: 25*4, y: 25*7 } ],
	direction: 'up',
	paused: false,
	gameOver: false,
	intervalID: null,
	score: 0,
	scoreText: document.getElementById('score'),
	spawnApple: false,
	canvasContainer: document.getElementById('canvas-container'),
	
	init: (canvas) => {
		Snake.ctx = canvas.getContext('2d');
		Snake.ctx.fillStyle = 'rgb(0, 20, 200)';
		Snake.ctx.fillRect(Snake.pos[0].x, Snake.pos[0].y, Snake.pxSize, Snake.pxSize);
		Snake.ctx.fillRect(Snake.pos[1].x, Snake.pos[1].y, Snake.pxSize, Snake.pxSize);
		Snake.ctx.fillRect(Snake.pos[2].x, Snake.pos[2].y, Snake.pxSize, Snake.pxSize);
		Snake.intervalID = setInterval(Snake.move, 100);
	},
	
	move: () => {
		let headPosX = Snake.pos[0].x;
		let headPosY = Snake.pos[0].y;
		
		Snake.ctx.clearRect(Snake.pos[Snake.pos.length-1].x, Snake.pos[Snake.pos.length-1].y, Snake.pxSize, Snake.pxSize);
		Snake.pos.pop();
		
		switch(Snake.direction) {
		
			case 'up':
				headPosY -= Snake.step;
				if (headPosY < 0) {
					headPosY = Snake.ctx.canvas.height - Snake.pxSize;
				}
				break;
			
			case 'down':
				headPosY += Snake.step;
				if (headPosY >= Snake.ctx.canvas.height) {
					headPosY = 0;
				}
				break;
				
			case 'left':
				headPosX -= Snake.step;
				if (headPosX < 0) {
					headPosX = Snake.ctx.canvas.width - Snake.pxSize;
				}
				break;
				
			case 'right':
				headPosX += Snake.step;
				if (headPosX >= Snake.ctx.canvas.width) {
					headPosX = 0;
				}
				break;
				
		}
		
		for (let i = 0; i < Snake.pos.length; i++) {
			if (headPosX == Snake.pos[i].x && headPosY == Snake.pos[i].y) {
				clearInterval(Snake.intervalID);
				Snake.canvasContainer.classList.add('game-over');
				Snake.gameOver = true;
				setTimeout(() => { document.addEventListener('keyup', () => {location.reload()}) }, 500);
			}
		}
		
		if (headPosX == Apple.pos.x && headPosY == Apple.pos.y) {
			console.log('+1 apple');
			Snake.score++;
			Snake.scoreText.innerHTML = Snake.score;
			Snake.pos.unshift({x: headPosX, y: headPosY });
			Snake.ctx.fillRect(Snake.pos[0].x, Snake.pos[0].y, Snake.pxSize, Snake.pxSize);
			
			//If apple was eaten extend snake length with repeating last operation one more time
			
			// need to check for negative values too. Because if apple was near the wall next snake section appears with negative
			// position in direction of movement
			switch(Snake.direction) {
		
				case 'up':
					headPosY -= Snake.step;
					if (headPosY < 0) {
						headPosY = Snake.ctx.canvas.height - Snake.pxSize;
					}
					break;
				
				case 'down':
					headPosY += Snake.step;
					if (headPosY >= Snake.ctx.canvas.height) {
						headPosY = 0;
					}
					break;
					
				case 'left':
					headPosX -= Snake.step;
					if (headPosX < 0) {
						headPosX = Snake.ctx.canvas.width - Snake.pxSize;
					}
					break;
					
				case 'right':
					headPosX += Snake.step;
					if (headPosX >= Snake.ctx.canvas.width) {
						headPosX = 0;
					}
					break;
					
			}
			Snake.spawnApple = true;
		}
		
		Snake.pos.unshift({x: headPosX, y: headPosY });
		console.log('New head: x=' + headPosX + ' y=' + headPosY);
		Snake.ctx.fillRect(Snake.pos[0].x, Snake.pos[0].y, Snake.pxSize, Snake.pxSize);
		if (Snake.spawnApple) {
			Apple.spawn(false);
			Snake.spawnApple = false;
		}
		if (Snake.pos[0].x < 0 || Snake.pos[0].x >= 300) console.log('Something wrong: moving ' + Snake.direction + ': ', Snake.pos[0]);
		if (Snake.pos[0].y < 0 || Snake.pos[0].y >= 300) console.log('Something wrong: moving ' + Snake.direction + ': ', Snake.pos[0]);
		
	},
	
};

let Apple = {

	ctx: null,
	pos: null,
	
	init: (canvas) => {
		Apple.ctx = canvas.getContext('2d');
		Apple.spawn(true);
	},
	
	spawn: (initial) => {
		if (initial) {
			Apple.pos = {x: 25*6, y:25*8};
		} else {
				let overlaps;
				do {
					overlaps = 0;
					Apple.pos.x = Math.floor( Math.random() * (Apple.ctx.canvas.width / 25 - 1) ) * 25;
					Apple.pos.y = Math.floor( Math.random() * (Apple.ctx.canvas.height / 25 - 1) ) * 25;
					for(let i = 0; i < Snake.pos.length; i++) {
						if (Apple.pos.x == Snake.pos[i].x && Apple.pos.y == Snake.pos[i].y) overlaps++;
					}
					console.log(overlaps);
				} while (overlaps != 0);
		}
		console.log('Apple spawned at: x=' + Apple.pos.x + ' y=' + Apple.pos.y);
		Apple.ctx.fillStyle = 'rgb(200, 20, 0)';
		console.log(Apple.ctx.fillRect(Apple.pos.x, Apple.pos.y, Snake.pxSize, Snake.pxSize));
		Apple.ctx.fillStyle = 'rgb(0, 20, 200)';
	},

};

document.addEventListener('keydown', (event) => {
	let key = event.key;
	switch(key) {
		case 'w':
		case 'ArrowUp':
			if(Snake.direction != 'down') Snake.direction = 'up';
			break;
		case's':
		case 'ArrowDown':
			if(Snake.direction != 'up') Snake.direction = 'down';
			break;
		case 'a':	
		case 'ArrowLeft':
			if(Snake.direction != 'right') Snake.direction = 'left';
			break;
		case 'd':
		case 'ArrowRight':
			if(Snake.direction != 'left') Snake.direction = 'right';
			break;
		case ' ':
		case 'p':
			if (Snake.paused && !Snake.gameOver) {
				Snake.intervalID = setInterval(Snake.move, 100);
				console.log('Game resumed');
				Snake.paused = false;
			} else {
					clearInterval(Snake.intervalID);
					console.log('Game paused');
					Snake.paused = true;
				}
			break;
	}
});

//~ document.getElementById('up').addEventListener('click', (event) => {
	//~ if(Snake.direction != 'down') Snake.direction = 'up';
//~ });

//~ document.getElementById('down').addEventListener('click', (event) => {
	//~ if(Snake.direction != 'up') Snake.direction = 'down';
//~ });

//~ document.getElementById('left').addEventListener('click', (event) => {
	//~ if(Snake.direction != 'right') Snake.direction = 'left';
//~ });

//~ document.getElementById('right').addEventListener('click', (event) => {
	//~ if(Snake.direction != 'left') Snake.direction = 'right';
//~ });
