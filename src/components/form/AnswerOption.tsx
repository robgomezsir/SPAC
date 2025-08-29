'use client';

interface AnswerOptionProps {
  value: number;
  label: string;
  selected: boolean;
  onSelect: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export default function AnswerOption({
  value,
  label,
  selected,
  onSelect,
  disabled = false,
  className = ''
}: AnswerOptionProps) {
  return (
    <button
      onClick={() => onSelect(value)}
      disabled={disabled}
      className={`
        w-full p-4 text-left rounded-lg border-2 transition-all duration-200
        ${selected
          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-lg">
          {label}
        </span>
        
        {selected && (
          <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
          </div>
        )}
      </div>
    </button>
  );
}
