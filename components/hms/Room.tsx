import React from 'react';
import { LiveKitRoom, RoomAudioRenderer, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';
import { useRouter } from 'next/router';
import Join from './Join';

interface Props {
  stagePeers?: string[];
  backstagePeers?: string[];
  roomId: string;
}

const Room = ({ roomId }: Props) => {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [token, setToken] = React.useState('');
  const [serverUrl, setServerUrl] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const role = router.query.role ? String(router.query.role) : 'viewer';

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setName(window.localStorage.getItem('name') || '');
    }
  }, []);

  const join = React.useCallback(async () => {
    if (!router.isReady || !roomId) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/livekit-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_name: roomId,
          participant_name: name.trim() || 'TechVerse Guest',
          role
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to prepare the live stage.');

      setToken(data.participant_token);
      setServerUrl(data.server_url || process.env.NEXT_PUBLIC_LIVEKIT_URL || '');
    } catch (value) {
      setError(value instanceof Error ? value.message : 'Unable to prepare the live stage.');
    } finally {
      setLoading(false);
    }
  }, [name, role, roomId, router.isReady]);

  if (!token || !serverUrl) {
    return (
      <Join
        name={name}
        setName={value => {
          setName(value);
          if (typeof window !== 'undefined') window.localStorage.setItem('name', value);
        }}
        role={role}
        loading={loading}
        error={error}
        onJoin={join}
      />
    );
  }

  return (
    <div className="h-full min-h-[60vh] bg-black text-white">
      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect
        audio={role !== 'viewer'}
        video={role !== 'viewer'}
        onDisconnected={() => {
          setToken('');
          setServerUrl('');
        }}
        onError={value => setError(value.message || 'The live stage connection failed.')}
        className="h-full min-h-[60vh]"
      >
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
      {error ? (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-red-600 px-4 py-3 text-sm shadow-xl">
          {error}
        </div>
      ) : null}
    </div>
  );
};

export default Room;
