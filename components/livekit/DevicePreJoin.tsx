import React from 'react';
import { PreJoin, type LocalUserChoices } from '@livekit/components-react';
import type { LiveStageRole } from './Join';

interface Props {
  name: string;
  role: LiveStageRole;
  onSubmit: (choices: LocalUserChoices) => void;
  onBack: () => void;
}

/**
 * Shown only to speakers/moderators before they enter the stage, so they
 * can confirm their camera/microphone work and pick the right device —
 * never forced on viewers, who don't publish any media.
 */
const DevicePreJoin: React.FC<Props> = ({ name, role, onSubmit, onBack }) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6">
      <div className="w-full max-w-md text-center">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 text-xs font-medium text-gray-400 underline-offset-2 hover:text-white hover:underline"
        >
          ← Change role or name
        </button>
        <h1 className="text-2xl font-bold text-white">Check your camera & microphone</h1>
        <p className="mt-2 text-sm text-gray-400">
          Joining as {role === 'moderator' ? 'Moderator' : 'Speaker'}. You can turn either off
          before joining.
        </p>
      </div>

      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-700 bg-[#18181b] p-2 shadow-2xl [--lk-bg:theme(colors.gray.900)]">
        <PreJoin
          defaults={{ username: name, videoEnabled: true, audioEnabled: true }}
          joinLabel="Join Stage"
          onSubmit={onSubmit}
          onError={() => {
            /*
             * PreJoin already renders its own inline device-error
             * messaging (permission denied / not found / in use). No
             * extra handling needed here.
             */
          }}
        />
      </div>
    </div>
  );
};

export default DevicePreJoin;
