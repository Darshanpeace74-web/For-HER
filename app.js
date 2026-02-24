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
            keywords: ["school", "college", "class", "campus", "university", "institute"],
            acceptAny: false,
            response: "Correct uh ga 🫡"
        },
        {
            id: 2,
            question: "Which nickname do I like the most?",
            keywords: ["darshan", "mama", "thangoo"],
            acceptAny: false,
            response: "Paaraa 😚"
        },
        {
            id: 3,
            question: "Out of all the times we met, which date do you love the most?",
            keywords: ["date", "meet", "meeting", "day", "/"],
            acceptAny: false,
            response: "Finee 🫣"
        },
        {
            id: 4,
            question: "Which song do we love listening to together?",
            keywords: ["song", "music", "tune", "melody"],
            acceptAny: true,
            response: "Laaa nalla erukum 😌"
        },
        {
            id: 5,
            question: "In our relationship, which area do we want to improve the most?",
            keywords: [],
            acceptAny: true,
            response: "Laa paathukalam 😤"
        },
        {
            id: 6,
            question: "In our relationship, which part should be developed by VAPOUR?",
            keywords: [],
            acceptAny: true,
            response: "Okk officer 😁"
        }
    ]
};

const LEVEL_2_DATA = {
    level: 2,
    type: "choice",
    options: ["Me", "You"],
    questions: [
        { id: 1, question: "Who gets angry first?", responseMe: "theriyama touch panetiga nanaikura 🧐", responseYou: "nanaichaa 😏" },
        { id: 2, question: "Who forgives first?", response: "Unmai tha ga 🙂‍↕️" },
        { id: 3, question: "Who is more emotional?", response: "Yeahh definitely 😁" },
        { id: 4, question: "Who usually starts arguments unintentionally?", response: "Enna choose pandrathu nu eh trla thanaa 🤭" },
        { id: 5, question: "Who is more possessive?", response: "Ohh really 🧐" },
        { id: 6, question: "Who is more romantic?", response: "Illa ga .. both tha 😉🙈" },
        { id: 7, question: "Who showers less?", responseMe: "ahh athuu 😤", responseYou: "aii thoodaa ..😏 try again gaa!" },
        { id: 8, question: "Who starts to kiss first?", response: "🤭😚" },
        { id: 9, question: "Who talks more dark things? 🌚", response: "Laaa 😁" },
        { id: 10, question: "Who is funnier?", response: "Amaa 😂" },
        { id: 11, question: "Who forgives easily but remembers everything?", response: "Ohhh 😯" },
        { id: 12, question: "Who overreacts first and regrets later?", response: "Yess 💯" },
        { id: 13, question: "Who is the law breaker?", response: "🙆🏻" },
        { id: 14, question: "Who turns awkward moments into funny ones?", response: "😂😂" },
        { id: 15, question: "Who gets moody first? 🫣🙈", response: "Yess 😂😅🌚" },
        { id: 16, question: "Who remembers random silly moments?", response: "Yeahh but both also dude 🙂‍↕️😌" },
        { id: 17, question: "Who gets excited over small wins?", response: "Yess 😅" },
        { id: 18, question: "Who apologises first?", response: "Ofcourse daw 😓" },
        { id: 19, question: "Who has more patience?", response: "Unmai thaa ga 🙇🏻🤍" },
        { id: 20, question: "Who is a better chef?", response: "Really 🧐🤔" }
    ]
};

// === STATE ===
let state = {
    userName: "",
    currentLevel: 0,
    currentQuestion: 0,
    level1Answers: [],
    level2Answers: []
};

// Pending action after continue button click
let pendingAction = null;

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
    state.level1Answers = [];
    state.level2Answers = [];

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
    const answer = document.getElementById("level1Answer").value.trim();
    const answerLower = answer.toLowerCase();
    const question = LEVEL_1_DATA.questions[state.currentQuestion];

    if (!answer) {
        showReaction("🤨", "Hey!", "You need to type an answer!");
        return;
    }

    // Check if answer is valid
    let isCorrect = false;

    if (question.acceptAny) {
        // Accept any non-empty answer
        isCorrect = true;
    } else if (question.keywords && question.keywords.length > 0) {
        // Check if answer contains any of the keywords
        isCorrect = question.keywords.some(keyword =>
            answerLower.includes(keyword.toLowerCase())
        );
    }

    if (!isCorrect) {
        document.body.classList.add("shake");
        setTimeout(() => document.body.classList.remove("shake"), 500);
        document.getElementById("level1Emoji").textContent = "😢";
        showReaction("😤", "Wrong answer!", "That's not right. Think harder! 💭");
        return;
    }

    // Store answer and proceed
    state.level1Answers.push({
        question: question.question,
        answer: answer
    });

    document.getElementById("level1Emoji").textContent = "😍";
    state.currentQuestion++;

    const total = LEVEL_1_DATA.questions.length;
    document.getElementById("level1ProgressBar").style.width = (state.currentQuestion / total * 100) + "%";

    if (state.currentQuestion >= total) {
        // Level 1 complete! Go directly to Level 2
        showCorrectReaction("🎉", question.response);
        pendingAction = () => {
            hideCorrectReaction();
            state.currentLevel = 2;
            state.currentQuestion = 0;
            showPage("level2");
            loadLevel2Question();
        };
    } else {
        // Show custom response and wait for continue click
        showCorrectReaction("💕", question.response);
        pendingAction = () => {
            hideCorrectReaction();
            loadLevel1Question();
        };
    }
}

// === CONTINUE BUTTON HANDLER ===
function continueToNext() {
    if (pendingAction) {
        pendingAction();
        pendingAction = null;
    }
}

// === TRANSITION PAGE ===
function showTransitionPage() {
    hideAllPages();
    const transitionHTML = `
        <section id="transitionPage" class="page active">
            <div class="card glass-card">
                <div class="emoji-large">😏🥴</div>
                <h1>Wait...</h1>
                <h2>Starting la nalla tha erukum .. ethuku aparm paarugaa</h2>
                <p class="subtitle">( ETHU ENNA PRAMATHAM .. ETHA VIDA SPECIAL ITEM ONU ERUKUU ) 😉</p>
                <button class="btn btn-primary" onclick="startLevel2()">
                    Continue to Level 2 💕
                </button>
            </div>
        </section>
    `;

    // Insert transition page
    document.querySelector('.app-container').insertAdjacentHTML('beforeend', transitionHTML);
}

function startLevel2() {
    // Remove transition page
    const transitionPage = document.getElementById("transitionPage");
    if (transitionPage) transitionPage.remove();

    state.currentLevel = 2;
    state.currentQuestion = 0;
    showPage("level2");
    loadLevel2Question();
}

// Make functions globally accessible for onclick handlers
window.startLevel2 = startLevel2;
window.continueToNext = continueToNext;

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

    // Store the answer (no validation - accept any choice)
    state.level2Answers.push({
        question: question.question,
        answer: choice
    });

    // Get custom response based on choice
    let responseMessage;
    if (choice === "Me" && question.responseMe) {
        responseMessage = question.responseMe;
    } else if (choice === "You" && question.responseYou) {
        responseMessage = question.responseYou;
    } else {
        responseMessage = question.response || "✨";
    }

    // Show reaction with custom response
    document.getElementById("level2Emoji").textContent = "😊";
    state.currentQuestion++;

    const total = LEVEL_2_DATA.questions.length;
    document.getElementById("level2ProgressBar").style.width = (state.currentQuestion / total * 100) + "%";

    if (state.currentQuestion >= total) {
        // All complete! Show reaction page then surprise!
        showCorrectReaction("🎊", responseMessage);
        pendingAction = () => {
            hideCorrectReaction();
            // Show emotional reaction page, then surprise
            showReactionPage(() => {
                showSurprisePage();
            }, {
                emoji: "🥳",
                mainText: "You did it!",
                subText: "Get ready for your surprise... 💕",
                duration: 3000
            });
        };
    } else {
        showCorrectReaction("✨", responseMessage);
        pendingAction = () => {
            hideCorrectReaction();
            loadLevel2Question();
        };
    }
}

// === SURPRISE PAGE ===
function showSurprisePage() {
    document.getElementById("partnerName").textContent = state.userName;
    generateFlowChart();
    showPage("surprise");
    startConfetti();
}

function generateFlowChart() {
    const container = document.getElementById("flowChartContainer");
    if (!container) return;

    let html = '<div class="flow-chart">';
    html += '<h3 class="flow-title">💕 Your Answers Journey 💕</h3>';

    // Level 2 answers flow chart
    html += '<div class="flow-section">';
    html += '<div class="flow-header">Level 2: Who Are We? 💑</div>';

    let meCount = 0;
    let youCount = 0;

    state.level2Answers.forEach((item, index) => {
        const isMe = item.answer === "Me";
        if (isMe) meCount++; else youCount++;

        html += `
            <div class="flow-item ${isMe ? 'flow-me' : 'flow-you'}">
                <div class="flow-number">${index + 1}</div>
                <div class="flow-content">
                    <div class="flow-question">${item.question}</div>
                    <div class="flow-answer">${item.answer} ${isMe ? '🙋‍♂️' : '🙋‍♀️'}</div>
                </div>
            </div>
        `;
    });

    // Summary
    html += `
        <div class="flow-summary">
            <div class="summary-title">Summary 📊</div>
            <div class="summary-stats">
                <div class="stat-item stat-me">
                    <span class="stat-emoji">🙋‍♂️</span>
                    <span class="stat-label">Me:</span>
                    <span class="stat-value">${meCount}</span>
                </div>
                <div class="stat-item stat-you">
                    <span class="stat-emoji">🙋‍♀️</span>
                    <span class="stat-label">You:</span>
                    <span class="stat-value">${youCount}</span>
                </div>
            </div>
        </div>
    `;

    html += '</div>';
    html += '</div>';

    container.innerHTML = html;
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

// ================================================
// REACTION PAGE START
// Emotional expression page - reusable component
// Usage: showReactionPage(nextPageCallback, options)
// ================================================

/**
 * Show an emotional reaction page with auto-transition
 * @param {Function} nextPageCallback - Function to call after animation completes
 * @param {Object} options - Optional customization
 * @param {string} options.emoji - Character emoji (default: "😤")
 * @param {string} options.mainText - Main heading text
 * @param {string} options.subText - Subtext message
 * @param {number} options.duration - Time before transition in ms (default: 3000)
 */
function showReactionPage(nextPageCallback, options = {}) {
    const page = document.getElementById("emotionalReactionPage");
    const character = document.getElementById("reactionCharacter");
    const mainText = document.getElementById("reactionMainText");
    const subText = document.getElementById("reactionSubText");

    // Set custom content or use defaults
    character.textContent = options.emoji || "😤";
    mainText.textContent = options.mainText || "Hmm… really?";
    subText.textContent = options.subText || "Think carefully before moving on.";

    const duration = options.duration || 3000;

    // Show the page
    page.style.display = "flex";
    setTimeout(() => {
        page.classList.add("active");
    }, 10);

    // After animation, start softening
    setTimeout(() => {
        page.classList.add("softening");
    }, duration - 1000);

    // Fade out and call callback
    setTimeout(() => {
        page.classList.add("fade-out");

        setTimeout(() => {
            page.classList.remove("active", "softening", "fade-out");
            page.style.display = "none";

            // Call the next page callback
            if (nextPageCallback && typeof nextPageCallback === "function") {
                nextPageCallback();
            }
        }, 500);
    }, duration);
}

// Make function globally accessible
window.showReactionPage = showReactionPage;

// ================================================
// REACTION PAGE END
// ================================================
