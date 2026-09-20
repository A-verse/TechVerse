import React from 'react';
import { Chat, useParticipants, useRoomContext } from '@livekit/components-react';
import type { RemoteParticipant } from 'livekit-client';
import type { LiveStageRole } from './Join';

interface Props {
  role: LiveStageRole;
  roomName: string;
  stageLabel: string;
  open: boolean;
  onClose: () => void;
}

type Tab = 'info' | 'chat' | 'participants';

const SidePanel: React.FC<Props> = ({ role, roomName, stageLabel, open, onClose }) => {
  const participants = useParticipants();
  const [tab, setTab] = React.useState<Tab>('info');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'info', label: 'Info' },
    { id: 'chat', label: 'Chat' },
    ...(role === 'moderator' ? [{ id: 'participants' as Tab, label: 'Participants' }] : [])
  ];

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 flex h-[70vh] flex-col rounded-t-2xl border-t border-gray-700 bg-[#0d0d0f] shadow-2xl transition-transform duration-200 lg:static lg:inset-auto lg:h-full lg:w-[320px] lg:translate-y-0 lg:rounded-none lg:border-t-0 lg:border-l ${
        open ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'
      }`}
      role="complementary"
      aria-label="Session info, chat and participants"
    >
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3 lg:hidden">
        <span className="text-sm font-semibold text-white">Stage panel</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="flex border-b border-gray-800">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id}
            className={`flex-1 px-3 py-3 text-sm font-semibold transition ${
              tab === t.id
                ? 'border-b-2 border-brand-300 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {tab === 'info' ? (
          <div className="p-4 text-sm text-gray-300">
            <h2 className="text-base font-bold text-white">{stageLabel}</h2>
            <p className="mt-1 text-gray-400">You're viewing this stage as {role}.</p>
            <p className="mt-4 flex items-center gap-2 text-gray-300">
              <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
              {participants.length} {participants.length === 1 ? 'person' : 'people'} in this
              session right now
            </p>
          </div>
        ) : null}

        {tab === 'chat' ? (
          <div className="flex h-full flex-col [--lk-bg:theme(colors.gray.900)]">
            <Chat className="h-full border-0" />
          </div>
        ) : null}

        {tab === 'participants' && role === 'moderator' ? (
          <ParticipantModerationList roomName={roomName} participants={participants} />
        ) : null}
      </div>
    </div>
  );
};

interface ModerationListProps {
  roomName: string;
  participants: ReturnType<typeof useParticipants>;
}

const ParticipantModerationList: React.FC<ModerationListProps> = ({ roomName, participants }) => {
  const room = useRoomContext();
  const [pending, setPending] = React.useState<string | null>(null);
  const [actionError, setActionError] = React.useState('');

  const runAction = async (identity: string, action: 'mute_audio' | 'mute_video' | 'remove') => {
    setPending(`${identity}:${action}`);
    setActionError('');

    try {
      const response = await fetch('/api/livekit-moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_name: roomName, identity, action })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'That moderation action failed.');
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'That moderation action failed.');
    } finally {
      setPending(null);
    }
  };

  const remoteParticipants = participants.filter(
    p => p.identity !== room.localParticipant.identity
  ) as RemoteParticipant[];

  return (
    <div className="p-4">
      {actionError ? (
        <p className="mb-3 rounded-lg bg-red-600/20 px-3 py-2 text-xs text-red-300">
          {actionError}
        </p>
      ) : null}

      {remoteParticipants.length === 0 ? (
        <p className="text-sm text-gray-400">No other participants have joined yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {remoteParticipants.map(participant => (
            <li
              key={participant.identity}
              className="flex flex-col gap-2 rounded-xl border border-gray-800 bg-gray-900/60 p-3"
            >
              <span className="truncate text-sm font-medium text-white">
                {participant.name || 'TechVerse Guest'}
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={pending === `${participant.identity}:mute_audio`}
                  onClick={() => runAction(participant.identity, 'mute_audio')}
                  className="rounded-lg bg-gray-800 px-3 py-2 text-xs font-semibold text-gray-200 hover:bg-gray-700 disabled:opacity-50"
                >
                  {pending === `${participant.identity}:mute_audio` ? 'Muting…' : 'Mute mic'}
                </button>
                <button
                  type="button"
                  disabled={pending === `${participant.identity}:mute_video`}
                  onClick={() => runAction(participant.identity, 'mute_video')}
                  className="rounded-lg bg-gray-800 px-3 py-2 text-xs font-semibold text-gray-200 hover:bg-gray-700 disabled:opacity-50"
                >
                  {pending === `${participant.identity}:mute_video` ? 'Stopping…' : 'Stop camera'}
                </button>
                <button
                  type="button"
                  disabled={pending === `${participant.identity}:remove`}
                  onClick={() => {
                    if (
                      window.confirm(
                        `Remove ${participant.name || 'this participant'} from the stage?`
                      )
                    ) {
                      void runAction(participant.identity, 'remove');
                    }
                  }}
                  className="rounded-lg bg-red-600/80 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {pending === `${participant.identity}:remove` ? 'Removing…' : 'Remove'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SidePanel;
