import { Deck } from '../App';
import { Plus, Book, Calendar, TrendingUp, Edit2, Trash2, PlayCircle } from 'lucide-react';

interface DeckListProps {
  decks: Deck[];
  onStudyDeck: (deck: Deck) => void;
  onEditDeck: (deck: Deck) => void;
  onDeleteDeck: (deckId: string) => void;
  onCreateNew: () => void;
}

export function DeckList({ decks, onStudyDeck, onEditDeck, onDeleteDeck, onCreateNew }: DeckListProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getMasteredPercentage = (deck: Deck) => {
    if (deck.cards.length === 0) return 0;
    const masteredCount = deck.cards.filter(card => card.mastered).length;
    return Math.round((masteredCount / deck.cards.length) * 100);
  };

  return (
    <div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Book className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Decks</p>
              <p className="text-gray-900">{decks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Cards</p>
              <p className="text-gray-900">{decks.reduce((sum, deck) => sum + deck.cards.length, 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Studied Today</p>
              <p className="text-gray-900">
                {decks.filter(d => d.lastStudied && formatDate(d.lastStudied) === 'Today').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900">Your Flashcard Decks</h2>
          <p className="text-gray-600">Select a deck to start studying or create a new one</p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          New Deck
        </button>
      </div>

      {/* Deck Grid */}
      {decks.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No decks yet</h3>
          <p className="text-gray-600 mb-6">Create your first flashcard deck to get started</p>
          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Create Deck
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map(deck => {
            const masteredPercentage = getMasteredPercentage(deck);
            return (
              <div
                key={deck.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                {/* Deck Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-gray-900 flex-1">{deck.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{deck.subject}</p>
                </div>

                {/* Deck Stats */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Cards</span>
                    <span className="text-gray-900">{deck.cards.length}</span>
                  </div>
                  {deck.lastStudied && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last studied</span>
                      <span className="text-gray-900">{formatDate(deck.lastStudied)}</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-gray-900">{masteredPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${masteredPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onStudyDeck(deck)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                    disabled={deck.cards.length === 0}
                  >
                    <PlayCircle className="w-4 h-4" />
                    Study
                  </button>
                  <button
                    onClick={() => onEditDeck(deck)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    aria-label="Edit deck"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${deck.name}"?`)) {
                        onDeleteDeck(deck.id);
                      }
                    }}
                    className="px-4 py-2 bg-gray-100 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    aria-label="Delete deck"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
