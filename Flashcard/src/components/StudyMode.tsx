import { useState } from 'react';
import { Deck, Flashcard } from '../App';
import { RotateCcw, Check, X, ChevronLeft, ChevronRight, Award } from 'lucide-react';

interface StudyModeProps {
  deck: Deck;
  onComplete: (deck: Deck) => void;
  onExit: () => void;
}

export function StudyMode({ deck, onComplete, onExit }: StudyModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState<Flashcard[]>(deck.cards);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMastered = (mastered: boolean) => {
    const updatedCards = cards.map((card, index) =>
      index === currentIndex ? { ...card, mastered } : card
    );
    setCards(updatedCards);

    if (mastered) {
      setSessionStats({ ...sessionStats, correct: sessionStats.correct + 1 });
    } else {
      setSessionStats({ ...sessionStats, incorrect: sessionStats.incorrect + 1 });
    }

    // Move to next card
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // Session complete
      setTimeout(() => {
        onComplete({ ...deck, cards: updatedCards });
      }, 500);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ correct: 0, incorrect: 0 });
  };

  if (cards.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <p className="text-gray-600 mb-6">This deck has no cards to study</p>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            Back to Decks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2">{deck.name}</h2>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{deck.subject}</span>
          <span>Card {currentIndex + 1} of {cards.length}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700">Mastered</span>
          </div>
          <p className="text-green-900">{sessionStats.correct}</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center gap-2 mb-1">
            <RotateCcw className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-orange-700">Review Again</span>
          </div>
          <p className="text-orange-900">{sessionStats.incorrect}</p>
        </div>
      </div>

      {/* Flashcard */}
      <div className="mb-8">
        <div
          className="relative bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 min-h-[400px] cursor-pointer transition-all hover:shadow-xl"
          onClick={handleFlip}
          style={{ perspective: '1000px' }}
        >
          <div
            className="absolute inset-0 p-8 flex flex-col items-center justify-center transition-all duration-500"
            style={{
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden'
            }}
          >
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">Question</p>
              <p className="text-gray-900 text-center">{currentCard.question}</p>
            </div>
            <p className="text-sm text-gray-500 mt-8">Tap to flip</p>
          </div>

          <div
            className="absolute inset-0 p-8 flex flex-col items-center justify-center transition-all duration-500"
            style={{
              transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden'
            }}
          >
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">Answer</p>
              <p className="text-gray-900 text-center">{currentCard.answer}</p>
            </div>
            <p className="text-sm text-gray-500 mt-8">Tap to flip back</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* How well did you know this? */}
        {isFlipped && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-4 text-center">How well did you know this?</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleMastered(false)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
              >
                <X className="w-5 h-5" />
                Review Again
              </button>
              <button
                onClick={() => handleMastered(true)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                <Check className="w-5 h-5" />
                Mastered
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-200"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <RotateCcw className="w-4 h-4" />
            Restart
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-200"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Exit */}
        <div className="text-center">
          <button
            onClick={() => onComplete({ ...deck, cards })}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Exit Study Session
          </button>
        </div>
      </div>
    </div>
  );
}
