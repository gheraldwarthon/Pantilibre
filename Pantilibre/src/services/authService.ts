import { supabase } from './supabaseClient';
import { fetchMyProfile } from './dataService';
import type { UserProfile } from '../types';

export function getFriendlyAuthError(raw: string): string {
  if (raw.includes('weak_password') || raw.toLowerCase().includes('weak')) {
    return 'La contraseña es demasiado débil. Usa al menos 8 caracteres mezclando mayúsculas, minúsculas, números y símbolos (ej. Panti!2026).';
  }
  if (raw.includes('Invalid login credentials')) return 'Correo o contraseña incorrectos.';
  if (raw.includes('already registered') || raw.includes('already been registered')) return 'Ese correo ya está registrado. Inicia sesión.';
  if (raw.includes('duplicate key') || raw.includes('unique')) return 'Ese nombre de usuario ya está en uso. Elige otro.';
  if (raw.includes('Password')) return 'La contraseña debe tener al menos 6 caracteres.';
  if (raw.includes('rate limit') || raw.includes('rate_limit')) return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.';
  return raw;
}

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
  const safeUsername = username.toLowerCase().replace(/\s+/g, '_');
  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    username: safeUsername,
    name: username,
    avatar_url: '',
    role: asCreator ? 'creator' : 'fan',
    plan: 'free',
    seller_tier: asCreator ? 'free' : null,
    photo_limit: asCreator ? 2 : null,
    coins: 100
  });
  if (profileError) throw profileError;
  if (asCreator) {
    const { error: creatorError } = await supabase.from('creators').insert({
      id: data.user.id,
      username: safeUsername,
      name: username,
      avatar_url: '',
      cover_url: '',
      badge: 'VIP',
      is_verified: false,
      is_online: false,
      featured: false,
      categories: ['lingerie'],
      tags: [],
      bio: '¡Nueva vendedora en Pantilibre! Pronto subiré mi contenido.',
      location: '',
      rating: 5.0,
      review_count: 0,
      subscribers_count: 0,
      monthly_subscription_price: 4.5
    });
    if (creatorError) throw creatorError;
  }
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
