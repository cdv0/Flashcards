import { useState } from 'react';
import { FlashcardSet, Section, Card } from '../App';
import { Plus, Trash2, Brain, FileText, Code, Calculator, GripVertical, Play } from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { MathEditor } from './MathEditor';

interface SetViewProps {
  set: FlashcardSet;
  sections: Section[];
  onUpdateSet: (set: FlashcardSet) => void;
  onDeleteSet: (setId: string) => void;
  onStudy: (set: FlashcardSet) => void;
  onQuiz: (set: FlashcardSet) => void;
  onBack: () => void;
}

type EditorMode = 'text' | 'code' | 'math';

export function SetView({ set, sections, onUpdateSet, onDeleteSet, onStudy, onQuiz }: SetViewProps) {
  const [title, setTitle] = useState(set.title);
  const [description, setDescription] = useState(set.description);
  const [sectionId, setSectionId] = useState(set.sectionId);
  const [cards, setCards] = useState<Card[]>(set.cards);
  const [hasChanges, setHasChanges] = useState(false);

  // Track editor modes for term and definition of each card
  const [termModes, setTermModes] = useState<Record<string, EditorMode>>({});
  const [definitionModes, setDefinitionModes] = useState<Record<string, EditorMode>>({});

  const markAsChanged = () => setHasChanges(true);

  // Heuristic 7: Flexibility - Add card button always visible (not at bottom)
  const handleAddCard = () => {
    const newCard: Card = {
      id: `card-${Date.now()}`,
      term: '',
      definition: '',
      hasCode: false,
      hasMath: false,
      mastered: false
    };
    setCards([...cards, newCard]);
    markAsChanged();
  };

  const handleUpdateCard = (cardId: string, field: 'term' | 'definition', value: string) => {
    setCards(cards.map(card => {
      if (card.id === cardId) {
        const updated = { ...card, [field]: value };
        // Auto-detect code and math
        if (value.includes('```') || value.includes('function') || value.includes('class')) {
          updated.hasCode = true;
        }
        if (value.includes('∫') || value.includes('∑') || value.match(/\^\d/) || value.includes('√')) {
          updated.hasMath = true;
        }
        return updated;
      }
      return card;
    }));
    markAsChanged();
  };

  const handleDeleteCard = (cardId: string) => {
    // Heuristic 5: Error prevention - Confirmation
    if (confirm('Delete this card?')) {
      setCards(cards.filter(card => card.id !== cardId));
      markAsChanged();
    }
  };

  const handleSave = () => {
    const updatedSet: FlashcardSet = {
      ...set,
      title: title.trim(),
      description: description.trim(),
      sectionId,
      cards: cards.filter(c => c.term.trim() || c.definition.trim())
    };
    onUpdateSet(updatedSet);
    setHasChanges(false);
  };

  const getTermEditorMode = (cardId: string): EditorMode => {
    return termModes[cardId] || 'text';
  };

  const getDefinitionEditorMode = (cardId: string): EditorMode => {
    return definitionModes[cardId] || 'text';
  };

  const setTermEditorMode = (cardId: string, mode: EditorMode) => {
    setTermModes({ ...termModes, [cardId]: mode });
  };

  const setDefinitionEditorMode = (cardId: string, mode: EditorMode) => {
    setDefinitionModes({ ...definitionModes, [cardId]: mode });
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                markAsChanged();
              }}
              placeholder="Set Title"
              maxLength={100}
              className="w-full text-2xl text-gray-900 border-none outline-none focus:ring-0 px-0"
            />
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                markAsChanged();
              }}
              placeholder="Add a description..."
              rows={2}
              maxLength={200}
              className="w-full text-gray-600 border-none outline-none focus:ring-0 px-0 resize-none mt-2"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select
              value={sectionId}
              onChange={(e) => {
                setSectionId(e.target.value);
                markAsChanged();
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              {sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>

            <div className="text-sm text-gray-600">
              {cards.length} {cards.length === 1 ? 'term' : 'terms'}
            </div>
          </div>

          <div className="flex gap-2">
            {hasChanges && (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Save Changes
              </button>
            )}
            <button
              onClick={() => onStudy(set)}
              disabled={cards.length === 0}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Study
            </button>
            <button
              onClick={() => onQuiz(set)}
              disabled={cards.length === 0}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Add Card Button - Always visible (Addressing Quizlet's issue) */}
      <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 mb-4 sticky top-20 z-10">
        <button
          onClick={handleAddCard}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Card
        </button>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {cards.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No cards yet</h3>
            <p className="text-gray-600 mb-4">Add cards with terms and definitions to start studying</p>
            <p className="text-sm text-gray-500">✨ Supports code formatting and math equations</p>
          </div>
        ) : (
          cards.map((card, index) => (
            <div key={card.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              {/* Card Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Card {index + 1}</span>
                  {card.hasCode && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                      Code
                    </span>
                  )}
                  {card.hasMath && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                      Math
                    </span>
                  )}
                </div>

                {/* Quick delete (Addressing Quizlet/Omnisets issue) */}
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Delete card"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Term */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-700">Term</label>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setTermEditorMode(card.id, 'text')}
                        className={`p-1.5 rounded ${
                          getTermEditorMode(card.id) === 'text'
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title="Text"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setTermEditorMode(card.id, 'code')}
                        className={`p-1.5 rounded ${
                          getTermEditorMode(card.id) === 'code'
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title="Code"
                      >
                        <Code className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setTermEditorMode(card.id, 'math')}
                        className={`p-1.5 rounded ${
                          getTermEditorMode(card.id) === 'math'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title="Math"
                      >
                        <Calculator className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {getTermEditorMode(card.id) === 'text' && (
                    <textarea
                      value={card.term}
                      onChange={(e) => handleUpdateCard(card.id, 'term', e.target.value)}
                      placeholder="Enter term or question..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    />
                  )}
                  {getTermEditorMode(card.id) === 'code' && (
                    <CodeEditor
                      value={card.term}
                      onChange={(value) => handleUpdateCard(card.id, 'term', value)}
                      placeholder="Enter code..."
                    />
                  )}
                  {getTermEditorMode(card.id) === 'math' && (
                    <MathEditor
                      value={card.term}
                      onChange={(value) => handleUpdateCard(card.id, 'term', value)}
                      placeholder="Enter math expression..."
                    />
                  )}
                </div>

                {/* Definition */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-700">Definition</label>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setDefinitionEditorMode(card.id, 'text')}
                        className={`p-1.5 rounded ${
                          getDefinitionEditorMode(card.id) === 'text'
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title="Text"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDefinitionEditorMode(card.id, 'code')}
                        className={`p-1.5 rounded ${
                          getDefinitionEditorMode(card.id) === 'code'
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title="Code"
                      >
                        <Code className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDefinitionEditorMode(card.id, 'math')}
                        className={`p-1.5 rounded ${
                          getDefinitionEditorMode(card.id) === 'math'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title="Math"
                      >
                        <Calculator className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {getDefinitionEditorMode(card.id) === 'text' && (
                    <textarea
                      value={card.definition}
                      onChange={(e) => handleUpdateCard(card.id, 'definition', e.target.value)}
                      placeholder="Enter definition or answer..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    />
                  )}
                  {getDefinitionEditorMode(card.id) === 'code' && (
                    <CodeEditor
                      value={card.definition}
                      onChange={(value) => handleUpdateCard(card.id, 'definition', value)}
                      placeholder="Enter code..."
                    />
                  )}
                  {getDefinitionEditorMode(card.id) === 'math' && (
                    <MathEditor
                      value={card.definition}
                      onChange={(value) => handleUpdateCard(card.id, 'definition', value)}
                      placeholder="Enter math expression..."
                    />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom actions */}
      {cards.length > 0 && (
        <div className="mt-6 flex justify-end">
          {hasChanges && (
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Save All Changes
            </button>
          )}
        </div>
      )}
    </div>
  );
}
