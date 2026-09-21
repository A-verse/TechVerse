/**
 * Copyright 2020 Vercel Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import { useRouter } from 'next/router';

import { NAVIGATION } from '@lib/constants';

import styles from './layout.module.css';

import Logo from './icons/icon-logo';
import MobileBottomNav from './mobile-bottom-nav';
import CommandPalette from './command-palette';
import Footer from './footer';
import ViewSource from './view-source';

type Props = {
  children: React.ReactNode;
  className?: string;
  hideNav?: boolean;
  layoutStyles?: any;
  isLive?: boolean;
};

export default function Layout({
  children,
  className,
  hideNav,
  layoutStyles,
  isLive = false
}: Props) {
  const router = useRouter();
  const activeRoute = router.asPath;

  const disableCta = ['/schedule', '/speakers', '/expo', '/jobs', '/stage'];
  const isStageRoute = activeRoute.startsWith('/stage/');
  const [searchOpen, setSearchOpen] = useState(false);

  /*
   * Cmd/Ctrl+K opens global search. Disabled on the immersive stage room,
   * where the LiveKit room may want its own keyboard shortcuts and a
   * full-screen search modal would be disruptive mid-session.
   */
  useEffect(() => {
    if (isStageRoute) return;

    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isStageRoute]);

  return (
    <>
      <div className={styles.background}>
        {!hideNav && (
          <header className={cn(styles.header)}>
            <div className={styles['header-logos']}>
              <Link href="/" className={styles.logo}>
                {/* eslint-disable-next-line */}
                <Logo />
              </Link>
            </div>

            <div className={styles.tabs}>
              {NAVIGATION.map(({ name, route }) => (
                <Link
                  key={name}
                  href={route}
                  className={cn(styles.tab, {
                    [styles['tab-active']]: activeRoute.startsWith(route)
                  })}
                >
                  {name}
                </Link>
              ))}
            </div>

            <div className={cn(styles['header-right'])}>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={styles.searchTrigger}
                aria-label="Search TechVerse"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <span className={styles.searchTriggerLabel}>Search</span>
                <span className={styles.searchTriggerKey}>⌘K</span>
              </button>
              {isLive && !disableCta.some(route => activeRoute.startsWith(route)) ? (
                <Link href={activeRoute} className={styles.tab}>
                  Live Stage
                </Link>
              ) : null}
            </div>
          </header>
        )}

        <ViewSource />

        <div
          className={cn(styles.page, {
            [styles['page-with-bottom-nav']]: !hideNav && !isStageRoute
          })}
        >
          <main className={styles.main} style={layoutStyles} id="main-content">
            <div className={cn(styles.full, className)}>{children}</div>
          </main>

          {!isStageRoute && <Footer />}
        </div>
      </div>

      {!hideNav && !isStageRoute && <MobileBottomNav onOpenSearch={() => setSearchOpen(true)} />}

      <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
