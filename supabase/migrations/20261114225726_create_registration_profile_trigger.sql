/*
# Atomic registration profiles

## 1. Changes
Create a trigger on new Supabase accounts that creates the public profile in the same operation. Seller registrations also receive their public seller page. No existing rows are modified and no tables or columns are added.

## 2. Registration defaults
Usernames are validated on the server. Accounts may choose fan or creator only; administrator access, membership, credits and verification are never accepted from registration input. Free accounts receive the existing default of 100 coins; free sellers receive a two-photo limit.

## 3. Security
The trigger function has a fixed search path and cannot be called by public, anonymous or authenticated clients. Existing table policies and permissions remain unchanged. Any profile creation failure rolls back account creation, avoiding incomplete registrations.
*/
CREATE OR REPLACE FUNCTION public.create_registration_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  registration_username text := lower(trim(NEW.raw_user_meta_data ->> 'username'));
  registration_role text := CASE WHEN NEW.raw_user_meta_data ->> 'account_type' = 'creator' THEN 'creator' ELSE 'fan' END;
BEGIN
  IF registration_username IS NULL OR registration_username !~ '^[a-z0-9._]{3,20}$' THEN
    RAISE EXCEPTION 'Invalid registration username';
  END IF;
  INSERT INTO public.profiles (id, username, name, role, plan, seller_tier, photo_limit, coins)
  VALUES (NEW.id, registration_username, registration_username, registration_role, 'free',
    CASE WHEN registration_role = 'creator' THEN 'free' ELSE NULL END,
    CASE WHEN registration_role = 'creator' THEN 2 ELSE NULL END, 100);
  IF registration_role = 'creator' THEN
    INSERT INTO public.creators (id, username, name, categories, bio, monthly_subscription_price)
    VALUES (NEW.id, registration_username, registration_username, ARRAY['lingerie'],
      '¡Nueva vendedora en Pantilibre! Pronto subiré mi contenido.', 4.5);
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.create_registration_profile() FROM PUBLIC, anon, authenticated;
CREATE OR REPLACE TRIGGER on_registration_create_profile
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.create_registration_profile();