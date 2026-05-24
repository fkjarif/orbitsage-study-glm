import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import hljs from 'highlight.js';
import type { Message } from '../db';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

function highlightCode(code: string, language?: string): string {
  try {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(code, { language }).value;
    }
    return hljs.highlightAuto(code).value;
  } catch {
    return code;
  }
}

function UserMessage({ message }: { message: Message }) {
  return (
    <div className="flex justify-end animate-fade-in-up">
      <div className="max-w-[85%] sm:max-w-[70%]">
        <div className="bg-gradient-to-r from-accent to-purple-600 px-4 py-3 rounded-2xl rounded-br-sm shadow-lg shadow-accent/10">
          {message.imageUrl && (
            <div className="mb-2">
              <img
                src={message.imageUrl}
                alt="Uploaded problem"
                className="max-h-40 rounded-lg object-cover"
              />
            </div>
          )}
          <p className="text-white text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}

function AssistantMessage({ message, isStreaming }: { message: Message; isStreaming: boolean }) {
  const content = message.content || '';
  const isError = content.startsWith('⚠️');

  return (
    <div className="flex justify-start animate-fade-in-up">
      <div className="max-w-[90%] sm:max-w-[80%]">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mt-0.5 border border-accent/20">
            <span className="text-sm">🪐</span>
          </div>
          <div
            className={`px-4 py-3 rounded-2xl rounded-bl-sm border flex-1 min-w-0 ${
              isError
                ? 'bg-danger/5 border-danger/20'
                : 'bg-bubble-assistant border-dark-border/30'
            }`}
          >
            <div className="markdown-body text-text-primary text-sm">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  pre({ children }) {
                    return (
                      <pre className="bg-zinc-900/80 rounded-lg overflow-x-auto my-3 border border-zinc-800 text-sm">
                        {children}
                      </pre>
                    );
                  },
                  code(props) {
                    const { className, children } = props;
                    const match = /language-(\w+)/.exec(className || '');
                    const code = String(children).replace(/\n$/, '');

                    if (match || code.includes('\n')) {
                      const lang = match?.[1];
                      const html = highlightCode(code, lang);
                      return (
                        <code
                          className={`${className || ''} hljs text-sm block`}
                          dangerouslySetInnerHTML={{ __html: html }}
                        />
                      );
                    }

                    return (
                      <code className="bg-zinc-800/80 px-1.5 py-0.5 rounded text-sm font-mono text-purple-300">
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
            {isStreaming && (
              <div className="flex items-center gap-1 mt-2">
                <div
                  className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-dot"
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-dot"
                  style={{ animationDelay: '200ms' }}
                />
                <div
                  className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-dot"
                  style={{ animationDelay: '400ms' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
          <span className="text-sm">🪐</span>
        </div>
        <div className="bg-bubble-assistant px-4 py-3 rounded-2xl rounded-bl-sm border border-dark-border/30">
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 bg-accent rounded-full animate-pulse-dot"
              style={{ animationDelay: '0ms' }}
            />
            <div
              className="w-2 h-2 bg-accent rounded-full animate-pulse-dot"
              style={{ animationDelay: '200ms' }}
            />
            <div
              className="w-2 h-2 bg-accent rounded-full animate-pulse-dot"
              style={{ animationDelay: '400ms' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const EXAMPLE_PROMPTS = [
  '∫ x² dx from 0 to 1',
  "Explain Newton's second law",
  'Solve: x² + 5x + 6 = 0',
  'What is the derivative of sin(x)?',
];

function EmptyState({ onExampleClick }: { onExampleClick: (text: string) => void }) {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-md animate-fade-in-up">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent/20 to-purple-600/20 flex items-center justify-center border border-accent/10">
          <span className="text-3xl">🪐</span>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">
          Welcome to OrbitSage/Study
        </h2>
        <p className="text-text-secondary text-sm mb-6">
          Ask me any STEM question. I can solve equations, explain concepts, and analyze images.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onExampleClick(prompt)}
              className="px-3 py-2 bg-dark-surface/80 border border-dark-border/50 rounded-xl text-xs text-text-secondary hover:text-text-primary hover:border-accent/30 hover:bg-dark-surface transition-all duration-200"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MessageList({
  messages,
  isLoading,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isStreaming = isLoading && messages.some((m) => m.id === -1);
  const showLoading = isLoading && !isStreaming;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.length === 0 && !isLoading ? null : (
        <>
          {messages.map((msg, i) =>
            msg.role === 'user' ? (
              <UserMessage key={msg.id ?? i} message={msg} />
            ) : (
              <AssistantMessage
                key={msg.id ?? i}
                message={msg}
                isStreaming={msg.id === -1}
              />
            ),
          )}
          {showLoading && <LoadingIndicator />}
        </>
      )}
    </div>
  );
}

export { EmptyState, EXAMPLE_PROMPTS };
