import crypto from 'crypto';
import { ConfUser } from '@lib/types';
import { createClient } from '@supabase/supabase-js';

const hasSupabase = Boolean(
  process.env.SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_SECRET &&
    process.env.EMAIL_TO_ID_SECRET
);

const supabase = hasSupabase
  ? createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_SECRET as string)
  : null;

function fallbackTicket(id: string): number {
  const digest = crypto.createHash('sha256').update(id).digest('hex');
  return (parseInt(digest.slice(0, 8), 16) % 9000) + 1000;
}

export async function createUser(id: string, email: string): Promise<ConfUser> {
  if (!supabase) {
    return { id, email, ticketNumber: fallbackTicket(id), createdAt: Date.now() };
  }
  const { data, error } = await supabase.from('users').insert({ id, email }).single();
  if (error) throw new Error(error.message);
  if (!data) return {};
  return {
    ...data,
    createdAt:
      typeof data.createdAt === 'string' ? Date.parse(data.createdAt) : data.createdAt
  };
}

export async function getUserByUsername(username: string): Promise<ConfUser> {
  if (!supabase) {
    return { name: username, username, ticketNumber: fallbackTicket(username) };
  }
  const { data, error } = await supabase
    .from('users')
    .select('name, username, ticketNumber')
    .eq('username', username)
    .single();
  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return data ?? {};
}

export async function getUserById(id: string): Promise<ConfUser> {
  if (!supabase) return {};
  const { data, error } = await supabase
    .from('users')
    .select('name, username, createdAt')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  if (!data) return {};
  return {
    ...data,
    createdAt:
      typeof data.createdAt === 'string' ? Date.parse(data.createdAt) : data.createdAt
  };
}

export async function getTicketNumberByUserId(id: string): Promise<string | null> {
  if (!supabase) return String(fallbackTicket(id));
  const { data, error } = await supabase.from('users').select('ticketNumber').eq('id', id).single();
  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return data?.ticketNumber != null ? String(data.ticketNumber) : null;
}

export async function createGitHubUser(
  user: { id: number; login: string; name?: string | null }
): Promise<string> {
  if (!supabase) return JSON.stringify({ login: user.login, name: user.name || user.login });
  const { data, error } = await supabase
    .from('github_users')
    .insert({ userData: user })
    .single();
  if (error) throw new Error(error.message);
  return data.id;
}

export async function updateUserWithGitHubUser(id: string, token: string): Promise<ConfUser> {
  if (!supabase) {
    try {
      const parsed = JSON.parse(token) as { login: string; name?: string };
      return { username: parsed.login, name: parsed.name || parsed.login };
    } catch {
      throw new Error('Invalid or expired token');
    }
  }
  const { data, error: tokenError } = await supabase
    .from('github_users')
    .select('userData')
    .eq('id', token)
    .single();
  if (tokenError || !data?.userData) throw new Error('Invalid or expired token');

  const { login: username, name } = data.userData as { login?: string; name?: string };
  if (!username) throw new Error('Invalid GitHub user');

  const { error } = await supabase.from('users').update({ username, name: name || username }).eq('id', id);
  if (error) throw new Error(error.message);
  return { username, name: name || username };
}

