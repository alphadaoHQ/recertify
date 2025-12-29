"use strict";
import { useState } from "react";
import { Question } from "@/lib/quizData";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";

interface QuizRunnerProps {
    questions: Question[];
    onComplete: (score: number, totalQuestions: number) => void;
    onCancel: () => void;
    isDarkMode: boolean;
}

export const QuizRunner = ({
    questions,
    onComplete,
    onCancel,
    isDarkMode,
}: QuizRunnerProps) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const handleOptionSelect = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
    };

    const handleSubmitAnswer = () => {
        if (selectedOption === null) return;

        const isCorrect = selectedOption === currentQuestion.correctAnswer;
        if (isCorrect) {
            setScore((prev) => prev + 1);
        }
        setIsAnswered(true);
    };

    const handleNext = () => {
        if (isLastQuestion) {
            onComplete(score, questions.length);
        } else {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-6">
                <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <button
                    onClick={onCancel}
                    className={`text-sm ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
                >
                    Quit
                </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-8 overflow-hidden">
                <div
                    className="bg-blue-600 h-full transition-all duration-300 ease-out"
                    style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                />
            </div>

            {/* Question */}
            <div className="flex-1">
                <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {currentQuestion.question}
                </h3>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                        let itemClass = `w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between `;

                        if (isAnswered) {
                            if (index === currentQuestion.correctAnswer) {
                                itemClass += "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400";
                            } else if (index === selectedOption) {
                                itemClass += "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400";
                            } else {
                                itemClass += isDarkMode ? "border-gray-700 text-gray-400 opacity-50" : "border-gray-200 text-gray-400 opacity-50";
                            }
                        } else {
                            if (selectedOption === index) {
                                itemClass += "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
                            } else {
                                itemClass += isDarkMode
                                    ? "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600"
                                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300";
                            }
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleOptionSelect(index)}
                                disabled={isAnswered}
                                className={itemClass}
                            >
                                <span>{option}</span>
                                {isAnswered && index === currentQuestion.correctAnswer && (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                )}
                                {isAnswered && index === selectedOption && index !== currentQuestion.correctAnswer && (
                                    <XCircle className="w-5 h-5 text-red-500" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-800">
                {!isAnswered ? (
                    <button
                        onClick={handleSubmitAnswer}
                        disabled={selectedOption === null}
                        className={`w-full py-3.5 rounded-xl font-semibold transition-all ${selectedOption === null
                                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30"
                            }`}
                    >
                        Check Answer
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="w-full py-3.5 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                    >
                        {isLastQuestion ? "Finish Quiz" : "Next Question"}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};
