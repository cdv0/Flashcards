import { useState } from 'react';
import { FlashcardSet, Section } from '../App';
import { X } from 'lucide-react';

interface CreateSetModalProps {
  sections: Section[];
  onClose: () => void;
  onSave: (set: FlashcardSet) => void;
}

export function CreateSetModal({ sections, onClose, onSave }: CreateSetModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sectionId, setSectionId] = useState(sections[0]?.id || 'default');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  // Heuristic 1: Visibility of system status - Character counters
  const titleLength = title.length;
  const descriptionLength = description.length;
  const maxTitleLength = 100;
  const maxDescriptionLength = 200;

  const validate = () => {
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > maxTitleLength) {
      newErrors.title = `Title must be ${maxTitleLength} characters or less`;
    }

    if (description.length > maxDescriptionLength) {
      newErrors.description = `Description must be ${maxDescriptionLength} characters or less`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const newSet: FlashcardSet = {
      id: `${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      sectionId,
      cards: [],
      createdAt: Date.now()
    };

    onSave(newSet);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Create New Flashcard Set</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Title (Heuristic 5: Error prevention - Max length) */}
          <div>
            <label htmlFor="set-title" className="block text-sm text-gray-700 mb-2">
              Title *
            </label>
            <input
              id="set-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Data Structures & Algorithms"
              maxLength={maxTitleLength}
              className={`w-full px-4 py-2 border ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title}</p>
              )}
              <p className={`text-xs ml-auto ${
                titleLength > maxTitleLength * 0.9 ? 'text-orange-600' : 'text-gray-500'
              }`}>
                {titleLength}/{maxTitleLength}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="set-description" className="block text-sm text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              id="set-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this set covers..."
              rows={3}
              maxLength={maxDescriptionLength}
              className={`w-full px-4 py-2 border ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none`}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
              <p className={`text-xs ml-auto ${
                descriptionLength > maxDescriptionLength * 0.9 ? 'text-orange-600' : 'text-gray-500'
              }`}>
                {descriptionLength}/{maxDescriptionLength}
              </p>
            </div>
          </div>

          {/* Section (Heuristic 6: Recognition rather than recall) */}
          <div>
            <label htmlFor="set-section" className="block text-sm text-gray-700 mb-2">
              Section
            </label>
            <select
              id="set-section"
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              {sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer (Heuristic 3: User control and freedom) */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Create Set
          </button>
        </div>
      </div>
    </div>
  );
}
