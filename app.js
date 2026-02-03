/* ============================================
   ROMANTIC INTERACTIVE WEB EXPERIENCE
   Application Logic 💕
   ============================================ */

// === QUESTION DATA ===
const LEVEL_1_DATA = {
    level: 1,
    type: "text",
    questions: [
        {
            id: 1,
            question: "Where did we meet for the first time?",
            acceptedAnswers: ["college", "at college", "college campus"]
        },
        {
            id: 2,
            question: "Which nickname do I like the most?",
            acceptedAnswers: ["baby", "babe"]
        },
        {
            id: 3,
            question: "Out of all the times we met, which date do you love the most?",
            acceptedAnswers: ["14/02/2022"]
        },
        {
            id: 4,
            question: "Which song do we love listening to together?",
            acceptedAnswers: ["perfect", "perfect by ed sheeran"]
        },
        {
            id: 5,
            question: "In our relationship, which area do we want to improve the most?",
            acceptedAnswers: ["communication", "understanding"]
        },
        {
            id: 6,
            question: "What does VALOUR mean to us in our relationship?",
            acceptedAnswers: ["trust", "honesty", "strength", "commitment"]
        }
    ]
};

const LEVEL_2_DATA = {
    level: 2,
    type: "choice",
    options: ["Me", "You"],
    questions: [
        { id: 1, question: "Who gets angry first?", correct: "Me" },
        { id: 2, question: "Who forgives first?", correct: "You" },
        { id: 3, question: "Who is more emotional?", correct: "You" },
        { id: 4, question: "Who usually starts arguments unintentionally?", correct: "Me" },
        { id: 5, question: "Who cannot stay without talking things out?", correct: "You" },
        { id: 6, question: "Who loves more deeply and gets more attached?", correct: "You" },
        { id: 7, question: "Who gets angry but cools down in minutes?", correct: "Me" },
        { id: 8, question: "Who laughs even in serious situations?", correct: "You" },
        { id: 9, question: "Who pretends not to care but actually does?", correct: "You" },
        { id: 10, question: "Who says 'I'm fine' when they're clearly not?", correct: "You" },
        { id: 11, question: "Who forgives easily but remembers everything?", correct: "You" },
        { id: 12, question: "Who overreacts first and regrets later?", correct: "Me" },
        { id: 13, question: "Who checks on others silently without saying much?", correct: "You" },
        { id: 14, question: "Who turns awkward moments into funny ones?", correct: "You" },
        { id: 15, question: "Who talks nonsense when sleepy?", correct: "Me" },
        { id: 16, question: "Who remembers random silly moments?", correct: "You" },
        { id: 17, question: "Who gets excited over small wins?", correct: "You" },
        { id: 18, question: "Who cannot stay mad for long?", correct: "Me" },
        { id: 19, question: "Who is less reactive in tough situations?", correct: "You" },
        { id: 20, question: "Who solves problems calmly even in hard situations?", correct: "You" }
    ]
};

// === STATE ===
let state = {
    userName: "",
    currentLevel: 0,
    currentQuestion: 0
};

// === DOM ELEMENTS ===
const pages = {
    start: document.getElementById("startPage"),
    level1: document.getElementById("level1Page"),
    level2: document.getElementById("level2Page"),
    surprise: document.getElementById("surprisePage")
};

const overlays = {
    reaction: document.getElementById("reactionOverlay"),
    correct: document.getElementById("correctOverlay")
};

// === INITIALIZATION ===
document.addEventListener("DOMContentLoaded", () => {
    initFloatingHearts();
    setupEventListeners();
});

// === FLOATING HEARTS ===
function initFloatingHearts() {
    const container = document.getElementById("heartsContainer");
    const hearts = ["💕", "💖", "💗", "💓", "💝", "💘", "❤️", "🩷"];

    for (let i = 0; i < 15; i++) {
        setTimeout(() => createHeart(container, hearts), i * 800);
    }

    setInterval(() => createHeart(container, hearts), 2000);
}

function createHeart(container, hearts) {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + "%";
    heart.style.animationDuration = (5 + Math.random() * 5) + "s";
    heart.style.fontSize = (16 + Math.random() * 20) + "px";
    container.appendChild(heart);

    setTimeout(() => heart.remove(), 10000);
}

// === EVENT LISTENERS ===
function setupEventListeners() {
    // Start page validation
    document.getElementById("validateStart").addEventListener("click", validateStart);

    // Level 1 submission
    document.getElementById("submitLevel1").addEventListener("click", submitLevel1);
    document.getElementById("level1Answer").addEventListener("keypress", (e) => {
        if (e.key === "Enter") submitLevel1();
    });

    // Level 2 choice buttons
    document.querySelectorAll(".btn-choice").forEach(btn => {
        btn.addEventListener("click", () => submitLevel2(btn.dataset.choice));
    });

    // Retry button
    document.getElementById("retryBtn").addEventListener("click", hideReaction);

    // Anniversary date formatting
    document.getElementById("anniversary").addEventListener("input", formatDateInput);
}

// === DATE INPUT FORMATTING ===
function formatDateInput(e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) value = value.slice(0, 2) + "/" + value.slice(2);
    if (value.length >= 5) value = value.slice(0, 5) + "/" + value.slice(5);
    e.target.value = value.slice(0, 10);
}

// === PAGE NAVIGATION ===
function showPage(pageId) {
    Object.values(pages).forEach(page => page.classList.remove("active"));
    pages[pageId].classList.add("active");
}

// === START PAGE VALIDATION ===
function validateStart() {
    const name = document.getElementById("userName").value.trim();
    const date = document.getElementById("anniversary").value.trim();

    if (!name) {
        showReaction("😅", "Oops!", "Please enter your name first!");
        return;
    }

    if (date !== "07/09/2021") {
        document.body.classList.add("shake");
        setTimeout(() => document.body.classList.remove("shake"), 500);
        showReaction("😤", "That's not our date!", "Try to remember when it all began... 💔");
        return;
    }

    state.userName = name;
    state.currentLevel = 1;
    state.currentQuestion = 0;

    showCorrectReaction("🥰", "Welcome, " + name + "! 💕");
    setTimeout(() => {
        hideCorrectReaction();
        showPage("level1");
        loadLevel1Question();
    }, 1800);
}

// === LEVEL 1 ===
function loadLevel1Question() {
    const question = LEVEL_1_DATA.questions[state.currentQuestion];
    const total = LEVEL_1_DATA.questions.length;

    document.getElementById("level1Question").textContent = question.question;
    document.getElementById("level1Progress").textContent = `Question ${state.currentQuestion + 1} of ${total}`;
    document.getElementById("level1ProgressBar").style.width = ((state.currentQuestion) / total * 100) + "%";
    document.getElementById("level1Answer").value = "";
    document.getElementById("level1Answer").focus();
    document.getElementById("level1Emoji").textContent = "🤔";
}

function submitLevel1() {
    const answer = document.getElementById("level1Answer").value.trim().toLowerCase();
    const question = LEVEL_1_DATA.questions[state.currentQuestion];

    if (!answer) {
        showReaction("🤨", "Hey!", "You need to type an answer!");
        return;
    }

    const isCorrect = question.acceptedAnswers.some(
        accepted => accepted.toLowerCase() === answer
    );

    if (!isCorrect) {
        document.body.classList.add("shake");
        setTimeout(() => document.body.classList.remove("shake"), 500);
        document.getElementById("level1Emoji").textContent = "😢";
        showReaction("😤", "Wrong answer!", "That's not right. Think harder! 💭");
        return;
    }

    // Correct answer!
    document.getElementById("level1Emoji").textContent = "😍";
    state.currentQuestion++;

    const total = LEVEL_1_DATA.questions.length;
    document.getElementById("level1ProgressBar").style.width = (state.currentQuestion / total * 100) + "%";

    if (state.currentQuestion >= total) {
        // Level 1 complete!
        showCorrectReaction("🎉", "Level 1 Complete! You're amazing! 💖");
        setTimeout(() => {
            hideCorrectReaction();
            state.currentLevel = 2;
            state.currentQuestion = 0;
            showPage("level2");
            loadLevel2Question();
        }, 2000);
    } else {
        showCorrectReaction("💕", "Yay! You remember!");
        setTimeout(() => {
            hideCorrectReaction();
            loadLevel1Question();
        }, 1500);
    }
}

// === LEVEL 2 ===
function loadLevel2Question() {
    const question = LEVEL_2_DATA.questions[state.currentQuestion];
    const total = LEVEL_2_DATA.questions.length;

    document.getElementById("level2Question").textContent = question.question;
    document.getElementById("level2Progress").textContent = `Question ${state.currentQuestion + 1} of ${total}`;
    document.getElementById("level2ProgressBar").style.width = ((state.currentQuestion) / total * 100) + "%";
    document.getElementById("level2Emoji").textContent = "💭";
}

function submitLevel2(choice) {
    const question = LEVEL_2_DATA.questions[state.currentQuestion];

    if (choice !== question.correct) {
        document.body.classList.add("shake");
        setTimeout(() => document.body.classList.remove("shake"), 500);
        document.getElementById("level2Emoji").textContent = "😕";
        showReaction("😢", "Oops! Wrong choice!", "You should know this about us! 💔");
        return;
    }

    // Correct answer!
    document.getElementById("level2Emoji").textContent = "😊";
    state.currentQuestion++;

    const total = LEVEL_2_DATA.questions.length;
    document.getElementById("level2ProgressBar").style.width = (state.currentQuestion / total * 100) + "%";

    if (state.currentQuestion >= total) {
        // All complete! Show surprise!
        showCorrectReaction("🎊", "You did it! Get ready for your surprise! 💝");
        setTimeout(() => {
            hideCorrectReaction();
            showSurprisePage();
        }, 2500);
    } else {
        showCorrectReaction("✨", "You know us so well!");
        setTimeout(() => {
            hideCorrectReaction();
            loadLevel2Question();
        }, 1200);
    }
}

// === SURPRISE PAGE ===
function showSurprisePage() {
    document.getElementById("partnerName").textContent = state.userName;
    showPage("surprise");
    startConfetti();
}

function startConfetti() {
    const container = document.getElementById("confettiContainer");
    const colors = ["#ec407a", "#8e24aa", "#ffd54f", "#f8bbd9", "#ce93d8", "#ff80ab"];

    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement("div");
            confetti.className = "confetti";
            confetti.style.left = Math.random() * 100 + "%";
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + "s";
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            container.appendChild(confetti);

            setTimeout(() => confetti.remove(), 5000);
        }, i * 50);
    }
}

// === REACTION OVERLAYS ===
function showReaction(emoji, title, subtitle) {
    document.getElementById("reactionEmoji").textContent = emoji;
    document.getElementById("reactionText").textContent = title;
    document.getElementById("reactionSubtext").textContent = subtitle;
    overlays.reaction.classList.add("active");
}

function hideReaction() {
    overlays.reaction.classList.remove("active");
}

function showCorrectReaction(emoji, text) {
    document.getElementById("correctEmoji").textContent = emoji;
    document.getElementById("correctText").textContent = text;
    overlays.correct.classList.add("active");
    createHeartsBurst();
}

function hideCorrectReaction() {
    overlays.correct.classList.remove("active");
}

function createHeartsBurst() {
    const container = document.getElementById("heartsBurst");
    container.innerHTML = "";

    const hearts = ["💕", "💖", "💗", "💓", "❤️"];

    for (let i = 0; i < 12; i++) {
        const heart = document.createElement("span");
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

        const angle = (i / 12) * 360;
        const distance = 100 + Math.random() * 50;
        const x = Math.cos(angle * Math.PI / 180) * distance;
        const y = Math.sin(angle * Math.PI / 180) * distance;

        heart.style.setProperty("--x", x + "px");
        heart.style.setProperty("--y", y + "px");
        heart.style.animationDelay = (i * 0.05) + "s";

        container.appendChild(heart);
    }
}
