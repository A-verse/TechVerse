import React from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoConference,
  useConnectionState,
  type LocalUserChoices
} from '@livekit/components-react';
import '@livekit/components-styles';
import { useRouter } from 'next/router';
import { ConnectionState, MediaDeviceFailure } from 'livekit-client';
import Join, { type LiveStageRole } from './Join';
import DevicePreJoin from './DevicePreJoin';
import SidePanel from './SidePanel';

/**
 * `MediaDeviceFailure` is a string enum, not an Error — it has no
 * `.message`. Map each reason to a friendly, user-facing message rather
 * than surfacing raw technical detail.
 */
function getMediaDeviceFailureMessage(
  failure: MediaDeviceFailure | undefined,
  device: string
): string {
  switch (failure) {
    case MediaDeviceFailure.PermissionDenied:
      return `${capitalize(device)} access is blocked. Allow ${device} access in your browser settings and try again.`;
    case MediaDeviceFailure.NotFound:
      return `We couldn't find a ${device} on this device. Connect one and try again.`;
    case MediaDeviceFailure.DeviceInUse:
      return `Your ${device} is being used by another app. Close it there and try again.`;
    default:
      return `Unable to access your ${device}. Please check browser permissions and try again.`;
  }
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

interface Props {
  stagePeers?: string[];
  backstagePeers?: string[];
  roomId: string;
}

const VALID_ROLES: LiveStageRole[] = ['viewer', 'speaker', 'moderator'];

type Step = 'role' | 'device-check' | 'connecting' | 'connected';

const Room: React.FC<Props> = ({ roomId }) => {
  const router = useRouter();

  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState<LiveStageRole>('viewer');
  const [step, setStep] = React.useState<Step>('role');
  const [token, setToken] = React.useState('');
  const [serverUrl, setServerUrl] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [userChoices, setUserChoices] = React.useState<LocalUserChoices | null>(null);
  const [panelOpen, setPanelOpen] = React.useState(false);

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
   *
   * This only pre-selects the role on the join screen — it grants
   * nothing by itself. The server independently decides what the
   * participant is actually allowed to do.
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

  const handleRoleChange = React.useCallback((value: string) => {
    if (VALID_ROLES.includes(value as LiveStageRole)) {
      setRole(value as LiveStageRole);
      setError('');
    }
  }, []);

  const requestToken = React.useCallback(
    async (participantName: string, requestedRole: LiveStageRole) => {
      const response = await fetch('/api/livekit-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_name: roomId,
          participant_name: participantName.trim() || 'TechVerse Guest',
          role: requestedRole
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to prepare the live stage.');
      }

      if (!data.participant_token || !data.server_url) {
        throw new Error('LiveKit did not return the information needed to join.');
      }

      return data as {
        participant_token: string;
        server_url: string;
        role: LiveStageRole;
        is_moderator: boolean;
      };
    },
    [roomId]
  );

  /*
   * Viewer: no media, no device check — go straight from the role
   * screen to a token request. Speaker/moderator: show the device
   * pre-join screen first.
   */
  const handleRoleSubmit = React.useCallback(async () => {
    if (!router.isReady || !roomId) {
      return;
    }

    if (role !== 'viewer') {
      setStep('device-check');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await requestToken(name, role);
      setToken(data.participant_token);
      setServerUrl(data.server_url);
      setRole(data.role);
      setStep('connected');
    } catch (value) {
      setError(value instanceof Error ? value.message : 'Unable to prepare the live stage.');
    } finally {
      setLoading(false);
    }
  }, [name, role, roomId, router.isReady, requestToken]);

  const handleDeviceSubmit = React.useCallback(
    async (choices: LocalUserChoices) => {
      setLoading(true);
      setError('');
      setUserChoices(choices);

      try {
        const data = await requestToken(choices.username || name, role);
        setToken(data.participant_token);
        setServerUrl(data.server_url);
        setRole(data.role);
        setStep('connected');
      } catch (value) {
        setError(value instanceof Error ? value.message : 'Unable to prepare the live stage.');
        setStep('role');
      } finally {
        setLoading(false);
      }
    },
    [name, role, requestToken]
  );

  const handleMediaError = React.useCallback((message: string) => {
    setError(message);
  }, []);

  const handleDisconnected = React.useCallback(() => {
    setToken('');
    setServerUrl('');
    setUserChoices(null);
    setStep('role');
  }, []);

  if (step === 'role') {
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
        onJoin={handleRoleSubmit}
      />
    );
  }

  if (step === 'device-check') {
    return (
      <DevicePreJoin
        name={name}
        role={role}
        onBack={() => {
          setError('');
          setStep('role');
        }}
        onSubmit={choices => void handleDeviceSubmit(choices)}
      />
    );
  }

  const canPublish = role !== 'viewer';
  const audioEnabled = canPublish && (userChoices?.audioEnabled ?? true);
  const videoEnabled = canPublish && (userChoices?.videoEnabled ?? true);

  return (
    <div className="relative flex h-full min-h-[60vh] flex-col bg-black text-white lg:flex-row">
      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect={true}
        audio={
          audioEnabled
            ? userChoices?.audioDeviceId
              ? { deviceId: userChoices.audioDeviceId }
              : true
            : false
        }
        video={
          videoEnabled
            ? userChoices?.videoDeviceId
              ? { deviceId: userChoices.videoDeviceId }
              : true
            : false
        }
        onDisconnected={handleDisconnected}
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

          setError(getMediaDeviceFailureMessage(failure, device));
        }}
        className="min-h-[60vh] flex-1 lg:h-full"
      >
        <div className="relative h-full min-h-[60vh]">
          <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-lg bg-black/70 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
            {role === 'viewer' ? 'Viewer' : role === 'speaker' ? 'Speaker' : 'Moderator'}
          </div>

          <ConnectionBanner />

          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="absolute right-4 top-4 z-20 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-2 text-xs font-semibold text-white backdrop-blur lg:hidden"
            aria-label="Open session info, chat and participants"
          >
            Info & chat
          </button>

          <VideoConference />
          <RoomAudioRenderer />
        </div>

        <SidePanel
          role={role}
          roomName={roomId}
          stageLabel="TechVerse live stage"
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
        />
      </LiveKitRoom>

      {error ? (
        <div className="fixed bottom-5 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 rounded-lg bg-red-600 px-5 py-3 text-sm text-white shadow-xl">
          {error}
        </div>
      ) : null}
    </div>
  );
};

/**
 * Surfaces reconnecting/disconnected states distinctly from a normal
 * connected session, instead of silently freezing or looking broken.
 */
const ConnectionBanner: React.FC = () => {
  const state = useConnectionState();

  if (state === ConnectionState.Connected) {
    return null;
  }

  const label =
    state === ConnectionState.Reconnecting || state === ConnectionState.SignalReconnecting
      ? 'Reconnecting to the live stage…'
      : state === ConnectionState.Connecting
        ? 'Connecting to the live stage…'
        : 'Connection lost. Trying to reconnect…';

  return (
    <div className="absolute inset-x-0 top-0 z-30 bg-amber-500/90 px-4 py-2 text-center text-xs font-semibold text-black">
      {label}
    </div>
  );
};

export default Room;
