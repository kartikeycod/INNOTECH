// Variables for Breathing Exercise
let timer;
let currentStep = 0;
let isRunning = false;
const steps = [
    { instruction: "Inhale...", time: 4, targetScale: 4 },   // Inhale to 4x size
    { instruction: "Hold...", time: 7, targetScale: 4 },     // Hold at 4x size
    { instruction: "Exhale...", time: 8, targetScale: 1 }    // Exhale to 1x size
];

const instructionElement = document.getElementById("instruction");
const timerElement = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

startBtn.addEventListener("click", startExercise);
stopBtn.addEventListener("click", stopExercise);

// Matter.js Setup
const canvas = document.getElementById('breathingCanvas');
const engine = Matter.Engine.create();
const render = Matter.Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: '#e0f7fa',
        wireframes: false
    }
});

// Disable Gravity
engine.gravity.y = 0;

Matter.Render.run(render);
Matter.Engine.run(engine);

let bubbles = [];
for (let i = 0; i < 8; i++) {
    const bubble = Matter.Bodies.circle(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 30, {
        restitution: 0.9,
        frictionAir: 0.02,
        render: {
            fillStyle: '#4dd0e1'
        }
    });
    bubbles.push(bubble);
}
Matter.World.add(engine.world, bubbles);

// Add screen boundaries to prevent bubbles from moving out of the screen
const boundaries = [
    Matter.Bodies.rectangle(window.innerWidth / 2, -10, window.innerWidth, 20, { isStatic: true }),
    Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 10, window.innerWidth, 20, { isStatic: true }),
    Matter.Bodies.rectangle(-10, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true }),
    Matter.Bodies.rectangle(window.innerWidth + 10, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true })
];
Matter.World.add(engine.world, boundaries);

let targetScale = 1;
let currentScale = 1;
let scaleDuration = 4000; // Default duration for scaling (in milliseconds)
let startTime;

// Function to smoothly adjust bubble size
function smoothScaleBubbles() {
    if (!isRunning) return;

    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / scaleDuration, 1);
    const newScale = currentScale + (targetScale - currentScale) * easeInOutQuad(progress);

    bubbles.forEach(bubble => {
        const scaleFactor = newScale / bubble.circleRadius;
        Matter.Body.scale(bubble, scaleFactor, scaleFactor);
        bubble.circleRadius = newScale;
    });

    if (progress < 1) {
        requestAnimationFrame(smoothScaleBubbles);
    }
}

// Easing Function for Smooth Scaling
function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Cursor Interaction: Make bubbles run away from the cursor smoothly
canvas.addEventListener('mousemove', (event) => {
    const mousePosition = { x: event.clientX, y: event.clientY };

    bubbles.forEach(bubble => {
        const distance = Matter.Vector.magnitude(Matter.Vector.sub(bubble.position, mousePosition));

        // If the cursor is within 100px of the bubble, apply a force to move it away
        if (distance < 100) {
            const forceMagnitude = (100 - distance) / 5000; // Dynamic force based on distance
            const forceDirection = Matter.Vector.normalise(Matter.Vector.sub(bubble.position, mousePosition));
            Matter.Body.applyForce(bubble, bubble.position, {
                x: forceDirection.x * forceMagnitude,
                y: forceDirection.y * forceMagnitude
            });
        }
    });
});

// Random floating movement to keep bubbles lively
function applyRandomForces() {
    bubbles.forEach(bubble => {
        const forceMagnitude = 0.0005; // Small floating force
        Matter.Body.applyForce(bubble, bubble.position, {
            x: (Math.random() - 0.5) * forceMagnitude,
            y: (Math.random() - 0.5) * forceMagnitude
        });
    });
}
setInterval(applyRandomForces, 1000);

// Breathing Exercise Logic
function startExercise() {
    if (!isRunning) {
        isRunning = true;
        currentStep = 0;
        startBtn.style.display = "none";
        stopBtn.style.display = "inline-block";
        nextStep();
    }
}

function stopExercise() {
    isRunning = false;
    clearInterval(timer);
    instructionElement.textContent = "Exercise stopped";
    startBtn.style.display = "inline-block";
    stopBtn.style.display = "none";
}

function nextStep() {
    if (currentStep >= steps.length) currentStep = 0;

    const step = steps[currentStep];
    instructionElement.textContent = step.instruction;
    timerElement.textContent = step.time;

    // Update target scale based on step (Inhale, Hold, Exhale)
    currentScale = bubbles[0].circleRadius;
    targetScale = step.targetScale * 30;
    scaleDuration = step.time * 1000;
    startTime = Date.now();

    smoothScaleBubbles();

    let timeLeft = step.time;
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            currentStep++;
            nextStep();
        }
    }, 1000);
}
