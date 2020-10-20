// Only want contents of the file to load after all html has been loaded
document.addEventListener('DOMContentLoaded', () => {
	const grid = document.querySelector('.grid');
	const jumper = document.createElement('div');

	let jumperLeftSpace = 50;
	let jumperBottomSpace = 150;
	let isGameOver = false;
	let platformCount = 5;
	let platforms = [];
	let upTimerID;
	let downTimerID;

	function createJumper() {
		grid.appendChild(jumper);
		jumper.classList.add('jumper');
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
		upTimerID = setInterval(function(){
			jumperBottomSpace += 20;
			jumper.style.bottom = jumperBottomSpace + 'px';
			if(jumperBottomSpace > 350){
				fall();
			}
		}, 30)
	}

	function fall(){
		clearInterval(upTimerID);
		downTimerID = setInterval(function(){
			jumperBottomSpace -= 5;
			jumper.style.bottom = jumperBottomSpace + 'px'
		},30)
	}
	

	function movePlatforms(){
		if(jumperBottomSpace > 200){
			platforms.forEach(platform => {
				// moves the platfrom down
				platform.bottom -=4;
				let visual = platform.visual;
				visual.style.bottom = platform.bottom + 'px';

			})
		}
	}

	function start(){
		if(isGameOver == false){
			createJumper();
			createPlatforms();
			setInterval(movePlatforms, 30);
			jump();
		}
	}

	// attatch a button
	start();
})