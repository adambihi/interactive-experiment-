// Declare global variables for the game
let box, filter, osc, score = 0; // Box size, audio filter, oscillator, and score tracker
let activeBox = null; // Tracks the current active box (the one to click)
let gameOver = false; // Tracks if the game is over
let timer = 30;
let timerInterval = 20;

// Frequency scale for sound feedback
const scale = [261.63, 329.63, 392.0, 523.25]; // Four notes: C4, E4, G4, C5

function setup() {
  createCanvas(800,600 ); // Create a 600x400 canvas
  filter = new p5.LowPass(); // Create a low-pass filter
  filter.freq(800); // Set the filter frequency to 800 Hz
  filter.res(15); // Set the filter resonance to 15

  osc = new p5.Oscillator("sine"); // Create a sine wave oscillator
  osc.disconnect(); // Disconnect it from the default sound output
  osc.connect(filter); // Route it through the low-pass filter

  box = width / 8; // Define the size of each box (8 columns across the canvas)
  textSize(24); // Set text size for score and game over display
  textAlign(CENTER, CENTER); // Center-align text horizontally and vertically

  startGame(); // Initialize the game state
}

// Start or reset the game
function startGame() {
  score = 0; // Reset the score
  timer = 30;
  gameOver = false; // Reset the game over state
  spawnActiveBox(); // Spawn the first active box


clearInterval(timerInterval);


timerInterval = setInterval(() => {
  timer--;
  if(timer <= 0){
    gameOver = true;
    clearInterval(timerInterval);
  }
},1000);
}

// Spawn a new active box at a random position
function spawnActiveBox() {
  let x = floor(random(8)); // Randomly select a column (0 to 7)
  let y = floor(random(5)); // Randomly select a row (0 to 4)
  activeBox = { x, y }; // Store the position of the active box
}

function draw() {
  background(200); // Set the background to light gray

  // Check if the game is over
  if (gameOver) { 
    displayGameOver(); // Display the game over screen
    return; // Stop further drawing
  }

  // Draw the grid and highlight the active box
  for (let x = 0; x < 8; x++) { // Loop through 8 columns
    for (let y = 0; y < 5; y++) { // Loop through 5 rows
      fill(140,40,230); // Set the default fill color to white
      if (activeBox && activeBox.x === x && activeBox.y === y) {
        fill(0, 0, 255); // Highlight the active box in green
      }
      stroke(0); // Set the stroke color to black
      rect(x * box, y * box, box, box); // Draw each grid box
    }
  }

  // Display the current score
  fill(0); // Set text color to black
  noStroke(); // Disable strokes for text
  text(`Score: ${score}`, width / 1.5, height - 30); // Display the score at the bottom of the screen
  text(`Timer: ${timer}`, width / 4, height - 30);
}

// Handle mouse clicks to interact with the active box
function mousePressed() {
  if (activeBox) {
    let clickedX = floor(mouseX / box); // Determine the column clicked
    let clickedY = floor(mouseY / box); // Determine the row clicked

    if (clickedX === activeBox.x && clickedY === activeBox.y) {
      playNote(); // Play a sound feedback for correct click
      score++; // Increase the score
      spawnActiveBox(); // Spawn a new active box
    }
  }
}

// Play a sound when the correct box is clicked
function playNote() {
  osc.freq(random(scale)); // Play a random note from the scale
  osc.start(); // Start the oscillator
  osc.amp(0.5, 0.1); // Quickly ramp up the amplitude
  osc.amp(0, 0.2); // Gradually fade out the sound
}

// Display the game over screen
function displayGameOver() {
  background(144, 238, 144); // Set the background to dark red
  fill(255); // Set the text color to white
  text("Game is Over", width / 2, height / 2 - 20); // Display "Game Over" message
  text(` Score: ${score}`, width / 2, height / 2 + 20); // Display the final score
  text("Click to Restart", width / 2, height / 2 + 60); // Prompt the player to restart
}


function keyPressed() {
  if (gameOver) {
    startGame(); // Restart the game if it is over
    return; // Exit the function
  }
}