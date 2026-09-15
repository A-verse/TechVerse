import React from 'react';

interface Props {
  name: string;
  setName: (value: string) => void;
  role: string;
  loading: boolean;
  error: string;
  onJoin: () => void;
}

const Join: React.FC<Props> = ({ name, setName, role, loading, error, onJoin }) => {
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
          {role === 'viewer' ? '▶' : '●'}
        </div>
        <h1 className="text-2xl font-bold">Join the TechVerse live stage</h1>
        <p className="mt-2 text-sm text-gray-400">
          {role === 'viewer'
            ? 'Enter your name to watch the session.'
            : 'Enter your name to join as a speaker.'}
        </p>
        <input
          maxLength={40}
          value={name}
          onChange={event => setName(event.target.value)}
          required
          className="mt-7 w-full rounded-xl bg-gray-700 p-4 text-white outline-none ring-brand-300 placeholder:text-gray-400 focus:ring-2"
          placeholder="Your name"
          type="text"
        />
        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
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
