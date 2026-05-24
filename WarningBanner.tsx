import { useState } from 'react';

const STORAGE_KEY = 'orbitsage-warning-acknowledged';

export default function WarningBanner() {
  const [acknowledged, setAcknowledged] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });

  if (acknowledged) return null;

  const handleAcknowledge = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setAcknowledged(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 max-w-lg w-full shadow-2xl shadow-black/50 animate-fade-in-up">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <span className="text-xl">⚠️</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-2">
              Important Security Notice
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Your OpenRouter API key is stored locally in your browser (IndexedDB). 
              Anyone with access to this device or malicious browser extensions could 
              potentially access it. Protect yourself by{' '}
              <a
                href="https://openrouter.ai/settings/limits"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover underline underline-offset-2"
              >
                setting a spending limit
              </a>{' '}
              on your OpenRouter account. We are not liable for any unauthorized usage 
              of your API key.
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            onClick={handleAcknowledge}
            className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
