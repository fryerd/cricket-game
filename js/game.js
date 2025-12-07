/**
 * Cricket Quiz Game - Main Game Logic
 *
 * This file contains the core game engine, UI functions, and game flow.
 * Dependencies: config.js, data/questions.js, data/commentary.js
 */

// =============================================================================
// CACHED DOM REFERENCES (for performance)
// =============================================================================

const DOM = {
    // Screens
    screens: {},

    // Scorebug
    mainScore: null,
    scoreBalls: null,
    wicketsDisplay: null,
    oversDisplay: null,
    batsmanBalls: null,
    bowlerBalls: null,

    // Question screen
    questionText: null,
    optionsContainer: null,
    submitBtn: null,

    // Delivery screen
    deliveryStatus: null,
    numberGrid: null,

    // Result screen
    batsmanCircle: null,
    batsmanNumber: null,
    bowlerCircle: null,
    bowlerNumber: null,
    batsmanLabel: null,
    bowlerLabel: null,
    vsDivider: null,
    commentaryBanner: null,
    commentaryHeader: null,
    commentaryText: null,
    nextBallBtn: null,

    // Duration screen
    oversSlider: null,
    oversValue: null,
    timeEstimate: null,
    matchPreviewTeams: null,
    matchPreviewDifficulty: null,

    // Worm chart
    wormCanvas: null,
    wormTitle: null,
    wormBatBadge: null,
    wormBowlBadge: null,
    wormLegend: null,
    wormSummary: null,
    continueBtn: null,

    // Summary
    summaryResult: null,
    summaryCommentary: null,
    firstInningsTitle: null,
    firstInningsScore: null,
    firstInningsWickets: null,
    secondInningsTitle: null,
    secondInningsScore: null,
    secondInningsWickets: null,

    // Other
    scorebug: null,
    welcomeHeader: null,
    countryGrid: null,
    explainerModal: null
};

/**
 * Initialize DOM references (call once on page load)
 */
function initDOMReferences() {
    // Cache screen references
    SCREENS.forEach(id => {
        DOM.screens[id] = document.getElementById(id);
    });

    // Scorebug
    DOM.mainScore = document.getElementById('mainScore');
    DOM.scoreBalls = document.getElementById('scoreBalls');
    DOM.wicketsDisplay = document.getElementById('wicketsDisplay');
    DOM.oversDisplay = document.getElementById('oversDisplay');
    DOM.batsmanBalls = document.getElementById('batsmanBalls');
    DOM.bowlerBalls = document.getElementById('bowlerBalls');
    DOM.scorebug = document.getElementById('scorebug');

    // Question screen
    DOM.questionText = document.getElementById('questionText');
    DOM.optionsContainer = document.getElementById('optionsContainer');
    DOM.submitBtn = document.getElementById('submitBtn');

    // Delivery screen
    DOM.deliveryStatus = document.getElementById('deliveryStatus');
    DOM.numberGrid = document.getElementById('numberGrid');

    // Result screen
    DOM.batsmanCircle = document.getElementById('batsmanCircle');
    DOM.batsmanNumber = document.getElementById('batsmanNumber');
    DOM.bowlerCircle = document.getElementById('bowlerCircle');
    DOM.bowlerNumber = document.getElementById('bowlerNumber');
    DOM.batsmanLabel = document.getElementById('batsmanRevealLabel');
    DOM.bowlerLabel = document.getElementById('bowlerRevealLabel');
    DOM.vsDivider = document.getElementById('vsDivider');
    DOM.commentaryBanner = document.getElementById('commentaryBanner');
    DOM.commentaryHeader = document.getElementById('commentaryHeader');
    DOM.commentaryText = document.getElementById('commentaryText');
    DOM.nextBallBtn = document.getElementById('nextBallBtn');

    // Duration screen
    DOM.oversSlider = document.getElementById('oversSlider');
    DOM.oversValue = document.getElementById('oversValue');
    DOM.timeEstimate = document.getElementById('timeEstimate');
    DOM.matchPreviewTeams = document.getElementById('matchPreviewTeams');
    DOM.matchPreviewDifficulty = document.getElementById('matchPreviewDifficulty');

    // Worm chart
    DOM.wormCanvas = document.getElementById('wormCanvas');
    DOM.wormTitle = document.getElementById('wormTitle');
    DOM.wormBatBadge = document.getElementById('wormBatBadge');
    DOM.wormBowlBadge = document.getElementById('wormBowlBadge');
    DOM.wormLegend = document.getElementById('wormLegend');
    DOM.wormSummary = document.getElementById('wormSummary');
    DOM.continueBtn = document.getElementById('continueBtn');

    // Summary
    DOM.summaryResult = document.getElementById('summaryResult');
    DOM.summaryCommentary = document.getElementById('summaryCommentary');
    DOM.firstInningsTitle = document.getElementById('firstInningsTitle');
    DOM.firstInningsScore = document.getElementById('firstInningsScore');
    DOM.firstInningsWickets = document.getElementById('firstInningsWickets');
    DOM.secondInningsTitle = document.getElementById('secondInningsTitle');
    DOM.secondInningsScore = document.getElementById('secondInningsScore');
    DOM.secondInningsWickets = document.getElementById('secondInningsWickets');

    // Other
    DOM.welcomeHeader = document.getElementById('welcomeHeader');
    DOM.countryGrid = document.getElementById('countryGrid');
    DOM.explainerModal = document.getElementById('explainerModal');
}

// =============================================================================
// GAME STATE
// =============================================================================

/**
 * Creates a fresh game state object
 */
function createInitialGameState() {
    return {
        playerTeam: null,
        opponentTeam: null,
        difficulty: null,
        overs: 3,
        totalBalls: 18,
        currentInnings: 1,
        playerBatting: true,
        ballCount: 0,
        runs: 0,
        wickets: 0,
        currentOver: 0,
        ballsInOver: 0,
        ballHistory: [],
        wormData: { innings1: [], innings2: [] },
        firstInningsScore: { runs: 0, wickets: 0 },
        secondInningsScore: { runs: 0, wickets: 0 },
        phase: 'welcome',
        currentQuestion: null,
        playerAnswer: null,
        computerAnswer: null,
        playerNumber: null,
        computerNumber: null,
        availableNumbers: [...SCORING_OPTIONS],
        isNoBall: false,
        usedQuestions: [],
        isProcessing: false,
        lastPlayerCorrect: false,
        lastComputerCorrect: false
    };
}

let gameState = createInitialGameState();

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Weighted random selection
 * @param {number[]} weights - Array of weights
 * @returns {number} Selected index
 */
function weightedRandom(weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
        random -= weights[i];
        if (random <= 0) return i;
    }
    return weights.length - 1;
}

/**
 * Get computer's number choice based on AI strategy
 * @param {boolean} isBatting - Is computer batting?
 * @param {number[]} availableNumbers - Available numbers to choose from
 * @returns {number} Chosen number
 */
function getComputerNumber(isBatting, availableNumbers) {
    const strategy = isBatting
        ? AI_STRATEGIES[gameState.difficulty].batsman
        : AI_STRATEGIES[gameState.difficulty].bowler;

    if (availableNumbers.length === 2 && availableNumbers[0] === 0 && availableNumbers[1] === 1) {
        return Math.random() < 0.5 ? 0 : 1;
    }

    const index = weightedRandom(strategy.dist);
    return SCORING_OPTIONS[index];
}

/**
 * Get a random question that hasn't been used recently
 * @returns {Object} Question object
 */
function getRandomQuestion() {
    const availableIndices = [];
    for (let i = 0; i < QUESTIONS.length; i++) {
        if (!gameState.usedQuestions.includes(i)) {
            availableIndices.push(i);
        }
    }

    if (availableIndices.length === 0) {
        gameState.usedQuestions = [];
        for (let i = 0; i < QUESTIONS.length; i++) {
            availableIndices.push(i);
        }
    }

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    gameState.usedQuestions.push(randomIndex);
    return QUESTIONS[randomIndex];
}

/**
 * Determine if computer answers correctly
 * @returns {boolean}
 */
function computerAnswersCorrectly() {
    return Math.random() < COMPUTER_CORRECT_RATE;
}

// =============================================================================
// UI FUNCTIONS
// =============================================================================

/**
 * Show a specific screen and hide all others
 * @param {string} screenId - ID of screen to show
 */
function showScreen(screenId) {
    SCREENS.forEach(id => {
        DOM.screens[id].classList.add('hidden');
    });
    DOM.screens[screenId].classList.remove('hidden');
}

/**
 * Flip transition between screens
 * @param {string} fromScreenId - Screen to hide
 * @param {string} toScreenId - Screen to show
 * @param {Function} callback - Optional callback after transition
 */
function flipTransition(fromScreenId, toScreenId, callback) {
    const fromScreen = DOM.screens[fromScreenId];
    const toScreen = DOM.screens[toScreenId];

    fromScreen.classList.add('flip-out');

    setTimeout(() => {
        fromScreen.classList.add('hidden');
        fromScreen.classList.remove('flip-out');
        toScreen.classList.remove('hidden');
        toScreen.classList.add('flip-in');

        setTimeout(() => {
            toScreen.classList.remove('flip-in');
            if (callback) callback();
        }, 300);
    }, 300);
}

/**
 * Update the main scoreboard display
 */
function updateScoreboard() {
    DOM.mainScore.textContent = `${gameState.runs} runs`;
    DOM.scoreBalls.textContent = `(${gameState.ballCount} balls)`;

    if (gameState.currentInnings === 2) {
        const target = gameState.firstInningsScore.runs + 1;
        const ballsRemaining = gameState.totalBalls - gameState.ballCount;
        DOM.wicketsDisplay.textContent = `Target: ${target}`;
        DOM.oversDisplay.textContent = `Balls left: ${ballsRemaining}`;
    } else {
        DOM.wicketsDisplay.textContent = `Wickets: ${gameState.wickets}`;
        const overNum = Math.floor(gameState.ballCount / BALLS_PER_OVER);
        const ballNum = gameState.ballCount % BALLS_PER_OVER;
        DOM.oversDisplay.textContent = `Overs: ${overNum}.${ballNum}`;
    }

    updateBallHistory();
}

/**
 * Update ball history display in scorebug
 */
function updateBallHistory() {
    DOM.batsmanBalls.innerHTML = '';
    DOM.bowlerBalls.innerHTML = '';

    const startIdx = Math.max(0, gameState.ballHistory.length - 6);
    const recentBalls = gameState.ballHistory.slice(startIdx);

    recentBalls.forEach(ball => {
        const batsmanDot = document.createElement('div');
        batsmanDot.className = `ball-dot ${ball.playerCorrect ? 'correct' : 'wrong'}`;
        batsmanDot.textContent = ball.wicket ? 'W' : ball.numberChosen;
        DOM.batsmanBalls.appendChild(batsmanDot);

        const bowlerDot = document.createElement('div');
        bowlerDot.className = `ball-dot ${ball.computerCorrect ? 'correct' : 'wrong'}`;
        bowlerDot.textContent = ball.wicket ? 'W' : ball.numberChosen;
        DOM.bowlerBalls.appendChild(bowlerDot);
    });

    // Add current ball indicator if not at innings break
    if (gameState.phase !== 'inningsBreak' && gameState.phase !== 'summary') {
        const currentDot = document.createElement('div');
        currentDot.className = 'ball-dot current';
        currentDot.textContent = '?';

        if (gameState.playerBatting) {
            DOM.batsmanBalls.appendChild(currentDot);
        } else {
            DOM.bowlerBalls.appendChild(currentDot);
        }
    }
}

/**
 * Typewriter effect for commentary
 * @param {HTMLElement} element - Element to type into
 * @param {string} text - Text to type
 * @param {number} speed - Typing speed in ms
 */
function typewriterEffect(element, text, speed = 25) {
    element.innerHTML = '';
    const wrapper = document.createElement('span');
    wrapper.className = 'typewriter';
    element.appendChild(wrapper);

    let i = 0;
    function type() {
        if (i < text.length) {
            wrapper.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

/**
 * Update overs display on duration screen
 */
function updateOversDisplay() {
    const overs = DOM.oversSlider.value;
    const plural = overs == 1 ? 'Over' : 'Overs';
    DOM.oversValue.textContent = `${overs} ${plural}`;

    // Calculate time estimate
    const totalSeconds = overs * TIME_PER_OVER_SECONDS * 2;
    const minutes = Math.floor(totalSeconds / 60);
    const maxMinutes = minutes + Math.ceil(minutes * 0.15);
    DOM.timeEstimate.textContent = `Approx. ${minutes}-${maxMinutes} minutes`;
}

// =============================================================================
// GAME FLOW FUNCTIONS
// =============================================================================

/**
 * Start the game from welcome screen
 */
function startGame() {
    populateCountryGrid();
    showScreen('countryScreen');
}

/**
 * Populate the country selection grid
 */
function populateCountryGrid() {
    DOM.countryGrid.innerHTML = '';

    Object.entries(TEAMS).forEach(([key, team]) => {
        const btn = document.createElement('button');

        if (team.available) {
            btn.className = 'country-btn';
            btn.innerHTML = `
                <span class="country-flag">${team.flag}</span>
                <span class="country-name">${team.name}</span>
            `;
            btn.onclick = () => selectCountry(key);
        } else {
            btn.disabled = true;
            btn.className = 'country-btn coming-soon';
            btn.innerHTML = `
                <span class="country-flag">${team.flag}</span>
                <span class="country-name">${team.name}</span>
                <span class="coming-soon-badge">Coming Soon</span>
                <div class="coming-soon-tooltip">${team.name} coming in a future update!</div>
            `;
            btn.onclick = (e) => toggleComingSoonTooltip(e, btn);
        }

        DOM.countryGrid.appendChild(btn);
    });
}

/**
 * Toggle tooltip for coming soon teams (mobile)
 */
function toggleComingSoonTooltip(e, btn) {
    e.preventDefault();
    document.querySelectorAll('.country-btn.coming-soon').forEach(b => {
        if (b !== btn) b.classList.remove('show-tooltip');
    });
    btn.classList.toggle('show-tooltip');
}

/**
 * Select a country/team
 * @param {string} teamKey - Team key from TEAMS object
 */
function selectCountry(teamKey) {
    gameState.playerTeam = teamKey;
    gameState.opponentTeam = TEAMS[teamKey].opponent;
    showScreen('difficultyScreen');
}

/**
 * Select difficulty level
 * @param {string} difficulty - Difficulty key
 */
function selectDifficulty(difficulty) {
    gameState.difficulty = difficulty;

    const playerTeam = TEAMS[gameState.playerTeam];
    const opponentTeam = TEAMS[gameState.opponentTeam];

    DOM.matchPreviewTeams.innerHTML =
        `<div class="css-flag ${playerTeam.flagClass}" style="display:inline-block;vertical-align:middle;margin-right:8px;"></div>${playerTeam.name} vs ${opponentTeam.name}<div class="css-flag ${opponentTeam.flagClass}" style="display:inline-block;vertical-align:middle;margin-left:8px;"></div>`;

    DOM.matchPreviewDifficulty.textContent = `${DIFFICULTY_NAMES[difficulty]} Difficulty`;

    updateOversDisplay();
    showScreen('durationScreen');
}

/**
 * Start the match
 */
function startMatch() {
    gameState.overs = parseInt(DOM.oversSlider.value);
    gameState.totalBalls = gameState.overs * BALLS_PER_OVER;

    document.body.classList.add('gameplay');
    DOM.welcomeHeader.classList.add('hidden');
    DOM.scorebug.classList.remove('hidden');

    updateScoreboard();
    startQuestionPhase();
}

/**
 * Start a new question phase
 */
function startQuestionPhase() {
    gameState.phase = 'question';
    gameState.currentQuestion = getRandomQuestion();
    gameState.playerAnswer = null;
    gameState.computerAnswer = computerAnswersCorrectly()
        ? gameState.currentQuestion.correct
        : (gameState.currentQuestion.correct + 1 + Math.floor(Math.random() * 3)) % 4;

    DOM.questionText.textContent = gameState.currentQuestion.q;
    DOM.optionsContainer.innerHTML = '';

    gameState.currentQuestion.opts.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.onclick = () => selectOption(btn, idx);
        DOM.optionsContainer.appendChild(btn);
    });

    DOM.submitBtn.disabled = true;
    showScreen('questionScreen');
}

/**
 * Handle option selection
 * @param {HTMLElement} btn - Clicked button
 * @param {number} index - Option index
 */
function selectOption(btn, index) {
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    gameState.playerAnswer = index;
    DOM.submitBtn.disabled = false;
}

/**
 * Submit answer and transition to delivery phase
 */
function submitAnswer() {
    if (gameState.playerAnswer === null) return;

    const correct = gameState.currentQuestion.correct;
    const playerCorrect = gameState.playerAnswer === correct;
    const computerCorrect = gameState.computerAnswer === correct;

    gameState.lastPlayerCorrect = playerCorrect;
    gameState.lastComputerCorrect = computerCorrect;

    // Show correct/wrong answers
    const options = document.querySelectorAll('.option-btn');
    options.forEach((btn, idx) => {
        if (idx === correct) {
            btn.classList.add('show-correct');
        } else if (idx === gameState.playerAnswer && !playerCorrect) {
            btn.classList.add('wrong-answer');
        }
    });

    DOM.submitBtn.disabled = true;

    setTimeout(() => {
        startDeliveryPhase(playerCorrect, computerCorrect);
    }, 1200);
}

/**
 * Start delivery/batting phase
 * @param {boolean} playerCorrect - Did player answer correctly?
 * @param {boolean} computerCorrect - Did computer answer correctly?
 */
function startDeliveryPhase(playerCorrect, computerCorrect) {
    gameState.phase = 'delivery';

    // Determine available numbers and no-ball status
    let availableNumbers = [...SCORING_OPTIONS];
    let isNoBall = false;

    if (gameState.playerBatting) {
        if (!playerCorrect && computerCorrect) {
            availableNumbers = [0, 1];
        } else if (playerCorrect && !computerCorrect) {
            isNoBall = true;
        } else if (!playerCorrect && !computerCorrect) {
            availableNumbers = [0, 1];
        }
    } else {
        if (!computerCorrect && playerCorrect) {
            availableNumbers = [0, 1];
        } else if (computerCorrect && !playerCorrect) {
            isNoBall = true;
        } else if (!computerCorrect && !playerCorrect) {
            availableNumbers = [0, 1];
        }
    }

    gameState.availableNumbers = availableNumbers;
    gameState.isNoBall = isNoBall;

    // Update UI
    let statusClass = 'correct';
    let statusText = '';

    if (gameState.playerBatting) {
        if (!playerCorrect && computerCorrect) {
            statusClass = 'incorrect';
            statusText = 'WRONG! Bowler got it right. You can only score 0 or 1.';
        } else if (playerCorrect && !computerCorrect) {
            statusText = 'CORRECT! Bowler got it wrong. FREE HIT - no wicket possible!';
        } else if (!playerCorrect && !computerCorrect) {
            statusClass = 'incorrect';
            statusText = 'Both wrong! Limited to 0 or 1 runs.';
        } else {
            statusText = 'Both correct! All runs available.';
        }
    } else {
        if (!computerCorrect && playerCorrect) {
            statusText = 'Computer wrong, you correct! Batsman limited to 0 or 1.';
        } else if (computerCorrect && !playerCorrect) {
            statusClass = 'incorrect';
            statusText = 'Computer correct, you wrong! NO BALL - no wicket possible.';
        } else if (!computerCorrect && !playerCorrect) {
            statusText = 'Both wrong! Batsman limited to 0 or 1.';
        } else {
            statusClass = 'incorrect';
            statusText = 'Both correct! Batsman has all runs available.';
        }
    }

    if (isNoBall) {
        statusText += ' <span class="info-icon" onclick="showExplainer(event)">?</span>';
    }

    DOM.deliveryStatus.className = `delivery-status ${statusClass}`;
    DOM.deliveryStatus.innerHTML = statusText;

    // Setup number buttons
    DOM.numberGrid.innerHTML = '';
    DISPLAY_ORDER.forEach(num => {
        const btn = document.createElement('button');
        btn.className = 'number-btn';
        btn.textContent = num;
        btn.disabled = !availableNumbers.includes(num);
        btn.onclick = () => selectNumber(num);
        DOM.numberGrid.appendChild(btn);
    });

    showScreen('deliveryScreen');
}

/**
 * Handle number selection
 * @param {number} num - Selected number
 */
function selectNumber(num) {
    if (gameState.isProcessing) return;
    gameState.isProcessing = true;

    if (gameState.playerBatting) {
        gameState.playerNumber = num;
        gameState.computerNumber = getComputerNumber(false, gameState.availableNumbers);
    } else {
        gameState.playerNumber = num;
        gameState.computerNumber = getComputerNumber(true, gameState.availableNumbers);
    }

    showResult();
}

/**
 * Show the result of the ball
 */
function showResult() {
    gameState.phase = 'result';

    const playerTeam = TEAMS[gameState.playerTeam];
    const opponentTeam = TEAMS[gameState.opponentTeam];
    const battingTeam = gameState.playerBatting ? playerTeam : opponentTeam;
    const bowlingTeam = gameState.playerBatting ? opponentTeam : playerTeam;

    const numbersMatch = gameState.playerNumber === gameState.computerNumber;
    let runsScored = 0;
    let isWicket = false;
    let commentary = '';

    if (gameState.playerBatting) {
        if (numbersMatch && !gameState.isNoBall) {
            isWicket = true;
            gameState.wickets++;
            gameState.runs = Math.max(0, gameState.runs - WICKET_PENALTY);
            commentary = `OUT! Bowled by ${bowlingTeam.name}! -${WICKET_PENALTY} runs penalty.`;
        } else if (numbersMatch && gameState.isNoBall) {
            commentary = `WICKET!! ...Oh wait, NO BALL! ${battingTeam.name} survive! 0 runs.`;
        } else {
            runsScored = gameState.playerNumber;
            gameState.runs += runsScored;
            commentary = getRunsCommentary(runsScored, battingTeam.name, bowlingTeam.name);
        }
    } else {
        if (numbersMatch && !gameState.isNoBall) {
            isWicket = true;
            gameState.wickets++;
            gameState.runs = Math.max(0, gameState.runs - WICKET_PENALTY);
            commentary = `WICKET! Great bowling by ${bowlingTeam.name}! -${WICKET_PENALTY} runs.`;
        } else if (numbersMatch && gameState.isNoBall) {
            commentary = `GOT HIM!! ...No wait, NO BALL! ${battingTeam.name} survive! 0 runs.`;
        } else {
            runsScored = gameState.computerNumber;
            gameState.runs += runsScored;
            commentary = getRunsCommentary(runsScored, battingTeam.name, bowlingTeam.name);
        }
    }

    // Record ball history
    gameState.ballHistory.push({
        playerCorrect: gameState.lastPlayerCorrect,
        computerCorrect: gameState.lastComputerCorrect,
        numberChosen: gameState.playerBatting ? gameState.playerNumber : gameState.computerNumber,
        wicket: isWicket
    });

    // Track worm data
    const isSix = runsScored === 6;
    const wormKey = gameState.currentInnings === 1 ? 'innings1' : 'innings2';
    gameState.wormData[wormKey].push({
        ball: gameState.ballCount + 1,
        runs: gameState.runs,
        wicket: isWicket,
        six: isSix
    });

    gameState.ballCount++;
    gameState.ballsInOver++;

    if (gameState.ballsInOver === BALLS_PER_OVER) {
        gameState.ballsInOver = 0;
        gameState.currentOver++;
    }

    updateScoreboard();

    // Animate result reveal
    animateResultReveal(numbersMatch, isWicket, commentary);
}

/**
 * Animate the result reveal screen
 */
function animateResultReveal(numbersMatch, isWicket, commentary) {
    const batsmanCorrect = gameState.lastPlayerCorrect;
    const bowlerCorrect = gameState.lastComputerCorrect;

    // Reset animations
    DOM.batsmanCircle.classList.remove('animate-in', 'correct', 'wrong');
    DOM.bowlerCircle.classList.remove('animate-in', 'correct', 'wrong');
    DOM.batsmanNumber.classList.remove('animate-in', 'wicket-text');
    DOM.bowlerNumber.classList.remove('animate-in', 'wicket-text');
    DOM.batsmanLabel.classList.remove('animate-in');
    DOM.bowlerLabel.classList.remove('animate-in');
    DOM.vsDivider.classList.remove('animate-in');
    DOM.commentaryBanner.classList.remove('animate-in', 'wicket');
    DOM.nextBallBtn.classList.remove('animate-in');

    // Reset styles
    DOM.batsmanCircle.style.opacity = '0';
    DOM.bowlerCircle.style.opacity = '0';
    DOM.batsmanNumber.style.opacity = '0';
    DOM.bowlerNumber.style.opacity = '0';
    DOM.batsmanLabel.style.opacity = '0';
    DOM.bowlerLabel.style.opacity = '0';
    DOM.vsDivider.style.opacity = '0';
    DOM.commentaryBanner.style.opacity = '0';
    DOM.nextBallBtn.style.opacity = '0';
    DOM.commentaryText.innerHTML = '';

    // Set colors based on question correctness
    DOM.batsmanCircle.classList.add(batsmanCorrect ? 'correct' : 'wrong');
    DOM.bowlerCircle.classList.add(bowlerCorrect ? 'correct' : 'wrong');

    // Set numbers
    DOM.batsmanNumber.textContent = gameState.playerBatting ? gameState.playerNumber : gameState.computerNumber;
    DOM.bowlerNumber.textContent = gameState.playerBatting ? gameState.computerNumber : gameState.playerNumber;

    // Update labels
    DOM.batsmanLabel.textContent = gameState.playerBatting ? 'You (Batting)' : 'Computer (Batting)';
    DOM.bowlerLabel.textContent = gameState.playerBatting ? 'Computer (Bowling)' : 'You (Bowling)';

    if (isWicket) {
        DOM.commentaryBanner.classList.add('wicket');
        DOM.commentaryHeader.textContent = 'WICKET!';
    } else {
        DOM.commentaryHeader.textContent = 'Comms';
    }

    showScreen('resultScreen');

    // Animation sequence
    setTimeout(() => {
        DOM.batsmanCircle.style.opacity = '';
        DOM.batsmanCircle.classList.add('animate-in');
    }, 100);

    setTimeout(() => {
        DOM.batsmanNumber.style.opacity = '';
        DOM.batsmanNumber.classList.add('animate-in');
        DOM.batsmanLabel.style.opacity = '';
        DOM.batsmanLabel.classList.add('animate-in');
    }, 400);

    setTimeout(() => {
        DOM.bowlerCircle.style.opacity = '';
        DOM.bowlerCircle.classList.add('animate-in');
    }, 400);

    setTimeout(() => {
        DOM.bowlerNumber.style.opacity = '';
        DOM.bowlerNumber.classList.add('animate-in');
        DOM.bowlerLabel.style.opacity = '';
        DOM.bowlerLabel.classList.add('animate-in');
    }, 700);

    setTimeout(() => {
        DOM.vsDivider.style.opacity = '';
        DOM.vsDivider.classList.add('animate-in');
    }, 600);

    setTimeout(() => {
        DOM.commentaryBanner.style.opacity = '';
        DOM.commentaryBanner.style.transform = '';
        DOM.commentaryBanner.classList.add('animate-in');

        setTimeout(() => {
            typewriterEffect(DOM.commentaryText, commentary);
        }, 300);
    }, 1200);

    setTimeout(() => {
        DOM.nextBallBtn.style.opacity = '';
        DOM.nextBallBtn.classList.add('animate-in');
    }, 1800);
}

/**
 * Handle next ball button
 */
function nextBall() {
    gameState.isProcessing = false;

    // Check for end of innings
    if (gameState.ballCount >= gameState.totalBalls) {
        if (gameState.currentInnings === 1) {
            gameState.firstInningsScore = {
                runs: gameState.runs,
                wickets: gameState.wickets
            };
            showInningsBreak(false);
        } else {
            gameState.secondInningsScore = {
                runs: gameState.runs,
                wickets: gameState.wickets
            };
            showInningsBreak(true);
        }
    } else if (gameState.currentInnings === 2) {
        // Check if target achieved or match over
        const target = gameState.firstInningsScore.runs + 1;
        if (gameState.runs >= target) {
            gameState.secondInningsScore = {
                runs: gameState.runs,
                wickets: gameState.wickets
            };
            showInningsBreak(true);
        } else {
            startQuestionPhase();
        }
    } else {
        startQuestionPhase();
    }
}

/**
 * Show innings break/worm chart screen
 * @param {boolean} isMatchComplete - Is the match finished?
 */
function showInningsBreak(isMatchComplete) {
    gameState.phase = 'inningsBreak';

    const playerTeam = TEAMS[gameState.playerTeam];
    const opponentTeam = TEAMS[gameState.opponentTeam];

    DOM.wormTitle.textContent = isMatchComplete ? 'Match Summary' : '1st Innings';

    DOM.wormBatBadge.innerHTML = `<div class="css-flag ${playerTeam.flagClass}"></div>${playerTeam.name}`;
    DOM.wormBowlBadge.innerHTML = `${opponentTeam.name}<div class="css-flag ${opponentTeam.flagClass}"></div>`;

    // Update legend
    if (isMatchComplete) {
        DOM.wormLegend.innerHTML = `
            <div class="legend-item">
                <div class="legend-line innings1"></div>
                <span><div class="css-flag ${playerTeam.flagClass}" style="display:inline-block;vertical-align:middle;margin-right:4px;"></div>${playerTeam.name}</span>
            </div>
            <div class="legend-item">
                <div class="legend-line innings2"></div>
                <span><div class="css-flag ${opponentTeam.flagClass}" style="display:inline-block;vertical-align:middle;margin-right:4px;"></div>${opponentTeam.name}</span>
            </div>
            <div class="legend-item">
                <div class="legend-dot six"></div>
                <span>Six</span>
            </div>
            <div class="legend-item">
                <div class="legend-dot wicket"></div>
                <span>Wicket</span>
            </div>
        `;
    } else {
        DOM.wormLegend.innerHTML = `
            <div class="legend-item">
                <div class="legend-line innings1"></div>
                <span><div class="css-flag ${playerTeam.flagClass}" style="display:inline-block;vertical-align:middle;margin-right:4px;"></div>${playerTeam.name}</span>
            </div>
            <div class="legend-item">
                <div class="legend-dot six"></div>
                <span>Six</span>
            </div>
            <div class="legend-item">
                <div class="legend-dot wicket"></div>
                <span>Wicket</span>
            </div>
        `;
    }

    // Update summary
    if (isMatchComplete) {
        DOM.wormSummary.innerHTML = `
            <div class="worm-innings-score">
                <div class="worm-innings-label"><div class="css-flag ${playerTeam.flagClass}" style="display:inline-block;vertical-align:middle;margin-right:6px;"></div>${playerTeam.name}</div>
                <div class="worm-innings-runs batting">${gameState.firstInningsScore.runs}</div>
            </div>
            <div class="worm-innings-score">
                <div class="worm-innings-label"><div class="css-flag ${opponentTeam.flagClass}" style="display:inline-block;vertical-align:middle;margin-right:6px;"></div>${opponentTeam.name}</div>
                <div class="worm-innings-runs bowling">${gameState.secondInningsScore.runs}</div>
            </div>
        `;
    } else {
        DOM.wormSummary.innerHTML = `
            <div class="worm-innings-score">
                <div class="worm-innings-label"><div class="css-flag ${playerTeam.flagClass}" style="display:inline-block;vertical-align:middle;margin-right:6px;"></div>${playerTeam.name}</div>
                <div class="worm-innings-runs batting">${gameState.firstInningsScore.runs}</div>
            </div>
        `;
    }

    DOM.continueBtn.textContent = isMatchComplete ? 'View Results' : 'Start Bowling';
    DOM.continueBtn.onclick = () => continueFromInningsBreak(isMatchComplete);

    showScreen('inningsBreakScreen');

    // Draw worm chart after layout
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            drawWormChart(isMatchComplete);
        });
    });
}

/**
 * Continue from innings break
 * @param {boolean} isMatchComplete
 */
function continueFromInningsBreak(isMatchComplete) {
    if (isMatchComplete) {
        showSummary();
    } else {
        // Setup second innings
        gameState.currentInnings = 2;
        gameState.playerBatting = false;
        gameState.ballCount = 0;
        gameState.runs = 0;
        gameState.wickets = 0;
        gameState.currentOver = 0;
        gameState.ballsInOver = 0;
        gameState.ballHistory = [];
        gameState.availableNumbers = [...SCORING_OPTIONS];

        updateScoreboard();
        startQuestionPhase();
    }
}

/**
 * Draw the worm chart
 * @param {boolean} showBothInnings
 */
function drawWormChart(showBothInnings) {
    const canvas = DOM.wormCanvas;
    const ctx = canvas.getContext('2d');

    const wrapper = canvas.parentElement;
    const wrapperWidth = wrapper.clientWidth;

    // Safety check
    if (wrapperWidth < 50) {
        setTimeout(() => drawWormChart(showBothInnings), 50);
        return;
    }

    canvas.width = wrapperWidth - 30;
    canvas.height = 250;

    const padding = { top: 20, right: 20, bottom: 30, left: 45 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;

    const innings1 = gameState.wormData.innings1;
    const innings2 = showBothInnings ? gameState.wormData.innings2 : [];

    const allData = [...innings1, ...innings2];
    const maxBalls = Math.max(innings1.length, innings2.length, gameState.totalBalls);
    const maxRuns = Math.max(...allData.map(d => d.runs), 10);
    const runStep = Math.ceil(maxRuns / 5);

    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;

        for (let i = 0; i <= 5; i++) {
            const y = padding.top + chartHeight - (i * chartHeight / 5);
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(padding.left + chartWidth, y);
            ctx.stroke();

            ctx.fillStyle = '#666';
            ctx.font = '11px Fredoka';
            ctx.textAlign = 'right';
            ctx.fillText(Math.round(i * runStep), padding.left - 8, y + 4);
        }

        ctx.textAlign = 'center';
        const ballStep = Math.ceil(maxBalls / 6);
        for (let i = 0; i <= maxBalls; i += ballStep) {
            const x = padding.left + (i / maxBalls) * chartWidth;
            ctx.fillText(i, x, canvas.height - 8);
        }

        ctx.fillStyle = '#888';
        ctx.font = '11px Fredoka';
        ctx.textAlign = 'center';
        ctx.fillText('Balls', padding.left + chartWidth / 2, canvas.height - 2);

        ctx.save();
        ctx.translate(12, padding.top + chartHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Runs', 0, 0);
        ctx.restore();
    }

    function drawMarker(point, x, y) {
        if (point.wicket) {
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.fillStyle = '#dc3545';
            ctx.fill();
            ctx.strokeStyle = '#a02020';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = 'white';
            ctx.font = 'bold 10px Fredoka';
            ctx.textAlign = 'center';
            ctx.fillText('W', x, y + 4);
        } else if (point.six) {
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.fillStyle = '#28a745';
            ctx.fill();
            ctx.strokeStyle = '#1e7e34';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = 'white';
            ctx.font = 'bold 10px Fredoka';
            ctx.textAlign = 'center';
            ctx.fillText('6', x, y + 4);
        }
    }

    function getPointCoords(point) {
        const x = padding.left + (point.ball / maxBalls) * chartWidth;
        const y = padding.top + chartHeight - (point.runs / (runStep * 5)) * chartHeight;
        return { x, y };
    }

    const animationDuration = 2000;

    function animateInnings(data, color, onComplete) {
        if (data.length === 0) {
            if (onComplete) onComplete();
            return;
        }

        const startTime = performance.now();
        const totalPoints = data.length;

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / animationDuration, 1);
            const pointsToDraw = Math.floor(progress * totalPoints);
            const partialProgress = (progress * totalPoints) - pointsToDraw;

            drawGrid();

            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(padding.left, padding.top + chartHeight);

            for (let i = 0; i < pointsToDraw && i < data.length; i++) {
                const coords = getPointCoords(data[i]);
                ctx.lineTo(coords.x, coords.y);
            }

            if (pointsToDraw < data.length && partialProgress > 0) {
                const prevCoords = pointsToDraw > 0
                    ? getPointCoords(data[pointsToDraw - 1])
                    : { x: padding.left, y: padding.top + chartHeight };
                const nextCoords = getPointCoords(data[pointsToDraw]);
                const partialX = prevCoords.x + (nextCoords.x - prevCoords.x) * partialProgress;
                const partialY = prevCoords.y + (nextCoords.y - prevCoords.y) * partialProgress;
                ctx.lineTo(partialX, partialY);
            }

            ctx.stroke();

            for (let i = 0; i < pointsToDraw && i < data.length; i++) {
                const coords = getPointCoords(data[i]);
                drawMarker(data[i], coords.x, coords.y);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (data.length > 0) {
                    const lastCoords = getPointCoords(data[data.length - 1]);
                    drawMarker(data[data.length - 1], lastCoords.x, lastCoords.y);
                }
                if (onComplete) onComplete();
            }
        }

        requestAnimationFrame(animate);
    }

    drawGrid();
    animateInnings(innings1, '#00B4D8', () => {
        if (showBothInnings && innings2.length > 0) {
            const drawStaticInnings = (data, color) => {
                ctx.strokeStyle = color;
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(padding.left, padding.top + chartHeight);
                data.forEach(point => {
                    const coords = getPointCoords(point);
                    ctx.lineTo(coords.x, coords.y);
                });
                ctx.stroke();
                data.forEach(point => {
                    const coords = getPointCoords(point);
                    drawMarker(point, coords.x, coords.y);
                });
            };

            const startTime2 = performance.now();
            const totalPoints2 = innings2.length;

            function animate2(currentTime) {
                const elapsed = currentTime - startTime2;
                const progress = Math.min(elapsed / animationDuration, 1);
                const pointsToDraw = Math.floor(progress * totalPoints2);
                const partialProgress = (progress * totalPoints2) - pointsToDraw;

                drawGrid();
                drawStaticInnings(innings1, '#00B4D8');

                ctx.strokeStyle = '#FF6B35';
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(padding.left, padding.top + chartHeight);

                for (let i = 0; i < pointsToDraw && i < innings2.length; i++) {
                    const coords = getPointCoords(innings2[i]);
                    ctx.lineTo(coords.x, coords.y);
                }

                if (pointsToDraw < innings2.length && partialProgress > 0) {
                    const prevCoords = pointsToDraw > 0
                        ? getPointCoords(innings2[pointsToDraw - 1])
                        : { x: padding.left, y: padding.top + chartHeight };
                    const nextCoords = getPointCoords(innings2[pointsToDraw]);
                    const partialX = prevCoords.x + (nextCoords.x - prevCoords.x) * partialProgress;
                    const partialY = prevCoords.y + (nextCoords.y - prevCoords.y) * partialProgress;
                    ctx.lineTo(partialX, partialY);
                }

                ctx.stroke();

                for (let i = 0; i < pointsToDraw && i < innings2.length; i++) {
                    const coords = getPointCoords(innings2[i]);
                    drawMarker(innings2[i], coords.x, coords.y);
                }

                if (progress < 1) {
                    requestAnimationFrame(animate2);
                } else if (innings2.length > 0) {
                    const lastCoords = getPointCoords(innings2[innings2.length - 1]);
                    drawMarker(innings2[innings2.length - 1], lastCoords.x, lastCoords.y);
                }
            }

            requestAnimationFrame(animate2);
        }
    });
}

/**
 * Show match summary screen
 */
function showSummary() {
    gameState.phase = 'summary';

    const playerTeam = TEAMS[gameState.playerTeam];
    const opponentTeam = TEAMS[gameState.opponentTeam];
    const playerScore = gameState.firstInningsScore.runs;
    const computerScore = gameState.secondInningsScore.runs;

    DOM.firstInningsTitle.textContent = `${playerTeam.name} Batting`;
    DOM.firstInningsScore.textContent = `${gameState.firstInningsScore.runs} runs`;
    DOM.firstInningsWickets.textContent = `${gameState.firstInningsScore.wickets} wickets lost`;

    DOM.secondInningsTitle.textContent = `${opponentTeam.name} Batting`;
    DOM.secondInningsScore.textContent = `${gameState.secondInningsScore.runs} runs`;
    DOM.secondInningsWickets.textContent = `${gameState.secondInningsScore.wickets} wickets taken`;

    if (playerScore > computerScore) {
        const margin = playerScore - computerScore;
        DOM.summaryResult.className = 'summary-result win';
        DOM.summaryResult.textContent = `${playerTeam.name} Win by ${margin} runs!`;
        DOM.summaryCommentary.textContent = `"${getResultCommentary('win', playerTeam.name, opponentTeam.name)}"`;
    } else if (computerScore > playerScore) {
        const margin = computerScore - playerScore;
        DOM.summaryResult.className = 'summary-result lose';
        DOM.summaryResult.textContent = `${opponentTeam.name} Win by ${margin} runs`;
        DOM.summaryCommentary.textContent = `"${getResultCommentary('lose', opponentTeam.name, playerTeam.name)}"`;
    } else {
        DOM.summaryResult.className = 'summary-result tie';
        DOM.summaryResult.textContent = `It's a Tie!`;
        DOM.summaryCommentary.textContent = `"${getResultCommentary('tie', '', '')}"`;
    }

    DOM.scorebug.classList.add('hidden');
    showScreen('summaryScreen');
}

/**
 * Restart the game
 */
function restartGame() {
    gameState = createInitialGameState();

    document.body.classList.remove('gameplay');
    DOM.welcomeHeader.classList.remove('hidden');
    DOM.scorebug.classList.add('hidden');
    DOM.oversSlider.value = 3;
    updateOversDisplay();

    showScreen('welcomeScreen');
}

/**
 * Show explainer modal
 */
function showExplainer(event) {
    event.stopPropagation();
    DOM.explainerModal.classList.add('show');
}

/**
 * Close explainer modal
 */
function closeExplainer(event) {
    if (event && event.target !== DOM.explainerModal) return;
    DOM.explainerModal.classList.remove('show');
}

// =============================================================================
// INITIALIZATION
// =============================================================================

// Initialize DOM references when page loads
document.addEventListener('DOMContentLoaded', initDOMReferences);
