import { useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import cn from 'classnames';
import { useOverlayTriggerState } from '@react-stately/overlays';
import { useOverlay, usePreventScroll, useModal, OverlayContainer } from '@react-aria/overlays';
import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import useLoginStatus from '@lib/hooks/use-login-status';
import styles from './mobile-bottom-nav.module.css';

const MORE_LINKS = [
  { name: 'Speakers', route: '/speakers' },
  { name: 'Expo', route: '/expo' },
  { name: 'Jobs', route: '/jobs' }
];

function MoreOverlay(props: Parameters<typeof useOverlay>[0] & Parameters<typeof useDialog>[0]) {
  const router = useRouter();
  const activeRoute = router.asPath;

  const ref = useRef<HTMLElement | null>(null);
  const { modalProps } = useModal();
  const { overlayProps } = useOverlay(props, ref);
  const { dialogProps } = useDialog(props, ref);

  usePreventScroll();

  return (
    <div className={styles.overlay}>
      <FocusScope contain restoreFocus autoFocus>
        <nav
          className={styles.overlayNav}
          {...overlayProps}
          {...dialogProps}
          {...modalProps}
          ref={ref}
        >
          {MORE_LINKS.map(({ name, route }) => (
            <Link
              key={name}
              href={route}
              className={cn(styles.overlayItem, {
                [styles.overlayItemActive]: activeRoute.startsWith(route)
              })}
              onClick={props.onClose as () => void}
            >
              {name}
            </Link>
          ))}
        </nav>
      </FocusScope>
    </div>
  );
}

export default function MobileBottomNav() {
  const router = useRouter();
  const activeRoute = router.asPath;
  const { loginStatus, username } = useLoginStatus();

  const overlayState = useOverlayTriggerState({});

  const lastItem =
    loginStatus === 'loggedIn'
      ? {
          name: 'Me',
          route: username ? `/tickets/${username}` : '/',
          icon: 'user' as const
        }
      : { name: 'Sign in', route: '/', icon: 'user' as const };

  const items: { name: string; route: string; icon: 'home' | 'schedule' | 'live' | 'user' }[] = [
    { name: 'Home', route: '/', icon: 'home' },
    { name: 'Schedule', route: '/schedule', icon: 'schedule' },
    { name: 'Live', route: '/stage', icon: 'live' },
    lastItem
  ];

  const isActive = (route: string) =>
    route === '/' ? activeRoute === '/' : activeRoute.startsWith(route);
  const moreIsActive = MORE_LINKS.some(link => activeRoute.startsWith(link.route));

  return (
    <>
      <nav className={styles.nav} aria-label="Primary">
        <Link
          href={items[0].route}
          className={cn(styles.item, { [styles.itemActive]: isActive(items[0].route) })}
        >
          <NavIcon name={items[0].icon} />
          <span>{items[0].name}</span>
        </Link>
        <Link
          href={items[1].route}
          className={cn(styles.item, { [styles.itemActive]: isActive(items[1].route) })}
        >
          <NavIcon name={items[1].icon} />
          <span>{items[1].name}</span>
        </Link>
        <Link
          href={items[2].route}
          className={cn(styles.item, { [styles.itemActive]: isActive(items[2].route) })}
        >
          <NavIcon name={items[2].icon} />
          <span>{items[2].name}</span>
        </Link>
        <button
          type="button"
          className={cn(styles.item, styles.itemButton, { [styles.itemActive]: moreIsActive })}
          onClick={() => overlayState.open()}
          aria-haspopup="dialog"
          aria-expanded={overlayState.isOpen}
        >
          <NavIcon name="more" />
          <span>More</span>
        </button>
        <Link
          href={lastItem.route}
          className={cn(styles.item, { [styles.itemActive]: isActive(lastItem.route) })}
        >
          <NavIcon name={lastItem.icon} />
          <span>{lastItem.name}</span>
        </Link>
      </nav>

      {overlayState.isOpen && (
        <OverlayContainer>
          <MoreOverlay isOpen onClose={() => overlayState.close()} />
        </OverlayContainer>
      )}
    </>
  );
}

function NavIcon({ name }: { name: 'home' | 'schedule' | 'live' | 'user' | 'more' }) {
  const common = {
    viewBox: '0 0 24 24',
    width: 22,
    height: 22,
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none'
  };

  switch (name) {
    case 'home':
      return (
        <svg {...common}>
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
        </svg>
      );
    case 'schedule':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      );
    case 'live':
      return (
        <svg {...common}>
          <rect x="3" y="6" width="14" height="12" rx="2" />
          <path d="m21 9-4 3 4 3z" />
        </svg>
      );
    case 'more':
      return (
        <svg {...common}>
          <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'user':
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c1.5-4 5-5.5 7-5.5s5.5 1.5 7 5.5" />
        </svg>
      );
  }
}
