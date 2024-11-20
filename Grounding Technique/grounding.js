const instructions = [
    { instruction: "Identify 5 things you can see around you.", limit: 5 },
    { instruction: "Identify 4 things you can touch around you.", limit: 4 },
    { instruction: "Identify 3 things you can hear right now.", limit: 3 },
    { instruction: "Identify 2 things you can smell (or think of a favorite scent).", limit: 2 },
    { instruction: "Identify 1 thing you can taste (or imagine a favorite flavor).", limit: 1 }
];

let currentStep = 0;
let answers = [];

const instructionElement = document.getElementById("instruction");
const inputField = document.getElementById("inputField");
const nextBtn = document.getElementById("nextBtn");
const resultsDiv = document.getElementById("results");
const resetBtn = document.getElementById("resetBtn");
const calmingMessageDiv = document.getElementById("calmingMessage");

const calmingMessages = [
    "You are doing great! Keep going!",
    "Breathe in, breathe out – you are amazing!",
    "Take your time, you're making progress!",
    "You are enough, just as you are.",
    "Every step you take is progress, well done!",
    "You’ve got this, one breath at a time!",
    "Stay calm, you're on the right path!",
    "Great job, you’re making strides!",
    "You are strong, you are capable!"
];

const motivationalParagraphs = [
    "You are unique, and your presence in this world matters more than you could ever realize. No matter what challenges you've faced, you have the strength to rise above them. Remember, life is a journey, not a race. It's okay to take things one step at a time, at your own pace. You don't need to compare yourself to others, because the only person you need to compete with is yourself. Every day is a fresh opportunity to move forward, even if it's just a little bit. Your dreams are valid, and you are worthy of all the happiness that life has to offer. So take a deep breath, smile, and keep moving forward. You have everything inside you to create the life you want. Be kind to yourself, because you're doing better than you think. Remember, it's okay to not have everything figured out. You are not alone in this journey. There are people who care about you and believe in you. No matter how tough things may seem right now, this moment is not permanent.",
    "Every person has a unique story, and your story is just as important. You are a work of art, shaped by the experiences you've had and the lessons you've learned. There's so much strength within you, even on the days when you don't feel it. It's okay to not have everything figured out, and it's okay to ask for help when you need it. Remember that you're never alone, and there's always someone who believes in you. Life is not about perfection; it's about growth, resilience, and taking small steps forward. Your journey is yours, and it doesn't need to look like anyone else's. Take pride in your progress, no matter how small it may seem. Every day that you choose to keep going, you're winning. You are worthy of love, happiness, and everything that life has to offer. Embrace the challenges, for they shape you into the person you're meant to be. You have a purpose, and you have so much to give. Don't let anything hold you back from discovering your true potential."
];

let currentMotivationalMessage = "";

function updateInstruction() {
    instructionElement.textContent = instructions[currentStep].instruction;
    inputField.value = "";
    inputField.focus();
}

nextBtn.addEventListener("click", () => {
    const userInput = inputField.value.trim();
    if (userInput === "") return;

    const inputs = userInput.split(',').map(input => input.trim()).filter(input => input !== "");

    if (inputs.length > instructions[currentStep].limit) {
        alert(`Please only provide up to ${instructions[currentStep].limit} answers.`);
        return;
    }

    answers.push(inputs);

    showRandomCalmingMessage();

    currentStep++;
    if (currentStep < instructions.length) {
        updateInstruction();
    } else {
        displayResults();
    }
});

function displayResults() {
    instructionElement.textContent = "Great job! Here's what you noticed:";
    inputField.style.display = "none";
    nextBtn.style.display = "none";
    
    let resultHTML = "";
    answers.forEach((answer, index) => {
        resultHTML += `<p>${instructions[index].instruction.split(' ')[1]}: ${answer.join(', ')}</p>`;
    });
    resultsDiv.innerHTML = resultHTML;
    
    currentMotivationalMessage = motivationalParagraphs[Math.floor(Math.random() * motivationalParagraphs.length)];
    resultsDiv.innerHTML += `<p style="margin-top: 20px; font-size: 18px; font-weight: bold; color: #4CAF50;">${currentMotivationalMessage}</p>`;
    
    resetBtn.style.display = "inline-block";
}

function showRandomCalmingMessage() {
    const randomMessage = calmingMessages[Math.floor(Math.random() * calmingMessages.length)];

    calmingMessageDiv.classList.remove("hidden");
    calmingMessageDiv.textContent = randomMessage;

    setTimeout(() => {
        calmingMessageDiv.classList.add("hidden");
    }, 4000); 
}

resetBtn.addEventListener("click", () => {
    currentStep = 0;
    answers = [];
    inputField.style.display = "block";
    nextBtn.style.display = "inline-block";
    resetBtn.style.display = "none";
    resultsDiv.innerHTML = "";
    updateInstruction();
    calmingMessageDiv.classList.add("hidden");
});

updateInstruction();
