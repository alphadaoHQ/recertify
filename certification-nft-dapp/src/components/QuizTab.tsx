"use strict";
import { useState, useMemo } from "react";
import { QUIZZES, Quiz } from "@/lib/quizData";
import { QuizRunner } from "./QuizRunner";
import { Trophy, Clock, CheckCircle, BrainCircuit, Play } from "lucide-react";
import { loadUserStats, saveUserStats } from "@/lib/supabaseService";
import { useContractState } from "@/hooks/useContractState";

interface QuizTabProps {
    isDarkMode: boolean;
    userAddress: string;
    telegramUser?: any;
}

export const QuizTab = ({ isDarkMode, userAddress, telegramUser }: QuizTabProps) => {
    // State
    const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
    const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);
    const [quizResult, setQuizResult] = useState<{
        score: number;
        total: number;
        points: number;
    } | null>(null);
    // We use this local loading state for the "Claim" action primarily
    const [isClaiming, setIsClaiming] = useState(false);

    // Hook to refetch contract/global stats if needed (optional but good practice)
    const { refetch } = useContractState();

    // Load completed quizzes on mount
    useMemo(async () => {
        if (userAddress) {
            const stats = await loadUserStats(userAddress);
            if (stats?.claimed_task_ids) {
                // Filter for quiz IDs
                const quizes = stats.claimed_task_ids.filter((id) =>
                    id.startsWith("quiz_")
                );
                setCompletedQuizzes(quizes);
            }
        }
    }, [userAddress]);

    const activeQuiz = useMemo(
        () => QUIZZES.find((q) => q.id === activeQuizId),
        [activeQuizId]
    );

    const handleStartQuiz = (quizId: string) => {
        setActiveQuizId(quizId);
        setQuizResult(null);
    };

    const handleQuizComplete = (score: number, totalQuestions: number) => {
        // Calculate points: simple ratio for now, or all-or-nothing
        // Let's say you get points only if you pass > 50%? Or proportional?
        // Implementation: Proportional points
        if (!activeQuiz) return;

        // Simple logic: must get at least 1 correct to get any points?
        // Let's just give points = (score / total) * maxPoints
        const earnedPoints = Math.round((score / totalQuestions) * activeQuiz.points);

        setQuizResult({
            score,
            total: totalQuestions,
            points: earnedPoints,
        });
    };

    const handleClaimPoints = async () => {
        console.log("👉 CLAIM START: ActiveQuiz:", activeQuiz?.id, "UserAddress:", userAddress);

        if (!userAddress) {
            console.error("❌ MISSING DATA: User Address is missing (Wallet not connected?)");
            alert("Please connect your wallet to claim points.");
            return;
        }
        if (!activeQuiz) {
            console.error("❌ MISSING DATA: Active Quiz is missing");
            return;
        }
        if (!quizResult) {
            console.error("❌ MISSING DATA: Quiz Result is missing");
            return;
        }

        setIsClaiming(true);
        try {
            // 1. Load current stats
            console.log("Loading stats for user:", userAddress);
            const stats = await loadUserStats(userAddress);
            console.log("👉 CURRENT STATS:", stats);

            const currentPoints = stats?.points || 0;
            const currentClaimed = stats?.claimed_task_ids || [];

            // 2. Prevent double claim locally check
            if (currentClaimed.includes(activeQuiz.id)) {
                console.warn("⚠️ ALREADY CLAIMED:", activeQuiz.id);
                alert("You have already claimed this quiz!");
                setIsClaiming(false);
                setActiveQuizId(null);
                return;
            }

            // 3. Update stats
            const newPoints = currentPoints + quizResult.points;
            const newClaimed = [...currentClaimed, activeQuiz.id];

            const payload = {
                points: newPoints,
                daily_streak: stats?.daily_streak || 0,
                claimed_task_ids: newClaimed,
                achievements: stats?.achievements,
                referral_count: stats?.referral_count,
                referral_code: stats?.referral_code,
                last_checkin: stats?.last_checkin,
                telegram_id: telegramUser?.id
            };
            console.log("👉 SAVING PAYLOAD:", payload);

            const success = await saveUserStats(userAddress, payload);
            console.log("👉 SAVE RESULT:", success);

            if (success) {
                setCompletedQuizzes((prev) => [...prev, activeQuiz.id]);
                setActiveQuizId(null);
                setQuizResult(null);
                // Refresh global state to show new points in UI header
                refetch();
            } else {
                console.error("❌ SAVE FAILED: supabaseService returned false");
                alert("Failed to save progress. Please try again.");
            }
        } catch (e) {
            console.error("❌ EXCEPTION in handleClaimPoints:", e);
        } finally {
            setIsClaiming(false);
        }
    };

    const handleBackToList = () => {
        setActiveQuizId(null);
        setQuizResult(null);
    };

    // -- RENDER: QUIZ RUNNER --
    if (activeQuiz && !quizResult) {
        return (
            <div className="h-full">
                <QuizRunner
                    questions={activeQuiz.questions}
                    onComplete={handleQuizComplete}
                    onCancel={handleBackToList}
                    isDarkMode={isDarkMode}
                />
            </div>
        );
    }

    // -- RENDER: QUIZ RESULT --
    if (activeQuiz && quizResult) {
        const isSuccess = quizResult.score > 0;
        return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="relative">
                    {isSuccess ? (
                        <div className="w-24 h-24 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                            <Trophy className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <BrainCircuit className="w-12 h-12 text-gray-500" />
                        </div>
                    )}
                </div>

                <div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        {isSuccess ? "Quiz Completed!" : "Good Try!"}
                    </h2>
                    <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        You scored {quizResult.score} out of {quizResult.total}
                    </p>
                </div>

                <div className={`p-6 rounded-2xl w-full max-w-xs ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                    <span className={`text-sm font-medium uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Reward Earned
                    </span>
                    <div className="text-4xl font-bold text-blue-500 mt-2">
                        +{quizResult.points} PTS
                    </div>
                </div>

                <div className="w-full max-w-xs space-y-3">
                    <button
                        onClick={handleClaimPoints}
                        disabled={isClaiming || completedQuizzes.includes(activeQuiz.id)}
                        className="w-full py-4 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isClaiming ? "Claiming..." : completedQuizzes.includes(activeQuiz.id) ? "Already Claimed" : "Claim Points"}
                    </button>
                    <button
                        onClick={handleBackToList}
                        className={`w-full py-3 rounded-xl font-medium ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                    >
                        Back to Quizzes
                    </button>
                </div>
            </div>
        )
    }

    // -- RENDER: QUIZ LIST --
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Available Quizzes
                </h2>
                <span className={`text-sm px-3 py-1 rounded-full ${isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"}`}>
                    {completedQuizzes.length}/{QUIZZES.length} Completed
                </span>
            </div>

            <div className="grid gap-4">
                {QUIZZES.map((quiz) => {
                    const isCompleted = completedQuizzes.includes(quiz.id);

                    return (
                        <div
                            key={quiz.id}
                            className={`relative overflow-hidden p-5 rounded-2xl border transition-all duration-200 ${isCompleted
                                ? isDarkMode
                                    ? "bg-green-900/10 border-green-900/30 opacity-80"
                                    : "bg-green-50 border-green-200 opacity-80"
                                : isDarkMode
                                    ? "bg-gray-800 border-gray-700 hover:border-blue-500 hover:bg-gray-800/80"
                                    : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-md"
                                }`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className={`p-2 rounded-lg ${isCompleted
                                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                    }`}>
                                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : <BrainCircuit className="w-6 h-6" />}
                                </div>
                                <div className={`text-sm font-bold ${isCompleted ? "text-green-600" : "text-blue-500"}`}>
                                    {quiz.points} PTS
                                </div>
                            </div>

                            <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                {quiz.title}
                            </h3>
                            <p className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                {quiz.description}
                            </p>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{quiz.questions.length} Questions</span>
                                </div>

                                <button
                                    onClick={() => !isCompleted && handleStartQuiz(quiz.id)}
                                    disabled={isCompleted}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${isCompleted
                                        ? "bg-transparent text-green-600 cursor-default"
                                        : "bg-blue-600 hover:bg-blue-700 text-white"
                                        }`}
                                >
                                    {isCompleted ? (
                                        <>Completed</>
                                    ) : (
                                        <>Start Quiz <Play className="w-3.5 h-3.5 fill-current" /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
