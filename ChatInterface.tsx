import { useState, useRef, useEffect } from 'react';
import ModeToggle from './ModeToggle';
import ImageUploader from './ImageUploader';
import MessageList, { EmptyState } from './MessageList';
import Footer from './Footer';
import type { ModelMode } from '../utils/openrouter';
import type { Message } from '../db';

interface ChatInterfaceProps {
  apiKey: string;
  messages: Message[];
  isLoading: boolean;
  mode: ModelMode;
  onModeChange: (mode: ModelMode) => void;
  onSendMessage: (apiKey: string, text: string, imageBase64?: string) => Promise<void>;
  onResetKey: () => void;
  onClearChat: () => void;
}

export default function ChatInterface({
  apiKey,
  messages,
  isLoading,
  mode,
  onModeChange,
  onSendMessage,
  onResetKey,
  onClearChat,
}: ChatInterfaceProps) {
  const [inputText, setInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close settings dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    }
    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSettings]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 160) + 'px';
    }
  }, [inputText]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text && !attachedImage) return;
    if (isLoading) return;

    setInputText('');
    setAttachedImage(null);
    await onSendMessage(apiKey, text, attachedImage || undefined);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExampleClick = (text: string) => {
    setInputText(text);
    inputRef.current?.focus();
  };

  const handleClearChat = () => {
    onClearChat();
    setShowSettings(false);
  };

  const handleResetKey = () => {
    onResetKey();
    setShowSettings(false);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="h-screen flex flex-col bg-dark-bg">
      {/* Header */}
      <header className="shrink-0 border-b border-dark-border/30 bg-dark-surface/50 backdrop-blur-xl">
        <div className="max-w-[900px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🪐</span>
              <h1 className="text-sm font-bold text-white tracking-tight">
                OrbitSage<span className="text-accent">/Study</span>
              </h1>
            </div>
            <ModeToggle mode={mode} onModeChange={onModeChange} />
          </div>

          {/* Settings */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-text-muted hover:text-text-secondary hover:bg-dark-bg/80 transition-all duration-200"
              title="Settings"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            {showSettings && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-dark-surface border border-dark-border rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-fade-in">
                <div className="p-1">
                  <button
                    onClick={handleClearChat}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-dark-bg/80 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    Clear Chat
                  </button>
                  <div className="h-px bg-dark-border/50 mx-2 my-1" />
                  <button
                    onClick={handleResetKey}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                    </svg>
                    Reset API Key
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Messages or Empty State */}
      {hasMessages || isLoading ? (
        <MessageList messages={messages} isLoading={isLoading} />
      ) : (
        <EmptyState onExampleClick={handleExampleClick} />
      )}

      {/* Input Area */}
      <div className="shrink-0 border-t border-dark-border/30 bg-dark-surface/30 backdrop-blur-xl">
        <div className="max-w-[900px] mx-auto px-4 py-3">
          {/* Attached image preview */}
          {attachedImage && (
            <div className="mb-3 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-dark-surface/80 rounded-xl px-3 py-2 border border-dark-border/50">
                <img
                  src={attachedImage}
                  alt="Attached"
                  className="h-10 w-10 rounded-lg object-cover"
                />
                <span className="text-xs text-text-muted">Image attached</span>
                <button
                  onClick={() => setAttachedImage(null)}
                  className="w-5 h-5 flex items-center justify-center rounded-full bg-dark-bg/80 text-text-muted hover:text-danger transition-colors text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div className="flex items-end gap-2">
            <ImageUploader
              onImageReady={setAttachedImage}
              attachedImage={attachedImage}
              onRemoveImage={() => setAttachedImage(null)}
            />

            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isLoading
                    ? 'Waiting for response...'
                    : 'Ask a STEM question... (Shift+Enter for new line)'
                }
                disabled={isLoading}
                rows={1}
                className="w-full px-4 py-3 bg-dark-bg/80 border border-dark-border/50 rounded-xl text-text-primary placeholder:text-text-muted text-sm resize-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all duration-200 disabled:opacity-50 max-h-40"
              />
            </div>

            <button
              onClick={handleSend}
              disabled={isLoading || (!inputText.trim() && !attachedImage)}
              className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20 hover:shadow-accent/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
              title="Send message"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-center mt-2">
            <p className="text-text-muted/60 text-[10px]">
              AI responses may be inaccurate. Verify important results.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
