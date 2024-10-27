const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const ground = new Image();
ground.src = "./images/ground.png";

const appleImg = new Image();
appleImg.src = "./images/apple.png"; // Загрузите изображение яблока

const foodImg = new Image();
foodImg.src = "./images/food.png";

let box = 32;
let appleBox = 16; // Размер яблока
let score = 0;

let food = {
	x: Math.floor(Math.random() * 17 + 1) * box,
	y: Math.floor(Math.random() * 15 + 3) * box,
};

let apple = {
	x: Math.floor(Math.random() * 17 + 1) * box,
	y: Math.floor(Math.random() * 15 + 3) * box,
};

let snake = [];
snake[0] = {
	x: 9 * box,
	y: 10 * box,
};

let dir;

function direction(e) {
	if (e.keyCode === 37 && dir !== "right") dir = "left";
	else if (e.keyCode === 38 && dir !== "down") dir = "up";
	else if (e.keyCode === 39 && dir !== "left") dir = "right";
	else if (e.keyCode === 40 && dir !== "up") dir = "down";
}
document.addEventListener("keydown", direction);

function eatTail(head, arr) {
	for (let i = 0; i < arr.length; i++) {
		if (head.x === arr[i].x && head.y === arr[i].y) {
			clearInterval(game);
			setModal();
		}
	}
}

function setModal() {
	const div = document.createElement("div");
	div.setAttribute("class", "modal");
	div.innerHTML = `
        <h1>Game Over</h1>
        <span>Score: ${score}</span>
        <button id="btn_reset">Restart</button>
    `;
	document.body.style.background = "rgba(0,0,0, 0.5)";
	document.body.appendChild(div);

	document.getElementById('btn_reset').onclick = () => restartGame();
}

function drawGame() {
	ctx.drawImage(ground, 0, 0);
	ctx.drawImage(foodImg, food.x, food.y);
	ctx.drawImage(appleImg, apple.x, apple.y, appleBox, appleBox); // Измените размер яблока

	for (let i = 0; i < snake.length; i++) {
		ctx.fillStyle = i === 0 ? 'green' : 'red';
		ctx.fillRect(snake[i].x, snake[i].y, box, box);
	}
	ctx.fillStyle = "white";
	ctx.font = "50px Arial";
	ctx.fillText(score, box * 2.5, box * 1.7);

	let snakeY = snake[0].y;
	let snakeX = snake[0].x;

	if (snakeX === food.x && snakeY === food.y) {
		score++;
		food = {
			x: Math.floor(Math.random() * 17 + 1) * box,
			y: Math.floor(Math.random() * 15 + 3) * box,
		};
	} else if (snakeX === apple.x && snakeY === apple.y) { // Проверка на столкновение с яблоком
		score += 1; // Увеличиваем счет на 5
		// Генерируем новое яблоко, которое не перекрывается со змеёй
		do {
			apple.x = Math.floor(Math.random() * 17 + 1) * box;
			apple.y = Math.floor(Math.random() * 15 + 3) * box;
		} while (snake.some(segment => segment.x === apple.x && segment.y === apple.y));
	} else {
		snake.pop();
	}

	if (snakeX < box || snakeX > box * 17 || snakeY < 3 * box || snakeY > box * 17) {
		clearInterval(game);
		setModal();
	}

	if (dir === "left") snakeX -= box;
	if (dir === "right") snakeX += box;
	if (dir === "up") snakeY -= box;
	if (dir === "down") snakeY += box;

	let newHead = {
		x: snakeX,
		y: snakeY,
	};
	eatTail(newHead, snake);
	snake.unshift(newHead);
}

function restartGame() {
	score = 0;
	snake = [{ x: 9 * box, y: 10 * box }];
	dir = undefined;
	food = {
		x: Math.floor(Math.random() * 17 + 1) * box,
		y: Math.floor(Math.random() * 15 + 3) * box,
	};
	// Генерируем новое яблоко при перезапуске
	do {
		apple.x = Math.floor(Math.random() * 17 + 1) * box;
		apple.y = Math.floor(Math.random() * 15 + 3) * box;
	} while (snake.some(segment => segment.x === apple.x && segment.y === apple.y));

	document.body.style.background = "";
	document.querySelector('.modal').remove();
	game = setInterval(drawGame, 150);
}

let game = setInterval(drawGame, 150);
