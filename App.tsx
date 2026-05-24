import KeyInput from './components/KeyInput';
import ChatInterface from './components/ChatInterface';
import WarningBanner from './components/WarningBanner';
import { useApiKey } from './hooks/useApiKey';
import { useChat } from './hooks/useChat';

export default function App() {
  const { apiKey, loading, saveKey, resetKey } = useApiKey();
  const { messages, isLoading, mode, setMode, sendMessage, clearChat } = useChat();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center animate-spin-slow">
            <span className="text-2xl">🪐</span>
          </div>
          <p className="text-text-muted text-sm">Loading OrbitSage...</p>
        </div>
      </div>
    );
  }

  if (!apiKey) {
    return <KeyInput onSave={saveKey} />;
  }

  return (
    <>
      <WarningBanner />
      <ChatInterface
        apiKey={apiKey}
        messages={messages}
        isLoading={isLoading}
        mode={mode}
        onModeChange={setMode}
        onSendMessage={sendMessage}
        onResetKey={resetKey}
        onClearChat={clearChat}
      />
    </>
  );
}
