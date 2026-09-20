import React from 'react';

export type LiveStageRole = 'viewer' | 'speaker' | 'moderator';

interface Props {
  name: string;
  setName: (value: string) => void;
  role: LiveStageRole;
  setRole: (value: string) => void;
  loading: boolean;
  error: string;
  onJoin: () => void;
}

const Join: React.FC<Props> = ({ name, setName, role, setRole, loading, error, onJoin }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <form
        onSubmit={event => {
          event.preventDefault();
          void onJoin();
        }}
        className="w-full max-w-md rounded-2xl border border-gray-700 bg-[#18181b] p-8 text-center shadow-2xl"
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-300/20 text-2xl">
          {role === 'viewer' ? '▶' : role === 'moderator' ? '★' : '●'}
        </div>

        <h1 className="text-2xl font-bold">Join the TechVerse live stage</h1>

        <p className="mt-2 text-sm text-gray-400">
          Choose your role and enter your name to join the session.
        </p>

        {/* Role selector */}
        <div className="mt-6 text-left">
          <label className="mb-2 block text-sm font-medium text-gray-300">Your role</label>

          <div className="grid grid-cols-3 gap-2">
            {[
              {
                value: 'viewer',
                label: 'Viewer'
              },
              {
                value: 'speaker',
                label: 'Speaker'
              },
              {
                value: 'moderator',
                label: 'Moderator'
              }
            ].map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setRole(option.value);
                }}
                className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                  role === option.value
                    ? 'border-brand-300 bg-brand-300/20 text-white'
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <input
          maxLength={40}
          value={name}
          onChange={event => setName(event.target.value)}
          required
          className="mt-5 w-full rounded-xl bg-gray-700 p-4 text-white outline-none ring-brand-300 placeholder:text-gray-400 focus:ring-2"
          placeholder="Your name"
          type="text"
        />

        {/* Role description */}
        <p className="mt-3 text-left text-xs text-gray-500">
          {role === 'viewer'
            ? 'Viewer: watch the live session without publishing camera or microphone.'
            : role === 'speaker'
              ? 'Speaker: join the stage with camera and microphone.'
              : 'Moderator: join with camera, microphone and moderation permissions. Restricted to approved TechVerse accounts — you\u2019ll see an error here if yours isn\u2019t one of them.'}
        </p>

        {/* Error */}
        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

        {/* Join */}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-brand-300 px-5 py-4 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Connecting…' : 'Join live stage'}
        </button>
      </form>
    </div>
  );
};

export default Join;
