import { useState } from 'react';
import { validateApiKey } from '../utils/openrouter';

interface KeyInputProps {
  onSave: (key: string) => Promise<void>;
}

export default function KeyInput({ onSave }: KeyInputProps) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmed = key.trim();
    if (!trimmed) {
      setError('Please enter your OpenRouter API key.');
      return;
    }
    if (!validateApiKey(trimmed)) {
      setError('Key must start with "sk-or-" and be at least 21 characters.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onSave(trimmed);
    } catch {
      setError('Failed to save key. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-bg">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '1.5s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl"
        />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-purple-600 mb-6 shadow-lg shadow-accent/20">
            <span className="text-4xl">🪐</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            OrbitSage<span className="text-accent">/Study</span>
          </h1>
          <p className="text-text-secondary mt-2 text-sm">
            Your AI-powered STEM tutor. Bring your own API key.
          </p>
        </div>

        {/* Card */}
        <div className="bg-dark-surface/80 backdrop-blur-xl rounded-2xl p-6 border border-dark-border/50 shadow-2xl shadow-black/40">
          <h2 className="text-lg font-semibold text-white mb-1">Enter Your API Key</h2>
          <p className="text-text-muted text-sm mb-5">
            Paste your OpenRouter API key to get started. It will be stored securely in your browser.
          </p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="api-key"
                className="block text-sm font-medium text-text-secondary mb-2"
              >
                OpenRouter API Key
              </label>
              <input
                id="api-key"
                type="password"
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
                  setError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                placeholder="sk-or-..."
                className="w-full px-4 py-3 bg-dark-bg/80 border border-dark-border rounded-xl text-text-primary placeholder:text-text-muted text-sm font-mono focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 text-danger text-sm bg-danger/10 px-4 py-3 rounded-lg animate-fade-in">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving || !key.trim()}
              className="w-full py-3 px-6 bg-gradient-to-r from-accent to-purple-600 hover:from-accent-hover hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-accent/25 hover:shadow-accent/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                '🚀 Start Orbiting'
              )}
            </button>
          </div>

          <div className="mt-5 pt-4 border-t border-dark-border/50">
            <p className="text-text-muted text-xs text-center">
              Don&apos;t have an API key?{' '}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover transition-colors font-medium"
              >
                Get one free at OpenRouter →
              </a>
            </p>
          </div>
        </div>

        {/* Feature badges */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            Free models
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            100% local
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            LaTeX support
          </span>
        </div>
      </div>
    </div>
  );
}
