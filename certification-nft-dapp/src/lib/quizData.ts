export interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number; // Index of the correct option
}

export interface Quiz {
    id: string; // e.g., "quiz_blockchain_101"
    title: string;
    description: string;
    points: number;
    questions: Question[];
}

export const QUIZZES: Quiz[] = [
    {
        id: "quiz_blockchain_101",
        title: "Blockchain Basics",
        description: "Test your knowledge of fundamental blockchain concepts.",
        points: 100,
        questions: [
            {
                id: 1,
                question: "What is a blockchain?",
                options: [
                    "A centralized database controlled by a bank",
                    "A distributed ledger of transactions",
                    "A type of cryptocurrency",
                    "A social media platform"
                ],
                correctAnswer: 1,
            },
            {
                id: 2,
                question: "What does 'decentralized' mean in the context of blockchain?",
                options: [
                    "Data is stored on a single server",
                    "No single entity controls the network",
                    "The network is slow",
                    "It uses a central bank"
                ],
                correctAnswer: 1,
            },
            {
                id: 3,
                question: "What is a 'block' in a blockchain?",
                options: [
                    "A physical brick",
                    "A restriction on a user",
                    "A container for data/transactions",
                    "A type of mining tool"
                ],
                correctAnswer: 2,
            },
        ],
    },
    {
        id: "quiz_ton_ecosystem",
        title: "TON Ecosystem",
        description: "Learn about the Open Network and its unique features.",
        points: 150,
        questions: [
            {
                id: 1,
                question: "What does TON stand for?",
                options: [
                    "The Open Network",
                    "Token of Network",
                    "Totally Open Node",
                    "Telegram One Network"
                ],
                correctAnswer: 0,
            },
            {
                id: 2,
                question: "Which wallet is commonly used for TON?",
                options: [
                    "MetaMask",
                    "Phantom",
                    "Tonkeeper",
                    "Coinbase Wallet"
                ],
                correctAnswer: 2,
            },
            {
                id: 3,
                question: "What is the native currency of TON?",
                options: [
                    "ETH",
                    "BTC",
                    "TON",
                    "USDT"
                ],
                correctAnswer: 2,
            },
        ],
    },
    {
        id: "quiz_nft_basics",
        title: "NFT Fundamentals",
        description: "Understand what Non-Fungible Tokens are and how they work.",
        points: 120,
        questions: [
            {
                id: 1,
                question: "What does NFT stand for?",
                options: [
                    "New Fund Token",
                    "Non-Fungible Token",
                    "Network Fee Tax",
                    "No Fun Today"
                ],
                correctAnswer: 1,
            },
            {
                id: 2,
                question: "Are all NFTs identical?",
                options: [
                    "Yes, they are like Bitcoin",
                    "No, each one is unique",
                    "Only if they look the same",
                    "Yes, they are all fungible"
                ],
                correctAnswer: 1,
            },
            {
                id: 3,
                question: "What can be represented as an NFT?",
                options: [
                    "Digital Art",
                    "Real Estate",
                    "Music",
                    "All of the above"
                ],
                correctAnswer: 3
            }
        ],
    },
];
