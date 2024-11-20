// Three.js Background Effect with Circular Neon Particles and Click Interaction
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('three-bg').appendChild(renderer.domElement);

// Create Geometry and Colors for Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount * 3);
const colorsArray = new Float32Array(particlesCount * 3);
const initialPositions = [];

for (let i = 0; i < particlesCount; i++) {
    // Set particle positions randomly
    const x = (Math.random() - 0.5) * 20;
    const y = (Math.random() - 0.5) * 20;
    const z = (Math.random() - 0.5) * 20;
    posArray[i * 3] = x;
    posArray[i * 3 + 1] = y;
    posArray[i * 3 + 2] = z;
    initialPositions.push({ x, y, z });

    // Set random colors for neon glow
    colorsArray[i * 3] = Math.random();     // Red
    colorsArray[i * 3 + 1] = Math.random(); // Green
    colorsArray[i * 3 + 2] = Math.random(); // Blue
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

// Load a circular texture for particles (neon effect)
const textureLoader = new THREE.TextureLoader();
const circleTexture = textureLoader.load('https://threejs.org/examples/textures/sprites/disc.png'); // Circular texture

// Create Material for Particles with Neon Glow Effect
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    map: circleTexture,
    transparent: true,
    alphaTest: 0.5,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0.9,
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 10;

// Track Mouse Position
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

function onMouseClick(event) {
    // Normalize mouse coordinates between -1 and 1
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update raycaster with mouse position and camera
    raycaster.setFromCamera(mouse, camera);

    // Check if any particles are intersected by the ray
    const intersects = raycaster.intersectObject(particlesMesh);

    if (intersects.length > 0) {
        const { point } = intersects[0];
        const positions = particlesGeometry.attributes.position.array;

        // Loop through all particles and make them move away from the clicked point
        for (let i = 0; i < particlesCount; i++) {
            const dx = point.x - positions[i * 3];
            const dy = point.y - positions[i * 3 + 1];
            const dz = point.z - positions[i * 3 + 2];
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            // If particles are within a certain distance from the click, repel them
            if (distance < 2) { // Adjust this distance as needed
                const force = 0.1 / distance; // Adjust force as needed
                positions[i * 3] -= dx * force;
                positions[i * 3 + 1] -= dy * force;
                positions[i * 3 + 2] -= dz * force;
            }
        }
        particlesGeometry.attributes.position.needsUpdate = true;
    }
}

window.addEventListener('click', onMouseClick);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the particle system for a dynamic effect
    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.0005;

    // Gradually return particles to their initial positions
    const positions = particlesGeometry.attributes.position.array;
    for (let i = 0; i < particlesCount; i++) {
        positions[i * 3] += (initialPositions[i].x - positions[i * 3]) * 0.01;
        positions[i * 3 + 1] += (initialPositions[i].y - positions[i * 3 + 1]) * 0.01;
        positions[i * 3 + 2] += (initialPositions[i].z - positions[i * 3 + 2]) * 0.01;
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});



const questions = [
    { question: "How often do you feel sad or down?", options: ["Rarely", "Sometimes", "Often", "Always"], type: "radio" },
    { question: "How is your appetite lately?", options: ["Normal", "Increased", "Decreased"], type: "radio" },
    { question: "How often do you have trouble sleeping?", options: ["Almost never", "Occasionally", "Often", "Every night"], type: "radio" },
    { question: "Rate your energy level on a scale of 1 to 5.", options: ["1 (Very low)", "2 (Low)", "3 (Moderate)", "4 (High)", "5 (Very high)"], type: "radio" },
    { question: "Do you have negative thoughts that you can't control?", options: ["Never", "Sometimes", "Often", "Always"], type: "radio" },
    { question: "Do you feel anxious or worried frequently?", options: ["Never", "Sometimes", "Often", "Always"], type: "radio" },
    { question: "How often do you feel overwhelmed by your responsibilities?", options: ["Rarely", "Sometimes", "Often", "Always"], type: "radio" },
    { question: "Do you find it hard to concentrate on tasks?", options: ["Never", "Sometimes", "Often", "Always"], type: "radio" },
    { question: "Do you experience mood swings or irritability?", options: ["Rarely", "Sometimes", "Often", "Always"], type: "radio" },
    { question: "How do you feel about your overall mental well-being?", type: "text" }
];

function startQuiz() {
    document.querySelector(".container").classList.add("hidden");
    const quizForm = document.getElementById('quizForm');
    quizForm.innerHTML = '';
    questions.forEach((q, index) => {
        quizForm.innerHTML += `
            <div class="question-block">
                <label>${index + 1}. ${q.question}</label><br>
                ${q.type === "radio" 
                    ? q.options.map((opt, i) => `<input type="radio" name="q${index}" value="${i}" required> ${opt}<br>`).join('') 
                    : `<textarea rows="4" name="q${index}" required></textarea>`}
            </div>
            <hr>
        `;
    });
    document.getElementById('quiz').classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function submitQuiz() {
    const formData = new FormData(document.getElementById('quizForm'));
    let score = 0;
    formData.forEach((value, key) => {
        if (!isNaN(value)) score += parseInt(value);
    });

    const resultText = document.getElementById('resultText');
    if (score <= 8) {
        resultText.textContent = "You seem to be in a good state of mind.";
    } else if (score <= 15) {
        resultText.textContent = "You may be experiencing mild stress.";
    } else if (score <= 25) {
        resultText.textContent = "You might be facing moderate mental health challenges. Consider consulting a professional.";
    } else {
        resultText.textContent = "You may be experiencing high stress levels. We strongly recommend reaching out for support.";
    }

    document.getElementById('quiz').classList.add("hidden");
    document.getElementById('result').classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function restartQuiz() {
    document.getElementById('result').classList.add("hidden");
    document.querySelector(".container").classList.remove("hidden");
}
