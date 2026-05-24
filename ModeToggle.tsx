import type { ModelMode } from '../utils/openrouter';

interface ModeToggleProps {
  mode: ModelMode;
  onModeChange: (mode: ModelMode) => void;
}

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex items-center bg-dark-bg/80 rounded-xl p-1 border border-dark-border/40">
      <button
        onClick={() => onModeChange('math')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
          mode === 'math'
            ? 'bg-accent text-white shadow-md shadow-accent/30'
            : 'text-text-muted hover:text-text-secondary'
        }`}
      >
        <span>🧮</span>
        <span className="hidden sm:inline">Math</span>
      </button>
      <button
        onClick={() => onModeChange('diagram')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
          mode === 'diagram'
            ? 'bg-accent text-white shadow-md shadow-accent/30'
            : 'text-text-muted hover:text-text-secondary'
        }`}
      >
        <span>📊</span>
        <span className="hidden sm:inline">Diagram</span>
      </button>
    </div>
  );
}
