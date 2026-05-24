import { useState, useEffect, useCallback } from 'react';
import { db } from '../db';

export function useApiKey() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.settings
      .get('openrouter-key')
      .then((row) => {
        setApiKey(row?.value ?? null);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const saveKey = useCallback(async (key: string) => {
    await db.settings.put({ key: 'openrouter-key', value: key });
    setApiKey(key);
  }, []);

  const resetKey = useCallback(async () => {
    await db.settings.delete('openrouter-key');
    setApiKey(null);
  }, []);

  return { apiKey, loading, saveKey, resetKey };
}
