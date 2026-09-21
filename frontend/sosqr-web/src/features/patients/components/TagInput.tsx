import { useState, type FC, type KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';

interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  helperText?: string;
}

export const TagInput: FC<TagInputProps> = ({
  label,
  tags,
  onChange,
  placeholder = 'Digite e pressione Enter...',
  helperText,
}) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="text-base font-semibold text-stone-900 block">{label}</label>

      {/* Chips list */}
      <div className="flex flex-wrap gap-2 min-h-[36px]">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 border border-stone-200 text-stone-900 text-sm font-semibold rounded-xl"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="text-stone-400 hover:text-rose-500 rounded-full focus:outline-none"
              aria-label={`Remover ${tag}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 rounded-xl border-2 border-stone-200 text-base focus:border-teal-700 focus:outline-none"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold border border-teal-700/20 rounded-xl flex items-center gap-1 text-sm"
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      </div>

      {helperText && <p className="text-xs text-stone-600">{helperText}</p>}
    </div>
  );
};
