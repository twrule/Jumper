// Only want contents of the file to load after all html has been loaded
document.addEventListener('DOMContentLoaded', () => {
	const grid = document.querySelector('.grid');
	const jumper = document.createElement('div');

	let jumperLeftSpace = 50;
	let startPoint = 150
	let jumperBottomSpace = startPoint;
	let isGameOver = false;
	let platformCount = 5;
	let platforms = [];
	let upTimerID;
	let downTimerID;
	let isJumping = true;
	let isGoingLeft = false;
	let isGoingRight = true;
	let leftTimerID;
	let rightTimerID;
	let score = 0;

	function createJumper() {
		grid.appendChild(jumper);
		jumper.classList.add('jumper');
		// Add 12 to center jumper(60px) on platform(85px)
		jumperLeftSpace = platforms[0].left + 12;
		jumper.style.left = jumperLeftSpace + 'px';
		jumper.style.bottom = jumperBottomSpace + 'px';
	}

	class Platform{
		constructor(newPlatformBottom){
			this.bottom = newPlatformBottom;
			this.left = Math.random() * 315;
			this.visual = document.createElement('div');

			const visual = this.visual;
			visual.classList.add('platform');
			visual.style.left = this.left + 'px';
			visual.style.bottom = this.bottom + 'px';

			grid.appendChild(visual);		
		}
	}

	function createPlatforms(){
		for(let i = 0; i < platformCount; i++) {
			// 600 is the grid height, space between each platform
			let platformGap = 600 / platformCount;
			// platform space from bottom
			let newPlatformBottom = 100 + i * platformGap;
			let newPlatform = new Platform(newPlatformBottom);
			platforms.push(newPlatform);
		}
	}

	function jump(){
		clearInterval(downTimerID);
		isJumping = true;
		upTimerID = setInterval(function(){
			jumperBottomSpace += 20;
			jumper.style.bottom = jumperBottomSpace + 'px';
			if(jumperBottomSpace > startPoint + 200){
				fall();
			}
		}, 30)
	}

	function fall(){
		clearInterval(upTimerID);
		isJumping = false;
		downTimerID = setInterval(function(){
			jumperBottomSpace -= 5;
			jumper.style.bottom = jumperBottomSpace + 'px';

			if(jumperBottomSpace <= 0){
				gameOver();		
			}

			platforms.forEach(platform => {
				if(
					(jumperBottomSpace >= platform.bottom) &&
					(jumperBottomSpace <= platform.bottom + 15) &&
					((jumperLeftSpace + 60) >= platform.left) &&
					(jumperLeftSpace <= (platform.left + 85)) &&
					isJumping == false
				){
					startPoint = jumperBottomSpace;
					jump();
				}
			})
		}, 30);
	}
	
	function gameOver(){
		isGameOver = true;
		while(grid.firstChild){
			grid.removeChild(grid.firstChild);
		}
		grid.innerHTML = score;
		clearInterval(upTimerID);
		clearInterval(downTimerID);
		clearInterval(leftTimerID);
		clearInterval(rightTimerID);
	}

	function movePlatforms(){
		if(jumperBottomSpace > 200){
			platforms.forEach(platform => {
				// moves the platfrom down
				platform.bottom -=4;
				let visual = platform.visual;
				visual.style.bottom = platform.bottom + 'px';

				if(platform.bottom < 10){
					let firstPlatform = platforms[0].visual;
					firstPlatform.classList.remove('platform');
					platforms.shift();

					// 600 is hardcode top of grids
					let newPlatform = new Platform(600);
					platforms.push(newPlatform);
					score++;
				}
			})
		}
	}

	function control(e){
		if(e.key === "j" || e.key === "ArrowLeft"){
			moveLeft();
		}
		else if(e.key === "l" || e.key === "ArrowRight"){
			moveRight();
		}
		else if(e.key === "k" || e.key === "ArrowUp"){
			moveStraight();
		}
	}

	function moveLeft(){
		if(isGoingRight){
			clearInterval(rightTimerID);
			isGoingRight = false;
		}
		isGoingLeft = true;
		leftTimerID = setInterval(function(){
			if(jumperLeftSpace >= 0){
				jumperLeftSpace -= 5;
				jumper.style.left = jumperLeftSpace + 'px';
			}
			else moveRight();
			
		}, 30)
	}

	function moveRight(){
		if(isGoingRight){
			clearInterval(leftTimerID);
			isGoingLeft = false;
		}
		isGoingRight = true;
		rightTimerID = setInterval(function() {
			if(jumperLeftSpace <= 340){
				jumperLeftSpace += 5;
				jumper.style.left = jumperLeftSpace + 'px';
			}
			else moveLeft();
		}, 30)
	}

	function moveStraight(){
		isGoingRight = false;
		isGoingLeft = false;
		clearInterval(rightTimerID);
		clearInterval(leftTimerID);
	}

	function start(){
		if(isGameOver == false){
			createPlatforms();
			createJumper();
			setInterval(movePlatforms, 30);
			jump();
			document.addEventListener('keyup', control);
		}
	}

	// attatch a button
	start();
})