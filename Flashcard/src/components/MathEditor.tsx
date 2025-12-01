interface MathEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MATH_SYMBOLS = [
  { symbol: '∫', name: 'Integral', code: '\\int' },
  { symbol: '∑', name: 'Sum', code: '\\sum' },
  { symbol: '∏', name: 'Product', code: '\\prod' },
  { symbol: '√', name: 'Square root', code: '\\sqrt' },
  { symbol: '∞', name: 'Infinity', code: '\\infty' },
  { symbol: '±', name: 'Plus-minus', code: '\\pm' },
  { symbol: '≠', name: 'Not equal', code: '\\neq' },
  { symbol: '≤', name: 'Less or equal', code: '\\leq' },
  { symbol: '≥', name: 'Greater or equal', code: '\\geq' },
  { symbol: '×', name: 'Times', code: '\\times' },
  { symbol: '÷', name: 'Divide', code: '\\div' },
  { symbol: 'α', name: 'Alpha', code: '\\alpha' },
  { symbol: 'β', name: 'Beta', code: '\\beta' },
  { symbol: 'θ', name: 'Theta', code: '\\theta' },
  { symbol: 'π', name: 'Pi', code: '\\pi' },
  { symbol: 'Δ', name: 'Delta', code: '\\Delta' },
];

export function MathEditor({ value, onChange, placeholder }: MathEditorProps) {
  const insertSymbol = (symbol: string) => {
    onChange(value + symbol);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar with symbols */}
      <div className="bg-blue-50 border-b border-blue-200 p-2">
        <div className="flex flex-wrap gap-1">
          {MATH_SYMBOLS.map((item) => (
            <button
              key={item.symbol}
              onClick={() => insertSymbol(item.symbol)}
              className="px-2 py-1 bg-white hover:bg-blue-100 border border-blue-200 rounded text-sm transition-colors"
              title={item.name}
              type="button"
            >
              {item.symbol}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Click symbols to insert • Use ^ for superscript (e.g., x^2) • Use _ for subscript
        </p>
      </div>

      {/* Editor */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Enter math expression...\n\nExample: f(x) = x² + 2x + 1\nDerivative: f\'(x) = 2x + 2'}
        rows={8}
        className="w-full px-3 py-2 font-mono text-sm outline-none resize-none"
      />

      {/* Helper */}
      <div className="bg-blue-50 border-t border-blue-200 px-3 py-2">
        <p className="text-xs text-blue-700">
          <strong>Tips:</strong> Use x^2 for x², use √x for square root, use ∫ for integrals
        </p>
      </div>
    </div>
  );
}
