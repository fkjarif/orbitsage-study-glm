const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export type ModelMode = 'math' | 'diagram';

export const MODELS: Record<ModelMode, string> = {
  math: 'qwen/qwen3-vl-30b-a3b-thinking:free',
  diagram: 'nvidia/nemotron-nano-12b-2-vl:free',
};

export const MODEL_LABELS: Record<ModelMode, string> = {
  math: 'Qwen3 VL 30B (Thinking)',
  diagram: 'Nemotron Nano 12B VL',
};

export type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | ContentPart[];
}

export async function sendChatMessage(
  apiKey: string,
  messages: ChatMessage[],
  mode: ModelMode,
  onChunk?: (chunk: string) => void,
): Promise<string> {
  const model = MODELS[mode];

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 2000,
      temperature: 0.7,
      stream: !!onChunk,
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Rate limit reached. Please wait a moment and try again.');
    }
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your OpenRouter key and try again.');
    }
    if (response.status === 402) {
      throw new Error('Insufficient credits. Please check your OpenRouter account balance.');
    }
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      (errorData as { error?: { message?: string } })?.error?.message ||
      `API Error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  if (onChunk && response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));

      for (const line of lines) {
        const data = line.slice(6).trim();
        if (data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta;
          if (delta?.content) {
            fullText += delta.content;
            onChunk(fullText);
          }
        } catch {
          // Skip malformed JSON chunks
        }
      }
    }

    return fullText;
  } else {
    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response received.';
  }
}

export function buildUserContent(
  text: string,
  imageBase64?: string,
): string | ContentPart[] {
  if (imageBase64) {
    const parts: ContentPart[] = [
      {
        type: 'text',
        text: `Solve this problem from the image. ${text || ''}`.trim(),
      },
      { type: 'image_url', image_url: { url: imageBase64 } },
    ];
    return parts;
  }
  return text;
}

export function validateApiKey(key: string): boolean {
  return key.startsWith('sk-or-') && key.length > 20;
}
