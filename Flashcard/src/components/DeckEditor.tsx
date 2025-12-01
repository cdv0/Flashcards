import { useState } from 'react';
import { Deck, Flashcard } from '../App';
import { Plus, Trash2, Save, X } from 'lucide-react';

interface DeckEditorProps {
  deck?: Deck;
  onSave: (deck: Deck) => void;
  onCancel: () => void;
}

export function DeckEditor({ deck, onSave, onCancel }: DeckEditorProps) {
  const [name, setName] = useState(deck?.name || '');
  const [subject, setSubject] = useState(deck?.subject || '');
  const [cards, setCards] = useState<Flashcard[]>(deck?.cards || []);
  const [errors, setErrors] = useState<{ name?: string; subject?: string }>({});

  const isEditing = !!deck;

  const handleAddCard = () => {
    const newCard: Flashcard = {
      id: `${Date.now()}-${Math.random()}`,
      question: '',
      answer: '',
      mastered: false
    };
    setCards([...cards, newCard]);
  };

  const handleUpdateCard = (id: string, field: 'question' | 'answer', value: string) => {
    setCards(cards.map(card =>
      card.id === id ? { ...card, [field]: value } : card
    ));
  };

  const handleDeleteCard = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const validateForm = () => {
    const newErrors: { name?: string; subject?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Deck name is required';
    }
    
    if (!subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const filteredCards = cards.filter(card => card.question.trim() || card.answer.trim());

    const deckToSave: Deck = {
      id: deck?.id || `${Date.now()}`,
      name: name.trim(),
      subject: subject.trim(),
      cards: filteredCards,
      createdAt: deck?.createdAt || Date.now(),
      lastStudied: deck?.lastStudied
    };

    onSave(deckToSave);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2">
          {isEditing ? 'Edit Deck' : 'Create New Deck'}
        </h2>
        <p className="text-gray-600">
          {isEditing ? 'Update your flashcard deck' : 'Create a new flashcard deck to start studying'}
        </p>
      </div>

      {/* Deck Details */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <h3 className="text-gray-900 mb-4">Deck Information</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="deck-name" className="block text-sm text-gray-700 mb-2">
              Deck Name *
            </label>
            <input
              id="deck-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Introduction to Psychology"
              className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors`}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="deck-subject" className="block text-sm text-gray-700 mb-2">
              Subject *
            </label>
            <input
              id="deck-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Psychology, Biology, History"
              className={`w-full px-4 py-2 border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors`}
            />
            {errors.subject && (
              <p className="text-sm text-red-600 mt-1">{errors.subject}</p>
            )}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Flashcards ({cards.length})</h3>
          <button
            onClick={handleAddCard}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Card
          </button>
        </div>

        {cards.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-600 mb-4">No cards yet</p>
            <button
              onClick={handleAddCard}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Your First Card
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {cards.map((card, index) => (
              <div key={card.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm text-gray-600">Card {index + 1}</span>
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                    aria-label="Delete card"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`question-${card.id}`} className="block text-sm text-gray-700 mb-2">
                      Question
                    </label>
                    <textarea
                      id={`question-${card.id}`}
                      value={card.question}
                      onChange={(e) => handleUpdateCard(card.id, 'question', e.target.value)}
                      placeholder="Enter the question..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor={`answer-${card.id}`} className="block text-sm text-gray-700 mb-2">
                      Answer
                    </label>
                    <textarea
                      id={`answer-${card.id}`}
                      value={card.answer}
                      onChange={(e) => handleUpdateCard(card.id, 'answer', e.target.value)}
                      placeholder="Enter the answer..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
        >
          <Save className="w-4 h-4" />
          {isEditing ? 'Save Changes' : 'Create Deck'}
        </button>
      </div>
    </div>
  );
}
