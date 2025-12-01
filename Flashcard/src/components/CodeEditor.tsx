import { useState } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CodeEditor({ value, onChange, placeholder }: CodeEditorProps) {
  const [language, setLanguage] = useState('python');

  const languages = [
    'python',
    'javascript',
    'java',
    'cpp',
    'c',
    'csharp',
    'ruby',
    'go',
    'swift',
    'sql'
  ];

  // Simple syntax highlighting simulation
  const formatCode = (code: string) => {
    if (!code) return null;
    
    const lines = code.split('\n');
    return (
      <div className="font-mono text-sm leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="text-gray-500 select-none w-8 text-right pr-3">{i + 1}</span>
            <span className="flex-1">{line || '\u00A0'}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-100 border-b border-gray-300 px-3 py-2 flex items-center gap-2">
        <span className="text-xs text-gray-600">Language:</span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="text-xs px-2 py-1 border border-gray-300 rounded bg-white"
        >
          {languages.map(lang => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>
        <span className="text-xs text-gray-500 ml-auto">Use ``` for code blocks</span>
      </div>

      {/* Editor */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Enter code here...\n\nTip: Use ``` to format code blocks'}
          rows={8}
          className="w-full px-3 py-2 font-mono text-sm bg-gray-900 text-gray-100 placeholder-gray-500 outline-none resize-none"
          spellCheck={false}
        />
      </div>

      {/* Preview hint */}
      {value && value.includes('```') && (
        <div className="bg-purple-50 border-t border-purple-200 px-3 py-2 text-xs text-purple-700">
          ✓ Code block detected - will be formatted during study
        </div>
      )}
    </div>
  );
}
