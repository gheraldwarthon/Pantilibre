import { supabase } from './supabaseClient';
import { fetchMyProfile } from './dataService';
import type { UserProfile } from '../types';

export async function signUp(email: string, password: string, username: string, asCreator: boolean): Promise<UserProfile> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username, display_name: username } }
  });
  if (error) throw error;
  if (!data.user) throw new Error('No se pudo crear la cuenta');
  if (!data.session) {
    throw new Error('Cuenta creada. Inicia sesión para continuar.');
  }
  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    username: username.toLowerCase().replace(/\s+/g, '_'),
    name: username,
    avatar_url: '',
    role: asCreator ? 'creator' : 'fan',
    plan: 'free',
    seller_tier: asCreator ? 'free' : null,
    photo_limit: asCreator ? 2 : null,
    coins: 100
  });
  if (profileError) throw profileError;
  return fetchMyProfile();
}

export async function signIn(email: string, password: string): Promise<UserProfile> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return fetchMyProfile();
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function restoreSession(): Promise<UserProfile | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;
  return fetchMyProfile();
}
