import { useState, useEffect } from 'react';
import { DashboardView } from './components/DashboardView';
import { SetView } from './components/SetView';
import { StudyView } from './components/StudyView';
import { QuizView } from './components/QuizView';
import { BookOpen, Search } from 'lucide-react';

export interface Card {
  id: string;
  term: string;
  definition: string;
  hasCode: boolean;
  hasMath: boolean;
  mastered: boolean;
}

export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  sectionId: string;
  cards: Card[];
  createdAt: number;
  lastStudied?: number;
}

export interface Section {
  id: string;
  name: string;
  color: string;
}

type View = 'dashboard' | 'set' | 'study' | 'quiz';

const DEFAULT_SECTIONS: Section[] = [
  { id: 'default', name: 'Uncategorized', color: '#6B7280' },
  { id: 'math', name: 'Mathematics', color: '#3B82F6' },
  { id: 'cs', name: 'Computer Science', color: '#8B5CF6' },
  { id: 'science', name: 'Science', color: '#10B981' },
];

export default function App() {
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSections = localStorage.getItem('flashcard-sections');
    const savedSets = localStorage.getItem('flashcard-sets');
    
    if (savedSections) {
      setSections(JSON.parse(savedSections));
    }
    
    if (savedSets) {
      setSets(JSON.parse(savedSets));
    } else {
      // Add sample sets for demonstration
      const sampleSets: FlashcardSet[] = [
        {
          id: '1',
          title: 'Python Basics',
          description: 'Core Python syntax and data structures',
          sectionId: 'cs',
          createdAt: Date.now() - 86400000,
          cards: [
            {
              id: '1-1',
              term: 'What is a list comprehension in Python?',
              definition: 'A concise way to create lists. Syntax: [expression for item in iterable if condition]\n\nExample:\n```python\nsquares = [x**2 for x in range(10)]\nprint(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]\n```',
              hasCode: true,
              hasMath: false,
              mastered: false
            },
            {
              id: '1-2',
              term: 'Explain Python decorators',
              definition: 'Functions that modify the behavior of other functions. They use the @decorator syntax.\n\n```python\ndef my_decorator(func):\n    def wrapper():\n        print("Before function")\n        func()\n        print("After function")\n    return wrapper\n\n@my_decorator\ndef say_hello():\n    print("Hello!")\n```',
              hasCode: true,
              hasMath: false,
              mastered: false
            },
            {
              id: '1-3',
              term: 'What is the difference between append() and extend()?',
              definition: 'append() adds a single element to the end of a list, while extend() adds multiple elements.\n\n```python\nlist1 = [1, 2, 3]\nlist1.append([4, 5])  # [1, 2, 3, [4, 5]]\n\nlist2 = [1, 2, 3]\nlist2.extend([4, 5])  # [1, 2, 3, 4, 5]\n```',
              hasCode: true,
              hasMath: false,
              mastered: false
            }
          ]
        },
        {
          id: '2',
          title: 'Calculus I - Derivatives',
          description: 'Derivative rules and applications',
          sectionId: 'math',
          createdAt: Date.now() - 172800000,
          cards: [
            {
              id: '2-1',
              term: 'Power Rule',
              definition: 'If f(x) = x^n, then f\'(x) = nx^(n-1)\n\nExample: If f(x) = x³, then f\'(x) = 3x²',
              hasCode: false,
              hasMath: true,
              mastered: false
            },
            {
              id: '2-2',
              term: 'Chain Rule',
              definition: 'If y = f(g(x)), then dy/dx = f\'(g(x)) · g\'(x)\n\nExample: If y = (x² + 1)³\nLet u = x² + 1, then y = u³\ndy/dx = 3u² · 2x = 3(x² + 1)² · 2x',
              hasCode: false,
              hasMath: true,
              mastered: false
            },
            {
              id: '2-3',
              term: 'Product Rule',
              definition: 'If y = f(x) · g(x), then:\ny\' = f\'(x) · g(x) + f(x) · g\'(x)\n\nExample: If y = x² · sin(x)\ny\' = 2x · sin(x) + x² · cos(x)',
              hasCode: false,
              hasMath: true,
              mastered: false
            }
          ]
        }
      ];
      setSets(sampleSets);
      localStorage.setItem('flashcard-sets', JSON.stringify(sampleSets));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (sections.length > 0) {
      localStorage.setItem('flashcard-sections', JSON.stringify(sections));
    }
  }, [sections]);

  useEffect(() => {
    if (sets.length > 0) {
      localStorage.setItem('flashcard-sets', JSON.stringify(sets));
    }
  }, [sets]);

  const handleCreateSet = (set: FlashcardSet) => {
    setSets([...sets, set]);
  };

  const handleUpdateSet = (updatedSet: FlashcardSet) => {
    setSets(sets.map(s => s.id === updatedSet.id ? updatedSet : s));
    setSelectedSet(updatedSet);
  };

  const handleDeleteSet = (setId: string) => {
    setSets(sets.filter(s => s.id !== setId));
    if (selectedSet?.id === setId) {
      setSelectedSet(null);
      setCurrentView('dashboard');
    }
  };

  const handleOpenSet = (set: FlashcardSet) => {
    setSelectedSet(set);
    setCurrentView('set');
  };

  const handleStudySet = (set: FlashcardSet) => {
    setSelectedSet(set);
    setCurrentView('study');
  };

  const handleQuizSet = (set: FlashcardSet) => {
    setSelectedSet(set);
    setCurrentView('quiz');
  };

  const handleStudyComplete = (updatedSet: FlashcardSet) => {
    const setWithTimestamp = {
      ...updatedSet,
      lastStudied: Date.now()
    };
    setSets(sets.map(s => s.id === setWithTimestamp.id ? setWithTimestamp : s));
    setSelectedSet(null);
    setCurrentView('dashboard');
  };

  const handleQuizComplete = () => {
    if (selectedSet) {
      const setWithTimestamp = {
        ...selectedSet,
        lastStudied: Date.now()
      };
      setSets(sets.map(s => s.id === setWithTimestamp.id ? setWithTimestamp : s));
    }
    setSelectedSet(null);
    setCurrentView('dashboard');
  };

  const handleBackToDashboard = () => {
    setSelectedSet(null);
    setCurrentView('dashboard');
  };

  const handleCreateSection = (section: Section) => {
    setSections([...sections, section]);
  };

  const handleUpdateSection = (updatedSection: Section) => {
    setSections(sections.map(s => s.id === updatedSection.id ? updatedSection : s));
  };

  const handleDeleteSection = (sectionId: string) => {
    // Move sets to default section before deleting
    setSets(sets.map(s => s.sectionId === sectionId ? { ...s, sectionId: 'default' } : s));
    setSections(sections.filter(s => s.id !== sectionId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Always visible (Heuristic 4: Consistency) */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <button 
              onClick={handleBackToDashboard}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="text-left hidden sm:block">
                <h1 className="text-gray-900 text-lg">STEMCards</h1>
              </div>
            </button>

            {/* Search bar - Always accessible (Heuristic 7: Flexibility) */}
            {currentView === 'dashboard' && (
              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search flashcard sets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            )}

            {/* Breadcrumb navigation (Heuristic 1: Visibility of system status) */}
            {currentView !== 'dashboard' && selectedSet && (
              <div className="flex-1 flex items-center gap-2 text-sm">
                <button
                  onClick={handleBackToDashboard}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Dashboard
                </button>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900">{selectedSet.title}</span>
                {currentView !== 'set' && (
                  <>
                    <span className="text-gray-400">/</span>
                    <span className="text-indigo-600">
                      {currentView === 'study' ? 'Study' : 'Quiz'}
                    </span>
                  </>
                )}
              </div>
            )}

            {currentView !== 'dashboard' && (
              <button
                onClick={handleBackToDashboard}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Exit
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <DashboardView
            sets={sets}
            sections={sections}
            searchQuery={searchQuery}
            onOpenSet={handleOpenSet}
            onStudySet={handleStudySet}
            onQuizSet={handleQuizSet}
            onDeleteSet={handleDeleteSet}
            onCreateSet={handleCreateSet}
            onCreateSection={handleCreateSection}
            onUpdateSection={handleUpdateSection}
            onDeleteSection={handleDeleteSection}
          />
        )}

        {currentView === 'set' && selectedSet && (
          <SetView
            set={selectedSet}
            sections={sections}
            onUpdateSet={handleUpdateSet}
            onDeleteSet={handleDeleteSet}
            onStudy={handleStudySet}
            onQuiz={handleQuizSet}
            onBack={handleBackToDashboard}
          />
        )}

        {currentView === 'study' && selectedSet && (
          <StudyView
            set={selectedSet}
            onComplete={handleStudyComplete}
            onExit={handleBackToDashboard}
          />
        )}

        {currentView === 'quiz' && selectedSet && (
          <QuizView
            set={selectedSet}
            onComplete={handleQuizComplete}
            onExit={handleBackToDashboard}
          />
        )}
      </main>
    </div>
  );
}
