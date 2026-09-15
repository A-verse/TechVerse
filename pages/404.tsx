import Link from 'next/link';
import Page from '@components/page';
import { META_DESCRIPTION, SITE_NAME } from '@lib/constants';

export default function NotFoundPage() {
  return (
    <Page meta={{ title: `Page not found | ${SITE_NAME}`, description: META_DESCRIPTION }}>
      <main
        style={{
          minHeight: '70vh',
          display: 'grid',
          placeItems: 'center',
          padding: '4rem 1.5rem',
          textAlign: 'center'
        }}
      >
        <div>
          <p style={{ opacity: 0.7 }}>404</p>
          <h1>That page doesn’t exist.</h1>
          <p>Head back to the conference lobby and pick another room.</p>
          <Link href="/">Back to TechVerse</Link>
        </div>
      </main>
    </Page>
  );
}
