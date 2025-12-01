import { useState } from 'react';
import { FlashcardSet, Card } from '../App';
import { RotateCcw, Check, X, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';

interface StudyViewProps {
  set: FlashcardSet;
  onComplete: (set: FlashcardSet) => void;
  onExit: () => void;
}

export function StudyView({ set, onComplete, onExit }: StudyViewProps) {
  const [cards, setCards] = useState<Card[]>([...set.cards]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewedCards, setViewedCards] = useState<Set<number>>(new Set([0]));
  const [masteredCount, setMasteredCount] = useState(0);
  const [needsReviewCount, setNeedsReviewCount] = useState(0);

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKnow = (knows: boolean) => {
    const updatedCards = [...cards];
    updatedCards[currentIndex] = { ...updatedCards[currentIndex], mastered: knows };
    setCards(updatedCards);

    if (knows) {
      setMasteredCount(masteredCount + 1);
    } else {
      setNeedsReviewCount(needsReviewCount + 1);
    }

    // Move to next card automatically
    if (currentIndex < cards.length - 1) {
      goToNext();
    }
  };

  const goToNext = () => {
    if (currentIndex < cards.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setIsFlipped(false);
      setViewedCards(new Set([...viewedCards, newIndex]));
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setIsFlipped(false);
      setViewedCards(new Set([...viewedCards, newIndex]));
    }
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setViewedCards(new Set([0]));
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setViewedCards(new Set([0]));
    setMasteredCount(0);
    setNeedsReviewCount(0);
    setCards(cards.map(c => ({ ...c, mastered: false })));
  };

  const handleComplete = () => {
    const updatedSet: FlashcardSet = {
      ...set,
      cards: cards
    };
    onComplete(updatedSet);
  };

  const renderContent = (content: string, hasCode: boolean, hasMath: boolean) => {
    // Handle code blocks
    if (hasCode && content.includes('```')) {
      const parts = content.split('```');
      return (
        <div className="space-y-3">
          {parts.map((part, i) => {
            if (i % 2 === 1) {
              // Code block
              const lines = part.trim().split('\n');
              const language = lines[0];
              const code = lines.slice(1).join('\n');
              
              return (
                <div key={i} className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="bg-gray-800 px-3 py-1 text-xs text-gray-400">
                    {language || 'code'}
                  </div>
                  <pre className="p-4 overflow-x-auto">
                    <code className="text-sm text-gray-100 font-mono">{code}</code>
                  </pre>
                </div>
              );
            }
            return part.trim() && <p key={i} className="whitespace-pre-wrap">{part.trim()}</p>;
          })}
        </div>
      );
    }

    // Handle regular text with line breaks
    return <p className="whitespace-pre-wrap">{content}</p>;
  };

  if (cards.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <p className="text-gray-600 mb-6">This set has no cards to study</p>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Back to Set
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header (Heuristic 1: Visibility of system status) */}
      <div className="mb-6">
        <h2 className="text-gray-900 mb-2">Study Mode: {set.title}</h2>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Card {currentIndex + 1} of {cards.length}
          </span>
          <span className="text-gray-600">
            {viewedCards.size} viewed • {masteredCount} mastered • {needsReviewCount} need review
          </span>
        </div>
      </div>

      {/* Progress Bar (Heuristic 1: Visibility) */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
          <div className="text-2xl text-gray-900">{viewedCards.size}</div>
          <div className="text-sm text-gray-600">Viewed</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-center">
          <div className="text-2xl text-green-700">{masteredCount}</div>
          <div className="text-sm text-green-600">Mastered</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 text-center">
          <div className="text-2xl text-orange-700">{needsReviewCount}</div>
          <div className="text-sm text-orange-600">Review</div>
        </div>
      </div>

      {/* Flashcard (Heuristic 8: Aesthetic and minimalist - full screen during study) */}
      <div className="mb-6">
        <div
          className="relative bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-12 min-h-[450px] cursor-pointer transition-all hover:shadow-2xl"
          onClick={handleFlip}
        >
          {/* Front side */}
          <div
            className={`absolute inset-0 p-12 flex flex-col items-center justify-center transition-all duration-500 ${
              isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            style={{
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden'
            }}
          >
            <div className="text-center max-w-full overflow-auto">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="text-sm text-indigo-600">TERM</span>
                {currentCard.hasCode && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                    Code
                  </span>
                )}
                {currentCard.hasMath && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                    Math
                  </span>
                )}
              </div>
              <div className="text-gray-900 text-lg max-w-2xl">
                {renderContent(currentCard.term, currentCard.hasCode, currentCard.hasMath)}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-8 absolute bottom-8">Click to flip</p>
          </div>

          {/* Back side */}
          <div
            className={`absolute inset-0 p-12 flex flex-col items-center justify-center transition-all duration-500 ${
              isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{
              transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden'
            }}
          >
            <div className="text-center max-w-full overflow-auto">
              <span className="text-sm text-purple-600 mb-4 block">DEFINITION</span>
              <div className="text-gray-900 text-lg max-w-2xl">
                {renderContent(currentCard.definition, currentCard.hasCode, currentCard.hasMath)}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-8 absolute bottom-8">Click to flip back</p>
          </div>
        </div>
      </div>

      {/* Rate your knowledge (Heuristic 2: Match real world) */}
      {isFlipped && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <p className="text-sm text-gray-700 mb-4 text-center">How well did you know this?</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleKnow(false)}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-orange-50 text-orange-700 border-2 border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <X className="w-5 h-5" />
              <span>Need to Review</span>
            </button>
            <button
              onClick={() => handleKnow(true)}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-green-50 text-green-700 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Check className="w-5 h-5" />
              <span>I Know This</span>
            </button>
          </div>
        </div>
      )}

      {/* Navigation (Heuristic 3: User control and freedom) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleShuffle}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Shuffle cards"
            >
              <Shuffle className="w-4 h-4" />
              Shuffle
            </button>
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Restart
            </button>
          </div>

          <button
            onClick={goToNext}
            disabled={currentIndex === cards.length - 1}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Complete study session */}
        <div className="text-center pt-4 border-t border-gray-200">
          <button
            onClick={handleComplete}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Complete Study Session
          </button>
        </div>
      </div>
    </div>
  );
}
