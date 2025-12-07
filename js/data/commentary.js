/**
 * Commentary Library for Cricket Quiz Game
 *
 * Uses template placeholders:
 * - {batting} = batting team name
 * - {bowling} = bowling team name
 * - {winner} = winning team name
 * - {loser} = losing team name
 *
 * Add new variations by adding strings to the arrays.
 */

// Commentary for different run outcomes
const RUN_COMMENTARY = {
    0: [
        "Dot ball! Well bowled by {bowling}.",
        "Nothing doing there. Tight bowling.",
        "Defended solidly. No run.",
        "{bowling} keep it tight. Dot ball.",
        "Good length, well left. No run."
    ],
    1: [
        "Quick single taken by {batting}.",
        "Nudged away for one. Smart cricket.",
        "{batting} rotate the strike. One run.",
        "Pushed into the gap. They take a single.",
        "Dab and run. Good running between the wickets."
    ],
    2: [
        "{batting} ran hard for two!",
        "Worked away nicely. Two runs.",
        "Placed into the gap. They come back for the second.",
        "Good running! Two to {batting}.",
        "Punched through the covers for a brace."
    ],
    3: [
        "Pushing for three! {batting} want every run.",
        "Three runs! Great hustle between the wickets.",
        "Into the deep and they're back for three.",
        "{batting} turn two into three. Excellent running!",
        "Driven to the boundary... but cut off! Three runs."
    ],
    4: [
        "FOUR! Cracking shot by {batting}!",
        "That's racing away to the boundary! Four runs.",
        "FOUR! Timed to perfection.",
        "Pierced the field beautifully. FOUR!",
        "Sweetly struck! Four runs to {batting}."
    ],
    6: [
        "SIX! That's a maximum! {batting} launch it!",
        "HUGE! That's gone all the way! Six runs.",
        "Into the stands! Maximum from {batting}!",
        "SIX! Cleared the rope with ease!",
        "That's massive! Six runs. The crowd goes wild!"
    ]
};

// Commentary for match results
const WIN_COMMENTARY = [
    "A dominant performance from {winner}!",
    "{loser} were completely outplayed today.",
    "What a match! {winner} showed their class.",
    "{winner} made it look easy in the end.",
    "The {loser} bowling just couldn't contain {winner}.",
    "{winner} march on to victory!",
    "Clinical stuff from {winner}."
];

const LOSE_COMMENTARY = [
    "{winner} were simply too good today.",
    "A tough day at the office for {loser}.",
    "{loser} will want to forget this one quickly.",
    "{winner} proved why they're the favorites.",
    "Not enough runs on the board for {loser}.",
    "{winner} cruise to victory.",
    "Back to the drawing board for {loser}."
];

const TIE_COMMENTARY = [
    "What a finish! Neither side could be separated.",
    "Cricket doesn't get much closer than this!",
    "Both teams gave everything - a fair result.",
    "An incredible match ends in a tie!",
    "Two evenly matched sides today."
];

/**
 * Get random commentary for runs scored
 * @param {number} runs - Runs scored (0, 1, 2, 3, 4, or 6)
 * @param {string} battingTeam - Name of batting team
 * @param {string} bowlingTeam - Name of bowling team
 * @returns {string} Commentary text
 */
function getRunsCommentary(runs, battingTeam, bowlingTeam) {
    const options = RUN_COMMENTARY[runs] || [`${runs} run${runs === 1 ? '' : 's'} to {batting}.`];
    const template = options[Math.floor(Math.random() * options.length)];
    return template
        .replace(/{batting}/g, battingTeam)
        .replace(/{bowling}/g, bowlingTeam);
}

/**
 * Get random result commentary
 * @param {string} result - 'win', 'lose', or 'tie'
 * @param {string} winner - Winner team name
 * @param {string} loser - Loser team name
 * @returns {string} Commentary text
 */
function getResultCommentary(result, winner, loser) {
    let options;
    switch (result) {
        case 'win':
            options = WIN_COMMENTARY;
            break;
        case 'lose':
            options = LOSE_COMMENTARY;
            break;
        default:
            options = TIE_COMMENTARY;
    }
    const template = options[Math.floor(Math.random() * options.length)];
    return template
        .replace(/{winner}/g, winner)
        .replace(/{loser}/g, loser);
}
