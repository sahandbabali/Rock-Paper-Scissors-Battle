
let gameElements = [];


let rock, paper, scissors


function preload() {
    // Load the images
    rock = loadImage('img/rock.png');
    paper = loadImage('img/paper.png');
    scissors = loadImage('img/scissors.png');
}

function setup() {
    // Get the div element with id "canvasbox"
    const canvasBox = document.getElementById('canvasbox');

    // Calculate the maximum width and height based on the parent div's dimensions
    const maxWidth = canvasBox.clientWidth;
    const maxHeight = canvasBox.clientHeight;

    // Create a p5.js canvas with the maximum dimensions
    let canvas = createCanvas(maxWidth, maxHeight);
    canvas.parent("canvasbox"); // Attach the canvas to the div



    // frameRate(25)



    // Create 30 rocks, 30 papers, and 30 scissors
    for (let i = 0; i < 60; i++) {
        gameElements.push(new GameElement(random(width), random(height), random(-1, 1), random(-1, 1), "rock", rock));
        gameElements.push(new GameElement(random(width), random(height), random(-1, 1), random(-1, 1), "paper", paper));
        gameElements.push(new GameElement(random(width), random(height), random(-1, 1), random(-1, 1), "scissors", scissors));
    }




}

function draw() {
    background(256);
    // Update and display the game elements
    for (let i = 0; i < gameElements.length; i++) {
        gameElements[i].update();
        gameElements[i].display();
    }

    // Check for collisions and update scores
    for (let i = 0; i < gameElements.length; i++) {
        for (let j = i + 1; j < gameElements.length; j++) {
            if (gameElements[i].collidesWith(gameElements[j])) {
                // Handle collisions
                handleCollision(gameElements[i], gameElements[j]);
            }
        }
    }



}
function canDefeat(type1, type2) {
    // Define the rules of the game here
    return (type1 === "rock" && type2 === "scissors") ||
        (type1 === "paper" && type2 === "rock") ||
        (type1 === "scissors" && type2 === "paper");
}


function handleCollision(element1, element2) {
    if (canDefeat(element1.type, element2.type)) {
        // Element1 wins, Element2 loses
        element2.changeTypeAndImage(element1.type, element1.image);

    } else {
        // Element2 wins, Element1 loses
        element1.changeTypeAndImage(element2.type, element2.image);

    }
}



class GameElement {
    constructor(x, y, speedX, speedY, type, image) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.type = type;
        this.size = 25; // Adjust this for your elements' size
        this.image = image;

    }
    update() {
        // Find the nearest target that can be defeated
        let nearestTarget = null;
        let nearestDistance = Infinity;

        for (let i = 0; i < gameElements.length; i++) {
            const target = gameElements[i];

            if (target !== this && canDefeat(this.type, target.type)) {
                const d = dist(this.x, this.y, target.x, target.y);
                if (d < nearestDistance) {
                    nearestDistance = d;
                    nearestTarget = target;
                }
            }
        }

        // Move towards the nearest target
        if (nearestTarget) {
            const angle = atan2(nearestTarget.y - this.y, nearestTarget.x - this.x);
            this.speedX = cos(angle);
            this.speedY = sin(angle);
        }

        // Add a little randomness to the movement
        const randomness = 5; // Adjust the level of randomness
        this.speedX += random(-randomness, randomness);
        this.speedY += random(-randomness, randomness);

        // Normalize the speed to maintain a constant speed
        const speedMagnitude = sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
        this.speedX /= speedMagnitude;
        this.speedY /= speedMagnitude;

        // Update position based on speed
        this.x += this.speedX * 2; // Adjust speed here
        this.y += this.speedY * 2; // Adjust speed here

        // Bounce back when hitting the canvas boundaries
        if (this.x - this.size / 2 < 0 || this.x + this.size / 2 > width) {
            this.speedX *= -1;
        }
        if (this.y - this.size / 2 < 0 || this.y + this.size / 2 > height) {
            this.speedY *= -1;
        }
    }

    display() {
        image(this.image, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);

    }

    collidesWith(otherElement) {
        // Calculate the distance between centers of two elements
        const d = dist(this.x, this.y, otherElement.x, otherElement.y);
        // Check if they collide based on their sizes
        return d < this.size / 2 + otherElement.size / 2;
    }

    changeTypeAndImage(newType, newImage) {
        this.type = newType;
        this.image = newImage;
    }
}