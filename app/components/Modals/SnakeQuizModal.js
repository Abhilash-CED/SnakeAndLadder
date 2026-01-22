'use client';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SnakeQuizModal = ({ isOpen, snakeName, questions, onClose, onComplete }) => {
    const { t } = useTranslation();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [shuffledOptions, setShuffledOptions] = useState([]);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen && questions) {
            setCurrentQuestion(0);
            setScore(0);
            setShowResult(false);
            setAnswers([]);
            setSelectedAnswer('');
            if (questions[0]) {
                setShuffledOptions(shuffleArray([...questions[0].options]));
            }
        }
    }, [isOpen, questions]);

    // Shuffle options when question changes
    useEffect(() => {
        if (questions && questions[currentQuestion]) {
            setShuffledOptions(shuffleArray([...questions[currentQuestion].options]));
        }
    }, [currentQuestion, questions]);

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const handleAnswerSelect = (option) => {
        setSelectedAnswer(option);
    };

    const handleSubmit = () => {
        if (!selectedAnswer) {
            alert(t('quiz_error_select'));
            return;
        }

        const currentQ = questions[currentQuestion];
        const isCorrect = selectedAnswer === currentQ.answer;

        const newAnswers = [...answers, {
            question: currentQ.question,
            selected: selectedAnswer,
            correct: currentQ.answer,
            isCorrect
        }];
        setAnswers(newAnswers);

        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedAnswer('');
        } else {
            setShowResult(true);
        }
    };

    const handleFinish = () => {
        if (onComplete) {
            onComplete(score, questions.length);
        }
        onClose();
    };

    if (!isOpen || !questions || questions.length === 0) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-800 border-2 border-yellow-600 rounded-xl shadow-2xl max-w-2xl w-full text-white animate-in fade-in zoom-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-gradient-to-r from-yellow-700 to-yellow-900 p-4 border-b border-yellow-600">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <span>❓</span>
                        {t('quiz_title_prefix')} {snakeName}
                    </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                    {!showResult ? (
                        <>
                            <div className="text-sm text-yellow-500 font-bold mb-4 uppercase tracking-wider">
                                {t('quiz_question_count', { current: currentQuestion + 1, total: questions.length })}
                            </div>

                            <div className="text-xl font-medium mb-6 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                                {questions[currentQuestion].question}
                            </div>

                            <div className="space-y-3">
                                {shuffledOptions.map((option, index) => (
                                    <label
                                        key={index}
                                        className={`flex items-center p-4 rounded-lg cursor-pointer transition border border-transparent ${selectedAnswer === option
                                            ? 'bg-yellow-600/20 border-yellow-500 text-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                                            : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="quiz-answer"
                                            value={option}
                                            checked={selectedAnswer === option}
                                            onChange={() => handleAnswerSelect(option)}
                                            className="form-radio h-5 w-5 text-yellow-500 focus:ring-yellow-500 border-gray-500 bg-slate-900"
                                        />
                                        <span className="ml-3 text-lg">{option}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    type="button"
                                    className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    onClick={handleSubmit}
                                    disabled={!selectedAnswer}
                                >
                                    {currentQuestion < questions.length - 1 ? t('quiz_next') : t('quiz_submit')}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center space-y-6">
                            <div className="bg-slate-700/50 rounded-xl p-8 border border-slate-600">
                                <h4 className="text-3xl font-bold text-white mb-2">{t('quiz_completed')}</h4>
                                <div className="text-5xl font-black text-yellow-400 my-4 shadow-yellow-500/20 drop-shadow-lg">
                                    {score} / {questions.length}
                                </div>
                                <div className={`text-xl font-bold px-4 py-2 rounded-full inline-block ${(score / questions.length) >= 0.7 ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                                    }`}>
                                    {Math.round((score / questions.length) * 100)}% {t('quiz_percentage_correct')}
                                </div>
                            </div>

                            <div className="space-y-4 text-left">
                                <h5 className="text-lg font-bold text-slate-400 border-b border-slate-700 pb-2">{t('quiz_details')}</h5>
                                {answers.map((ans, index) => (
                                    <div key={index} className={`p-4 rounded-lg border ${ans.isCorrect ? 'bg-green-900/10 border-green-800' : 'bg-red-900/10 border-red-800'}`}>
                                        <div className="font-medium text-slate-200 mb-2">Q{index + 1}: {ans.question}</div>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex gap-2">
                                                <span className="text-slate-400">{t('quiz_your_answer')}</span>
                                                <span className={ans.isCorrect ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{ans.selected}</span>
                                            </div>
                                            {!ans.isCorrect && (
                                                <div className="flex gap-2">
                                                    <span className="text-slate-400">{t('quiz_correct_answer')}</span>
                                                    <span className="text-green-400 font-bold">{ans.correct}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4">
                                <button
                                    type="button"
                                    className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-8 rounded-lg transition width-full sm:w-auto"
                                    onClick={handleFinish}
                                >
                                    {t('quiz_finish')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SnakeQuizModal;
