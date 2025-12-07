/**
 * Game Configuration for Cricket Quiz Game
 *
 * Contains all game constants, team data, and AI settings.
 * Modify these values to adjust game balance and add new teams.
 */

// =============================================================================
// GAME CONSTANTS
// =============================================================================

const SCORING_OPTIONS = [0, 1, 2, 3, 4, 6];
const DISPLAY_ORDER = [4, 6, 2, 3, 0, 1];  // Order for number buttons display
const WICKET_PENALTY = 15;                  // Runs deducted per wicket
const BALLS_PER_OVER = 6;
const COMPUTER_CORRECT_RATE = 0.66;         // 66% chance computer answers correctly
const TIME_PER_OVER_SECONDS = 75;           // Estimated time per over

// =============================================================================
// TEAMS
// =============================================================================

/**
 * Team Configuration
 *
 * Each team has:
 * - name: Display name
 * - flag: Emoji flag (fallback)
 * - flagClass: CSS class for styled flag
 * - opponent: Default opponent team key
 * - available: Whether team is playable (false = "Coming Soon")
 */
const TEAMS = {
    england: {
        name: 'England',
        flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        flagClass: 'flag-eng',
        opponent: 'australia',
        available: true
    },
    australia: {
        name: 'Australia',
        flag: '🇦🇺',
        flagClass: 'flag-aus',
        opponent: 'england',
        available: true
    },
    india: {
        name: 'India',
        flag: '🇮🇳',
        flagClass: 'flag-ind',
        opponent: 'pakistan',
        available: true
    },
    pakistan: {
        name: 'Pakistan',
        flag: '🇵🇰',
        flagClass: 'flag-pak',
        opponent: 'india',
        available: true
    },
    newzealand: {
        name: 'New Zealand',
        flag: '🇳🇿',
        flagClass: 'flag-nzl',
        opponent: 'southafrica',
        available: false
    },
    southafrica: {
        name: 'South Africa',
        flag: '🇿🇦',
        flagClass: 'flag-rsa',
        opponent: 'newzealand',
        available: false
    },
    westindies: {
        name: 'West Indies',
        flag: '🌴',
        flagClass: 'flag-wi',
        opponent: 'srilanka',
        available: false
    },
    srilanka: {
        name: 'Sri Lanka',
        flag: '🇱🇰',
        flagClass: 'flag-slk',
        opponent: 'westindies',
        available: false
    },
    zimbabwe: {
        name: 'Zimbabwe',
        flag: '🇿🇼',
        flagClass: 'flag-zim',
        opponent: 'kenya',
        available: false
    }
};

// =============================================================================
// AI DIFFICULTY SETTINGS
// =============================================================================

/**
 * AI Strategy Configuration
 *
 * Each difficulty has a bowler and batsman strategy with:
 * - name: Display name for the AI
 * - dist: Probability distribution for number selection [0, 1, 2, 3, 4, 6]
 *         Higher values = more likely to choose that number
 *
 * Batsman: Higher weights on 4 and 6 = more aggressive
 * Bowler: More even distribution = harder to predict
 */
const AI_STRATEGIES = {
    easy: {
        bowler: { name: 'Monty', dist: [17, 17, 17, 16, 17, 16] },
        batsman: { name: 'Grace', dist: [5, 8, 13, 20, 28, 26] }
    },
    medium: {
        bowler: { name: 'Kumble', dist: [18, 15, 15, 16, 18, 18] },
        batsman: { name: 'Gavaskar', dist: [3, 5, 9, 18, 32, 33] }
    },
    hard: {
        bowler: { name: 'Warne', dist: [12, 10, 12, 14, 23, 29] },
        batsman: { name: 'Bradman', dist: [2, 4, 7, 15, 32, 40] }
    },
    legendary: {
        bowler: { name: 'Murali', dist: [8, 8, 10, 12, 28, 34] },
        batsman: { name: 'Tendulkar', dist: [1, 3, 5, 12, 34, 45] }
    }
};

// Difficulty display names for UI
const DIFFICULTY_NAMES = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    legendary: 'Legendary'
};

// =============================================================================
// SCREEN IDS
// =============================================================================

const SCREENS = [
    'welcomeScreen',
    'countryScreen',
    'difficultyScreen',
    'durationScreen',
    'questionScreen',
    'deliveryScreen',
    'resultScreen',
    'inningsBreakScreen',
    'summaryScreen'
];
