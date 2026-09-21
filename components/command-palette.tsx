import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useOverlay, usePreventScroll, useModal, OverlayContainer } from '@react-aria/overlays';
import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import type { SearchResult, SearchResultType } from '@lib/types';
import styles from './command-palette.module.css';

const TYPE_LABEL: Record<SearchResultType, string> = {
  session: 'Sessions',
  speaker: 'Speakers',
  company: 'Expo',
  job: 'Jobs'
};

const TYPE_ORDER: SearchResultType[] = ['session', 'speaker', 'company', 'job'];

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CommandPalette({ isOpen, onClose }: Props) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');

  const { overlayProps } = useOverlay({ isOpen, onClose, isDismissable: true }, ref);
  const { modalProps } = useModal();
  const { dialogProps } = useDialog({ 'aria-label': 'Search TechVerse' }, ref);

  usePreventScroll({ isDisabled: !isOpen });

  useEffect(() => {
    if (!isOpen) return;

    setLoadState('loading');
    fetch('/api/search-index')
      .then(res => {
        if (!res.ok) throw new Error('Search is temporarily unavailable.');
        return res.json();
      })
      .then((data: SearchResult[]) => {
        setResults(Array.isArray(data) ? data : []);
        setLoadState('ready');
      })
      .catch(() => setLoadState('error'));

    setQuery('');
    setActiveIndex(0);
    // Focus the input once the dialog has mounted.
    const timer = setTimeout(() => inputRef.current?.focus(), 10);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return results.filter(
      r => r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q)
    );
  }, [query, results]);

  const grouped = useMemo(() => {
    const groups: { type: SearchResultType; items: SearchResult[] }[] = [];
    for (const type of TYPE_ORDER) {
      const items = filtered.filter(r => r.type === type);
      if (items.length > 0) groups.push({ type, items });
    }
    return groups;
  }, [filtered]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const goTo = (url: string) => {
    onClose();
    router.push(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filtered[activeIndex];
      if (target) goTo(target.url);
    }
  };

  let runningIndex = -1;

  return (
    <OverlayContainer>
      <div className={styles.backdrop}>
        <FocusScope contain restoreFocus autoFocus>
          <div
            ref={ref}
            className={styles.dialog}
            {...overlayProps}
            {...dialogProps}
            {...modalProps}
            onKeyDown={handleKeyDown}
          >
            <div className={styles.inputRow}>
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search sessions, speakers, companies, jobs…"
                className={styles.input}
                aria-label="Search TechVerse"
                aria-activedescendant={
                  filtered[activeIndex] ? `search-result-${activeIndex}` : undefined
                }
                role="combobox"
                aria-expanded={filtered.length > 0}
                aria-controls="search-results"
              />
              <button
                type="button"
                onClick={onClose}
                className={styles.closeButton}
                aria-label="Close search"
              >
                Esc
              </button>
            </div>

            <div id="search-results" role="listbox" className={styles.results}>
              {loadState === 'error' && (
                <p className={styles.message}>
                  Search is temporarily unavailable. Try again shortly.
                </p>
              )}
              {loadState === 'ready' && query.trim() && filtered.length === 0 && (
                <p className={styles.message}>No results for &ldquo;{query}&rdquo;.</p>
              )}
              {!query.trim() && (
                <p className={styles.message}>
                  Start typing to search sessions, speakers, companies and jobs.
                </p>
              )}
              {grouped.map(group => (
                <div key={group.type} className={styles.group}>
                  <p className={styles.groupLabel}>{TYPE_LABEL[group.type]}</p>
                  {group.items.map(item => {
                    runningIndex += 1;
                    const index = runningIndex;
                    return (
                      <button
                        key={`${item.type}-${item.title}-${index}`}
                        id={`search-result-${index}`}
                        role="option"
                        aria-selected={index === activeIndex}
                        type="button"
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => goTo(item.url)}
                        className={`${styles.result} ${index === activeIndex ? styles.resultActive : ''}`}
                      >
                        <span className={styles.resultTitle}>{item.title}</span>
                        {item.subtitle && (
                          <span className={styles.resultSubtitle}>{item.subtitle}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </FocusScope>
      </div>
    </OverlayContainer>
  );
}
