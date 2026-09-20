import React from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoConference,
  useRoomContext
} from '@livekit/components-react';
import '@livekit/components-styles';
import { useRouter } from 'next/router';
import Join from './Join';

export type LiveStageRole = 'viewer' | 'speaker' | 'moderator';

interface Props {
  stagePeers?: string[];
  backstagePeers?: string[];
  roomId: string;
}

const VALID_ROLES: LiveStageRole[] = ['viewer', 'speaker', 'moderator'];

interface MediaInitializerProps {
  canPublish: boolean;
  onError: (message: string) => void;
}

const MediaInitializer: React.FC<MediaInitializerProps> = ({ canPublish, onError }) => {
  const room = useRoomContext();

  React.useEffect(() => {
    if (!canPublish) {
      return;
    }

    let cancelled = false;

    const enableMedia = async () => {
      try {
        await room.localParticipant.setMicrophoneEnabled(true);

        await room.localParticipant.setCameraEnabled(true);
      } catch (value) {
        if (cancelled) {
          return;
        }

        const message =
          value instanceof Error ? value.message : 'Unable to access your camera or microphone.';

        onError(message);
      }
    };

    void enableMedia();

    return () => {
      cancelled = true;
    };
  }, [room, canPublish, onError]);

  return null;
};

const Room: React.FC<Props> = ({ roomId }) => {
  const router = useRouter();

  const [name, setName] = React.useState('');

  const [role, setRole] = React.useState<LiveStageRole>('viewer');

  const [token, setToken] = React.useState('');

  const [serverUrl, setServerUrl] = React.useState('');

  const [error, setError] = React.useState('');

  const [loading, setLoading] = React.useState(false);

  /*
   * Load saved participant name.
   */
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setName(window.localStorage.getItem('name') || '');
    }
  }, []);

  /*
   * Support URLs such as:
   *
   * /stage/a?role=viewer
   * /stage/a?role=speaker
   * /stage/a?role=moderator
   */
  React.useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const queryRole = Array.isArray(router.query.role) ? router.query.role[0] : router.query.role;

    if (queryRole && VALID_ROLES.includes(queryRole as LiveStageRole)) {
      setRole(queryRole as LiveStageRole);

      setError('');
    }
  }, [router.isReady, router.query.role]);

  /*
   * Change role and remove any previous
   * permission/error message.
   */
  const handleRoleChange = React.useCallback((value: string) => {
    if (VALID_ROLES.includes(value as LiveStageRole)) {
      setRole(value as LiveStageRole);

      setError('');
    }
  }, []);

  /*
   * Media error handler.
   *
   * IMPORTANT:
   * This hook is declared BEFORE the
   * conditional return below.
   */
  const handleMediaError = React.useCallback((message: string) => {
    setError(message);
  }, []);

  /*
   * Request a LiveKit access token.
   */
  const join = React.useCallback(async () => {
    if (!router.isReady || !roomId) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/livekit-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          room_name: roomId,
          participant_name: name.trim() || 'TechVerse Guest',
          role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to prepare the live stage.');
      }

      if (!data.participant_token) {
        throw new Error('LiveKit did not return a participant token.');
      }

      if (!data.server_url) {
        throw new Error('LiveKit server URL is missing.');
      }

      setToken(data.participant_token);

      setServerUrl(data.server_url);

      setError('');
    } catch (value) {
      setError(value instanceof Error ? value.message : 'Unable to prepare the live stage.');
    } finally {
      setLoading(false);
    }
  }, [name, role, roomId, router.isReady]);

  /*
   * All hooks are above this point.
   *
   * Now it is safe to conditionally render
   * the Join screen.
   */
  if (!token || !serverUrl) {
    return (
      <Join
        name={name}
        setName={value => {
          setName(value);

          if (typeof window !== 'undefined') {
            window.localStorage.setItem('name', value);
          }
        }}
        role={role}
        setRole={handleRoleChange}
        loading={loading}
        error={error}
        onJoin={join}
      />
    );
  }

  /*
   * Viewers cannot publish.
   *
   * Speakers and moderators can publish.
   */
  const canPublish = role !== 'viewer';

  return (
    <div className="h-full min-h-[60vh] bg-black text-white">
      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect={true}
        audio={canPublish}
        video={canPublish}
        onConnected={() => {
          /*
           * Clear stale errors after a
           * successful LiveKit connection.
           */
          setError('');
        }}
        onDisconnected={() => {
          setToken('');
          setServerUrl('');
        }}
        onError={value => {
          setError(value.message || 'The live stage connection failed.');
        }}
        onMediaDeviceFailure={(failure, kind) => {
          const device =
            kind === 'videoinput'
              ? 'camera'
              : kind === 'audioinput'
                ? 'microphone'
                : 'media device';

          setError(
            failure?.message || `Unable to access your ${device}. Please check browser permissions.`
          );
        }}
        className="h-full min-h-[60vh]"
      >
        <MediaInitializer canPublish={canPublish} onError={handleMediaError} />

        <VideoConference />

        <RoomAudioRenderer />
      </LiveKitRoom>

      {error ? (
        <div className="fixed bottom-5 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 rounded-lg bg-red-600 px-5 py-3 text-sm text-white shadow-xl">
          {error}
        </div>
      ) : null}
    </div>
  );
};

export default Room;
