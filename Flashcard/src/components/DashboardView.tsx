import { useState } from 'react';
import { FlashcardSet, Section } from '../App';
import { Plus, BookOpen, Brain, Trophy, MoreVertical, Edit2, Trash2, FolderPlus } from 'lucide-react';
import { CreateSetModal } from './CreateSetModal';
import { CreateSectionModal } from './CreateSectionModal';

interface DashboardViewProps {
  sets: FlashcardSet[];
  sections: Section[];
  searchQuery: string;
  onOpenSet: (set: FlashcardSet) => void;
  onStudySet: (set: FlashcardSet) => void;
  onQuizSet: (set: FlashcardSet) => void;
  onDeleteSet: (setId: string) => void;
  onCreateSet: (set: FlashcardSet) => void;
  onCreateSection: (section: Section) => void;
  onUpdateSection: (section: Section) => void;
  onDeleteSection: (sectionId: string) => void;
}

export function DashboardView({
  sets,
  sections,
  searchQuery,
  onOpenSet,
  onStudySet,
  onQuizSet,
  onDeleteSet,
  onCreateSet,
  onCreateSection,
  onUpdateSection,
  onDeleteSection
}: DashboardViewProps) {
  const [showCreateSetModal, setShowCreateSetModal] = useState(false);
  const [showCreateSectionModal, setShowCreateSectionModal] = useState(false);
  const [activeSetMenu, setActiveSetMenu] = useState<string | null>(null);
  const [activeSectionMenu, setActiveSectionMenu] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const filteredSets = sets.filter(set =>
    set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    set.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const getSectionName = (sectionId: string) => {
    return sections.find(s => s.id === sectionId)?.name || 'Uncategorized';
  };

  const getSectionColor = (sectionId: string) => {
    return sections.find(s => s.id === sectionId)?.color || '#6B7280';
  };

  const getSetsInSection = (sectionId: string) => {
    return filteredSets.filter(set => set.sectionId === sectionId);
  };

  // Heuristic 6: Recognition rather than recall - Show meaningful stats
  const totalCards = sets.reduce((sum, set) => sum + set.cards.length, 0);
  const studiedToday = sets.filter(s => s.lastStudied && formatDate(s.lastStudied) === 'Today').length;
  const totalMastered = sets.reduce((sum, set) => 
    sum + set.cards.filter(c => c.mastered).length, 0
  );

  return (
    <div>
      {/* Stats Overview (Heuristic 1: Visibility of system status) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sets</p>
              <p className="text-2xl text-gray-900">{sets.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Cards</p>
              <p className="text-2xl text-gray-900">{totalCards}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Mastered</p>
              <p className="text-2xl text-gray-900">{totalMastered}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Studied Today</p>
              <p className="text-2xl text-gray-900">{studiedToday}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions (Heuristic 7: Flexibility and efficiency of use) */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900">Your Flashcard Sets</h2>
          <p className="text-gray-600">Organized by sections for easy access</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateSectionModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FolderPlus className="w-4 h-4" />
            New Section
          </button>
          <button
            onClick={() => setShowCreateSetModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm"
          >
            <Plus className="w-5 h-5" />
            New Set
          </button>
        </div>
      </div>

      {/* Sections (Heuristic 8: Aesthetic and minimalist design) */}
      {sections.map(section => {
        const setsInSection = getSetsInSection(section.id);
        if (setsInSection.length === 0 && searchQuery) return null;

        return (
          <div key={section.id} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-1 h-8 rounded-full"
                  style={{ backgroundColor: section.color }}
                />
                <div>
                  <h3 className="text-gray-900">{section.name}</h3>
                  <p className="text-sm text-gray-600">{setsInSection.length} sets</p>
                </div>
              </div>

              {/* Section menu (Heuristic 4: Consistency - 3 dots) */}
              {section.id !== 'default' && (
                <div className="relative">
                  <button
                    onClick={() => setActiveSectionMenu(activeSectionMenu === section.id ? null : section.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>

                  {activeSectionMenu === section.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setActiveSectionMenu(null)}
                      />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                        <button
                          onClick={() => {
                            setEditingSection(section);
                            setShowCreateSectionModal(true);
                            setActiveSectionMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit Section
                        </button>
                        <button
                          onClick={() => {
                            // Heuristic 5: Error prevention - Confirmation dialog
                            if (confirm(`Delete "${section.name}" section? Sets will be moved to Uncategorized.`)) {
                              onDeleteSection(section.id);
                              setActiveSectionMenu(null);
                            }
                          }}
                          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Section
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {setsInSection.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border-2 border-dashed border-gray-300">
                <p className="text-gray-600">No sets in this section yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {setsInSection.map(set => (
                  <div
                    key={set.id}
                    className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all group"
                  >
                    {/* Set header */}
                    <div className="flex items-start justify-between mb-3">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => onOpenSet(set)}
                      >
                        <h4 className="text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">
                          {set.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{set.description}</p>
                      </div>

                      {/* Set menu (Heuristic 4: Consistency - 3 dots) */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSetMenu(activeSetMenu === set.id ? null : set.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>

                        {activeSetMenu === set.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActiveSetMenu(null)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                              <button
                                onClick={() => {
                                  onOpenSet(set);
                                  setActiveSetMenu(null);
                                }}
                                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Edit2 className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  // Heuristic 5: Error prevention
                                  if (confirm(`Delete "${set.title}"?`)) {
                                    onDeleteSet(set.id);
                                    setActiveSetMenu(null);
                                  }
                                }}
                                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Set metadata (Heuristic 6: Recognition rather than recall) */}
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Terms</span>
                        <span className="text-gray-900">{set.cards.length}</span>
                      </div>
                      {set.lastStudied && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Last studied</span>
                          <span className="text-gray-900">{formatDate(set.lastStudied)}</span>
                        </div>
                      )}
                      {/* Show STEM badges (Emphasize STEM features) */}
                      {(set.cards.some(c => c.hasCode) || set.cards.some(c => c.hasMath)) && (
                        <div className="flex gap-2 pt-2">
                          {set.cards.some(c => c.hasCode) && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                              Code
                            </span>
                          )}
                          {set.cards.some(c => c.hasMath) && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              Math
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions (Heuristic 7: Flexibility) */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => onStudySet(set)}
                        disabled={set.cards.length === 0}
                        className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        Study
                      </button>
                      <button
                        onClick={() => onQuizSet(set)}
                        disabled={set.cards.length === 0}
                        className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        Quiz
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Empty state (Heuristic 10: Help and documentation) */}
      {filteredSets.length === 0 && !searchQuery && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No flashcard sets yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first set to start studying. Supports code, math equations, and more!
          </p>
          <button
            onClick={() => setShowCreateSetModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Create Your First Set
          </button>
        </div>
      )}

      {filteredSets.length === 0 && searchQuery && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <p className="text-gray-600">No sets found matching "{searchQuery}"</p>
        </div>
      )}

      {/* Modals */}
      {showCreateSetModal && (
        <CreateSetModal
          sections={sections}
          onClose={() => setShowCreateSetModal(false)}
          onSave={(set) => {
            onCreateSet(set);
            setShowCreateSetModal(false);
          }}
        />
      )}

      {showCreateSectionModal && (
        <CreateSectionModal
          section={editingSection}
          onClose={() => {
            setShowCreateSectionModal(false);
            setEditingSection(null);
          }}
          onSave={(section) => {
            if (editingSection) {
              onUpdateSection(section);
            } else {
              onCreateSection(section);
            }
            setShowCreateSectionModal(false);
            setEditingSection(null);
          }}
        />
      )}
    </div>
  );
}
