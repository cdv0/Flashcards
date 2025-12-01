import { useState, useEffect } from 'react';
import { FlashcardSet, Card } from '../App';
import { CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react';

interface QuizViewProps {
  set: FlashcardSet;
  onComplete: () => void;
  onExit: () => void;
}

interface Question {
  card: Card;
  options: string[];
  correctAnswer: string;
  selectedAnswer?: string;
}

export function QuizView({ set, onComplete, onExit }: QuizViewProps) {
  const [quizSize, setQuizSize] = useState<number | 'all'>('all');
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Generate quiz questions
  const generateQuiz = (size: number | 'all') => {
    let cardsToUse = [...set.cards];
    
    if (size !== 'all' && cardsToUse.length > size) {
      // Randomly select cards
      cardsToUse = cardsToUse.sort(() => Math.random() - 0.5).slice(0, size);
    }

    const quizQuestions: Question[] = cardsToUse.map(card => {
      // Generate wrong answers from other cards
      const otherCards = set.cards.filter(c => c.id !== card.id);
      const wrongAnswers = otherCards
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(c => c.definition);

      // Combine and shuffle options
      const options = [card.definition, ...wrongAnswers]
        .sort(() => Math.random() - 0.5);

      return {
        card,
        options,
        correctAnswer: card.definition,
        selectedAnswer: undefined
      };
    });

    setQuestions(quizQuestions);
    setQuizStarted(true);
  };

  const handleStartQuiz = () => {
    const size = quizSize === 'all' ? set.cards.length : Math.min(quizSize, set.cards.length);
    generateQuiz(quizSize);
  };

  const handleSelectAnswer = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    // Update question with selected answer
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].selectedAnswer = selectedAnswer;
    setQuestions(updatedQuestions);

    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRetakeQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
    setQuestions([]);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Setup screen (Heuristic 7: Flexibility - User can choose quiz size)
  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-gray-900 mb-2">Quiz Setup</h2>
          <p className="text-gray-600 mb-6">Choose how many questions you want in your quiz</p>

          <div className="space-y-3 mb-6">
            <p className="text-sm text-gray-700 mb-2">Number of questions:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[5, 10, 15].map(size => (
                <button
                  key={size}
                  onClick={() => setQuizSize(size)}
                  disabled={set.cards.length < size}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    quizSize === size
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {size}
                </button>
              ))}
              <button
                onClick={() => setQuizSize('all')}
                className={`px-4 py-3 rounded-lg border-2 transition-all ${
                  quizSize === 'all'
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300'
                }`}
              >
                All ({set.cards.length})
              </button>
            </div>
            {set.cards.length < 4 && (
              <p className="text-sm text-orange-600 mt-2">
                ⚠️ Need at least 4 cards for multiple choice quiz
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onExit}
              className="flex-1 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStartQuiz}
              disabled={set.cards.length < 4}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              passed ? 'bg-green-100' : 'bg-orange-100'
            }`}>
              <Trophy className={`w-10 h-10 ${passed ? 'text-green-600' : 'text-orange-600'}`} />
            </div>
            <h2 className="text-gray-900 mb-2">Quiz Complete!</h2>
            <p className="text-gray-600">Here are your results</p>
          </div>

          {/* Score display (Heuristic 1: Visibility of system status) */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 mb-6 text-center border border-purple-200">
            <div className="text-5xl text-gray-900 mb-2">
              {score}/{questions.length}
            </div>
            <div className="text-xl text-gray-700 mb-4">{percentage}%</div>
            <div className={`inline-block px-4 py-2 rounded-lg ${
              passed ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {passed ? '✓ Passed' : 'Keep studying!'}
            </div>
          </div>

          {/* Question review */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {questions.map((question, index) => {
              const isCorrect = question.selectedAnswer === question.correctAnswer;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 mb-2">
                        <strong>Q{index + 1}:</strong> {question.card.term}
                      </p>
                      {!isCorrect && (
                        <div className="text-sm space-y-1">
                          <p className="text-red-700">
                            <strong>Your answer:</strong> {question.selectedAnswer}
                          </p>
                          <p className="text-green-700">
                            <strong>Correct answer:</strong> {question.correctAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onComplete}
              className="flex-1 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Set
            </button>
            <button
              onClick={handleRetakeQuiz}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz screen
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header (Heuristic 1: Visibility of system status) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-gray-900">Quiz: {set.title}</h2>
          <span className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
          <span>Score: {score}/{currentQuestionIndex + (isAnswered ? 1 : 0)}</span>
          <span>{Math.round((score / questions.length) * 100)}%</span>
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-6">
        <p className="text-sm text-purple-600 mb-3">QUESTION</p>
        <p className="text-xl text-gray-900 mb-8">{currentQuestion.card.term}</p>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentQuestion.correctAnswer;
            const showCorrectness = isAnswered;

            let buttonClass = 'border-gray-300 bg-white hover:border-purple-300';
            
            if (showCorrectness) {
              if (isCorrect) {
                buttonClass = 'border-green-500 bg-green-50';
              } else if (isSelected && !isCorrect) {
                buttonClass = 'border-red-500 bg-red-50';
              }
            } else if (isSelected) {
              buttonClass = 'border-purple-600 bg-purple-50';
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(option)}
                disabled={isAnswered}
                className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${buttonClass} ${
                  isAnswered ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 flex-shrink-0">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-900 flex-1">{option}</span>
                  {showCorrectness && isCorrect && (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )}
                  {showCorrectness && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        {!isAnswered ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
          </button>
        )}
      </div>
    </div>
  );
}
