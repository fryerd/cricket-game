/**
 * Question Pool for Cricket Quiz Game
 *
 * Each question has:
 * - q: The question text
 * - opts: Array of 4 answer options
 * - correct: Index of the correct answer (0-3)
 *
 * Add new questions by adding objects to this array.
 * Questions are randomly selected during gameplay.
 */
const QUESTIONS = [
    // Geography
    { q: "What is the capital of France?", opts: ["Paris", "London", "Berlin", "Madrid"], correct: 0 },
    { q: "Which river flows through Egypt?", opts: ["Amazon", "Nile", "Thames", "Ganges"], correct: 1 },
    { q: "What is the largest ocean?", opts: ["Atlantic", "Indian", "Pacific", "Arctic"], correct: 2 },
    { q: "Which country has the most people?", opts: ["USA", "India", "China", "Russia"], correct: 2 },
    { q: "What is the capital of Japan?", opts: ["Seoul", "Beijing", "Tokyo", "Bangkok"], correct: 2 },
    { q: "Which mountain is the tallest?", opts: ["K2", "Mount Everest", "Kilimanjaro", "Denali"], correct: 1 },
    { q: "What is the capital of Australia?", opts: ["Sydney", "Melbourne", "Canberra", "Perth"], correct: 2 },
    { q: "Which continent is the Sahara Desert in?", opts: ["Asia", "Africa", "Australia", "South America"], correct: 1 },
    { q: "What ocean is west of the USA?", opts: ["Atlantic", "Pacific", "Arctic", "Indian"], correct: 1 },
    { q: "Which country is shaped like a boot?", opts: ["Spain", "Greece", "Italy", "Portugal"], correct: 2 },
    { q: "What is the smallest continent?", opts: ["Europe", "Antarctica", "Australia", "South America"], correct: 2 },
    { q: "Which city is called the Big Apple?", opts: ["Los Angeles", "Chicago", "New York", "Boston"], correct: 2 },
    { q: "What is the capital of Spain?", opts: ["Barcelona", "Madrid", "Seville", "Valencia"], correct: 1 },

    // Science
    { q: "What gas do plants need for photosynthesis?", opts: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correct: 2 },
    { q: "What is the smallest unit of life?", opts: ["Atom", "Cell", "Molecule", "Tissue"], correct: 1 },
    { q: "How many bones does an adult human have?", opts: ["186", "206", "226", "246"], correct: 1 },
    { q: "What is H2O?", opts: ["Oxygen", "Hydrogen", "Water", "Salt"], correct: 2 },
    { q: "What planet is closest to the Sun?", opts: ["Venus", "Mars", "Mercury", "Earth"], correct: 2 },
    { q: "What force keeps us on Earth?", opts: ["Magnetism", "Electricity", "Gravity", "Friction"], correct: 2 },

    // Sports
    { q: "How many players on a basketball team (on court)?", opts: ["4", "5", "6", "7"], correct: 1 },
    { q: "What sport is played at Wimbledon?", opts: ["Cricket", "Tennis", "Golf", "Rugby"], correct: 1 },
    { q: "How many players on a football team?", opts: ["9", "10", "11", "12"], correct: 2 },
    { q: "What color are the goalposts in rugby?", opts: ["Yellow", "White", "Red", "Blue"], correct: 1 },
    { q: "How many Olympic rings are there?", opts: ["4", "5", "6", "7"], correct: 1 },
    { q: "In cricket, how many stumps are there?", opts: ["2", "3", "4", "5"], correct: 1 },

    // History & Culture
    { q: "Who wrote Romeo and Juliet?", opts: ["Dickens", "Shakespeare", "Austen", "Tolkien"], correct: 1 },
    { q: "When did World War II end?", opts: ["1943", "1944", "1945", "1946"], correct: 2 },
    { q: "Who was the first US President?", opts: ["Jefferson", "Washington", "Lincoln", "Adams"], correct: 1 },
    { q: "When did humans first land on the Moon?", opts: ["1965", "1967", "1969", "1971"], correct: 2 },
    { q: "Who painted the Mona Lisa?", opts: ["Picasso", "Van Gogh", "Da Vinci", "Michelangelo"], correct: 2 },
    { q: "Which ancient wonder still stands?", opts: ["Colossus", "Pyramids of Giza", "Hanging Gardens", "Lighthouse"], correct: 1 },

    // Math
    { q: "What is 12 × 8?", opts: ["84", "92", "96", "104"], correct: 2 },
    { q: "What is 50% of 200?", opts: ["50", "75", "100", "125"], correct: 2 },
    { q: "What is the square root of 64?", opts: ["6", "7", "8", "9"], correct: 2 },
    { q: "What is 15 + 27?", opts: ["40", "41", "42", "43"], correct: 2 },
    { q: "How many sides does a hexagon have?", opts: ["5", "6", "7", "8"], correct: 1 },
    { q: "What is 9 × 7?", opts: ["54", "56", "63", "72"], correct: 2 }
];
