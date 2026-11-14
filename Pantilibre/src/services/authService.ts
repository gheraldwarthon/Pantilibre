import { supabase } from './supabaseClient';
import { fetchMyProfile } from './dataService';
import type { UserProfile } from '../types';

export function getFriendlyAuthError(raw: string): string {
  if (raw.includes('weak_password') || raw.toLowerCase().includes('weak')) {
    return 'La contraseña es demasiado débil. Usa al menos 8 caracteres mezclando mayúsculas, minúsculas, números y símbolos (ej. Panti!2026).';
  }
  if (raw.includes('Perfil no encontrado')) return 'Tu cuenta existe, pero falta su perfil. Contacta con el administrador para recuperar el acceso.';
  if (raw.includes('Email not confirmed')) return 'Debes confirmar tu correo antes de iniciar sesión.';
  if (raw.includes('Invalid login credentials')) return 'Correo o contraseña incorrectos.';
  if (raw.includes('already registered') || raw.includes('already been registered')) return 'Ese correo ya está registrado. Inicia sesión.';
  if (raw.includes('duplicate key') || raw.includes('unique')) return 'Ese nombre de usuario ya está en uso. Elige otro.';
  if (raw.includes('Password')) return 'La contraseña debe tener al menos 6 caracteres.';
  if (raw.includes('rate limit') || raw.includes('rate_limit')) return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.';
  if (raw.includes('Failed to fetch') || raw.toLowerCase().includes('network')) return 'No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.';
  if (raw.includes('Cuenta creada.') || raw.includes('needsEmailConfirmation')) return 'Se creó tu cuenta. Revisa tu correo para confirmarla antes de iniciar sesión.';
  return 'No se pudo completar la autenticación. Revisa tus datos e inténtalo de nuevo.';
}

export interface SignUpResult {
  needsEmailConfirmation: boolean;
  user: UserProfile | null;
}

export async function signUp(email: string, password: string, username: string, asCreator: boolean): Promise<SignUpResult> {
  const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username: username.trim().toLowerCase(), account_type: asCreator ? 'creator' : 'fan' },
      ...(redirectTo ? { emailRedirectTo: redirectTo } : {})
    }
  });
  if (error) throw error;
  if (!data.user) throw new Error('No se pudo crear la cuenta');
  if (!data.session) {
    return { needsEmailConfirmation: true, user: null };
  }
  const profile = await fetchMyProfile();
  return { needsEmailConfirmation: false, user: profile };
}

export async function signIn(email: string, password: string): Promise<UserProfile> {
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw error;
  if (!data.session || !data.user) throw new Error('No autenticado');
  return fetchMyProfile();
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function restoreSession(): Promise<UserProfile | null> {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!session?.user) return null;
  return fetchMyProfile();
}

export async function sendPasswordReset(email: string): Promise<void> {
  const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;
  const { error } = await supabase.auth.resetPasswordForEmail(
    email,
    redirectTo ? { redirectTo } : undefined
  );
  if (error) throw error;
}

export async function changePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

export async function resendConfirmationEmail(email: string): Promise<void> {
  const { error } = await supabase.auth.resend({ type: 'signup', email });
  if (error) throw error;
}

export async function getCurrentAuthStatus(): Promise<{ email: string; emailConfirmed: boolean } | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return { email: user.email ?? '', emailConfirmed: Boolean(user.email_confirmed_at) };
}
