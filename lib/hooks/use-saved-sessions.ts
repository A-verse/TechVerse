import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'techverse:saved-sessions';
const SYNC_EVENT = 'techverse:saved-sessions-changed';

function readStoredIds(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(id => typeof id === 'string') : [];
  } catch {
    // Corrupt or inaccessible storage (private browsing, etc.) — degrade to empty rather than throw.
    return [];
  }
}

function writeStoredIds(ids: string[]) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT));
  } catch {
    // Storage full or unavailable — the toggle simply won't persist this time.
  }
}

/**
 * "My Schedule" save/unsave, backed by localStorage.
 *
 * This is real, working persistence — not fake — but it is scoped to this
 * one browser, since the existing backend (see lib/db-api.ts) has no table
 * for per-account saved sessions. A cross-device version would need a
 * `saved_sessions(user_id, session_id)` table and API routes mirroring the
 * existing user-data pattern.
 */
export default function useSavedSessions() {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    setSavedIds(readStoredIds());

    const onChange = () => setSavedIds(readStoredIds());
    window.addEventListener(SYNC_EVENT, onChange);
    window.addEventListener('storage', onChange);

    return () => {
      window.removeEventListener(SYNC_EVENT, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  const toggleSave = useCallback((id: string) => {
    const current = readStoredIds();
    const next = current.includes(id)
      ? current.filter(existing => existing !== id)
      : [...current, id];
    writeStoredIds(next);
    setSavedIds(next);
  }, []);

  return { savedIds, isSaved, toggleSave };
}
