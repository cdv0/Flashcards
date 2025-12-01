import { useState } from 'react';
import { Section } from '../App';
import { X } from 'lucide-react';

interface CreateSectionModalProps {
  section?: Section | null;
  onClose: () => void;
  onSave: (section: Section) => void;
}

const PRESET_COLORS = [
  { name: 'Gray', value: '#6B7280' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Green', value: '#10B981' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
];

export function CreateSectionModal({ section, onClose, onSave }: CreateSectionModalProps) {
  const [name, setName] = useState(section?.name || '');
  const [color, setColor] = useState(section?.color || PRESET_COLORS[0].value);
  const [error, setError] = useState('');

  const isEditing = !!section;

  const handleSave = () => {
    if (!name.trim()) {
      setError('Section name is required');
      return;
    }

    const sectionData: Section = {
      id: section?.id || `section-${Date.now()}`,
      name: name.trim(),
      color
    };

    onSave(sectionData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-gray-900">
            {isEditing ? 'Edit Section' : 'Create New Section'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="section-name" className="block text-sm text-gray-700 mb-2">
              Section Name *
            </label>
            <input
              id="section-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="e.g., Spring 2025 Classes"
              maxLength={50}
              className={`w-full px-4 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
            />
            {error && (
              <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
          </div>

          {/* Color (Heuristic 3: User control - Choose section color) */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Section Color
            </label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_COLORS.map(presetColor => (
                <button
                  key={presetColor.value}
                  onClick={() => setColor(presetColor.value)}
                  className={`w-full aspect-square rounded-lg transition-all ${
                    color === presetColor.value
                      ? 'ring-2 ring-offset-2 ring-indigo-600 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: presetColor.value }}
                  title={presetColor.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
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
            {isEditing ? 'Save Changes' : 'Create Section'}
          </button>
        </div>
      </div>
    </div>
  );
}
