import { useState, useEffect, useCallback, useRef } from 'react';
import { db, type Message } from '../db';
import {
  sendChatMessage,
  buildUserContent,
  type ModelMode,
  type ChatMessage,
} from '../utils/openrouter';

const SYSTEM_PROMPT =
  'You are OrbitSage, a helpful STEM tutor specializing in mathematics, physics, engineering, and computer science. Explain concepts step by step. Use LaTeX for mathematical formulas — wrap inline math in \\( ... \\) and display math in \\[ ... \\]. Use markdown formatting for structure (bold, lists, code blocks). Be clear, encouraging, and thorough.';

const DEFAULT_CHAT_ID = 'default';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ModelMode>('math');
  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const msgs = await db.messages
      .where('chatId')
      .equals(DEFAULT_CHAT_ID)
      .sortBy('timestamp');
    setMessages(msgs);
    messagesRef.current = msgs;
  };

  const sendMessage = useCallback(
    async (apiKey: string, text: string, imageBase64?: string) => {
      const currentMessages = messagesRef.current;
      const userContent = buildUserContent(text, imageBase64);

      const userMsg: Message = {
        chatId: DEFAULT_CHAT_ID,
        role: 'user',
        content: text || 'Please solve the problem in the image.',
        imageUrl: imageBase64,
        timestamp: Date.now(),
      };

      const id = await db.messages.add(userMsg);
      userMsg.id = id as number;
      const updatedMessages = [...currentMessages, userMsg];
      setMessages(updatedMessages);
      messagesRef.current = updatedMessages;

      setIsLoading(true);

      try {
        const chatMessages: ChatMessage[] = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...currentMessages.map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
          { role: 'user', content: userContent },
        ];

        let isFirstChunk = true;

        const assistantContent = await sendChatMessage(
          apiKey,
          chatMessages,
          mode,
          (chunk) => {
            if (isFirstChunk) {
              isFirstChunk = false;
            }
            setMessages((prev) => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg?.role === 'assistant' && lastMsg.id === -1) {
                return prev.map((m) =>
                  m.id === -1 ? { ...m, content: chunk } : m,
                );
              }
              return [
                ...prev,
                {
                  id: -1,
                  chatId: DEFAULT_CHAT_ID,
                  role: 'assistant' as const,
                  content: chunk,
                  timestamp: Date.now(),
                },
              ];
            });
          },
        );

        const assistantMsg: Message = {
          chatId: DEFAULT_CHAT_ID,
          role: 'assistant',
          content: assistantContent,
          timestamp: Date.now(),
        };

        const aid = await db.messages.add(assistantMsg);

        setMessages((prev) => {
          const updated = prev.map((m) =>
            m.id === -1 ? { ...m, id: aid as number, content: assistantContent } : m,
          );
          messagesRef.current = updated;
          return updated;
        });
      } catch (error) {
        const errMsg =
          error instanceof Error ? error.message : 'An unexpected error occurred.';
        const errorMsg: Message = {
          chatId: DEFAULT_CHAT_ID,
          role: 'assistant',
          content: `⚠️ **Error:** ${errMsg}`,
          timestamp: Date.now(),
        };
        const eid = await db.messages.add(errorMsg);
        errorMsg.id = eid as number;
        setMessages((prev) => {
          const updated = prev.map((m) =>
            m.id === -1 ? { ...m, id: eid as number, content: errMsg } : m,
          );
          if (!updated.some((m) => m.id === eid as number)) {
            updated.push(errorMsg);
          }
          messagesRef.current = updated;
          return updated;
        });
      } finally {
        setIsLoading(false);
      }
    },
    [mode],
  );

  const clearChat = useCallback(async () => {
    await db.messages.where('chatId').equals(DEFAULT_CHAT_ID).delete();
    setMessages([]);
    messagesRef.current = [];
  }, []);

  return { messages, isLoading, mode, setMode, sendMessage, clearChat };
}
