/*
# Pantilibre — Esquema inicial

1. Tablas nuevas
- `profiles` — perfil de cada usuario (fan, vendedora o admin). 1 a 1 con auth.users.
  - id (uuid, PK = auth.users.id), username (único), name, avatar_url
  - role: 'fan' | 'creator' | 'admin' (lo controla la DB, no el cliente)
  - plan: 'free' | 'gold_vip' | 'black_diamond'
  - seller_tier: 'free' | 'vip' | NULL — nivel de vendedora que decide el admin
  - photo_limit: int o NULL (ilimitado) — fotos por publicación, lo fija el admin
  - coins, data_saver_mode, interactive_notifications
- `creators` — ficha pública de vendedora (1 a 1 con profiles)
- `posts` — publicaciones del muro; trigger valida el límite de fotos
- `post_likes`, `post_comments` — interacciones
- `galleries`, `gallery_unlocks` — galerías privadas y desbloqueos
- `store_items` — prendas del armario
- `stories` — historias de 24h
- `conversations`, `messages` — chat
- `notifications`, `subscriptions`, `app_settings`

2. Seguridad
- RLS en todas; admins via función is_admin() SECURITY DEFINER.
- role/seller_tier/photo_limit no actualizables por el cliente.
- Solo vendedoras con seller_tier pueden publicar.
*/
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text DEFAULT '',
  role text NOT NULL DEFAULT 'fan' CHECK (role IN ('fan','creator','admin')),
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free','gold_vip','black_diamond')),
  seller_tier text CHECK (seller_tier IN ('free','vip') OR seller_tier IS NULL),
  photo_limit int CHECK (photo_limit IS NULL OR photo_limit >= 0),
  coins int NOT NULL DEFAULT 100 CHECK (coins >= 0),
  data_saver_mode boolean NOT NULL DEFAULT false,
  interactive_notifications boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON COLUMN profiles.seller_tier IS 'Nivel de vendedora asignado por el admin: free / vip / NULL (no es vendedora)';
COMMENT ON COLUMN profiles.photo_limit IS 'Limite de fotos por publicacion impuesto por el admin. NULL = ilimitado';

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT SELECT (id, username, name, avatar_url, role, plan, seller_tier, photo_limit) ON profiles TO anon;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS
$$ SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') $$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

REVOKE UPDATE (role, seller_tier, photo_limit) ON profiles FROM authenticated;

CREATE TABLE IF NOT EXISTS creators (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text NOT NULL DEFAULT '',
  cover_url text DEFAULT '',
  badge text NOT NULL DEFAULT 'VIP' CHECK (badge IN ('VIP','SUPER_VIP','DIAMOND')),
  is_verified boolean NOT NULL DEFAULT false,
  is_online boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  categories text[] NOT NULL DEFAULT '{}',
  tags text[] NOT NULL DEFAULT '{}',
  bio text DEFAULT '',
  location text DEFAULT '',
  rating numeric(3,2) DEFAULT 5.0,
  review_count int DEFAULT 0,
  subscribers_count int DEFAULT 0,
  monthly_subscription_price numeric(8,2) DEFAULT 0,
  joined_at timestamptz NOT NULL DEFAULT now(),
  social_quote text,
  height text, shoe_size text, measurements text, favorite_perfume text
);

ALTER TABLE creators ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON creators TO anon, authenticated;
GRANT UPDATE (avatar_url, cover_url, bio, location, categories, tags, name, monthly_subscription_price, social_quote, height, shoe_size, measurements, favorite_perfume, is_online) ON creators TO authenticated;
GRANT UPDATE ON creators TO authenticated;

DROP POLICY IF EXISTS "creators_public_read" ON creators;
CREATE POLICY "creators_public_read" ON creators FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "creator_update_own" ON creators;
CREATE POLICY "creator_update_own" ON creators FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "admin_manage_creators" ON creators;
CREATE POLICY "admin_manage_creators" ON creators FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  content text NOT NULL,
  image_urls text[] NOT NULL DEFAULT '{}',
  category text NOT NULL DEFAULT 'lingerie',
  tags text[] NOT NULL DEFAULT '{}',
  likes_count int NOT NULL DEFAULT 0,
  coin_price numeric(8,2) NOT NULL DEFAULT 0,
  is_locked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON posts TO anon, authenticated;
GRANT INSERT, DELETE ON posts TO authenticated;
GRANT UPDATE (content, image_urls, category, tags, is_locked, coin_price) ON posts TO authenticated;

DROP POLICY IF EXISTS "posts_public_read" ON posts;
CREATE POLICY "posts_public_read" ON posts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "creator_insert_posts" ON posts;
CREATE POLICY "creator_insert_posts" ON posts FOR INSERT
  TO authenticated WITH CHECK (
    auth.uid() = creator_id
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.seller_tier IS NOT NULL
    )
  );

DROP POLICY IF EXISTS "creator_update_own_posts" ON posts;
CREATE POLICY "creator_update_own_posts" ON posts FOR UPDATE
  TO authenticated USING (auth.uid() = creator_id) WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "creator_delete_own_posts" ON posts;
CREATE POLICY "creator_delete_own_posts" ON posts FOR DELETE
  TO authenticated USING (auth.uid() = creator_id);

CREATE OR REPLACE FUNCTION public.validate_post_photo_limit()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE max_photos int; current_count int; new_count int;
BEGIN
  SELECT p.photo_limit INTO max_photos FROM profiles p WHERE p.id = NEW.creator_id;
  IF max_photos IS NULL THEN RETURN NEW; END IF;

  SELECT COALESCE(sum(COALESCE(array_length(image_urls,1),0)),0) INTO current_count
    FROM posts WHERE creator_id = NEW.creator_id AND created_at >= date_trunc('day', now());

  IF TG_OP = 'INSERT' THEN
    new_count := current_count + COALESCE(array_length(NEW.image_urls,1),0);
  ELSE
    new_count := current_count - COALESCE(array_length(OLD.image_urls,1),0) + COALESCE(array_length(NEW.image_urls,1),0);
  END IF;

  IF new_count > max_photos THEN
    RAISE EXCEPTION 'Limite diario de fotos alcanzado (% permitidas por el administrador)', max_photos
      USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_post_photo_limit ON posts;
CREATE TRIGGER trg_post_photo_limit
BEFORE INSERT OR UPDATE OF image_urls ON posts
FOR EACH ROW EXECUTE FUNCTION public.validate_post_photo_limit();

CREATE TABLE IF NOT EXISTS post_likes (
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, DELETE ON post_likes TO authenticated;
DROP POLICY IF EXISTS "likes_owner_all" ON post_likes;
CREATE POLICY "likes_owner_all" ON post_likes FOR ALL
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON post_comments TO anon, authenticated;
GRANT INSERT, DELETE ON post_comments TO authenticated;
DROP POLICY IF EXISTS "comments_public_read" ON post_comments;
CREATE POLICY "comments_public_read" ON post_comments FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "comments_insert_own" ON post_comments;
CREATE POLICY "comments_insert_own" ON post_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "comments_delete_own" ON post_comments;
CREATE POLICY "comments_delete_own" ON post_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS galleries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  cover_url text DEFAULT '',
  preview_images text[] NOT NULL DEFAULT '{}',
  full_images text[] NOT NULL DEFAULT '{}',
  media_count int NOT NULL DEFAULT 0,
  coin_price numeric(8,2) NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'lingerie',
  tags text[] NOT NULL DEFAULT '{}',
  likes_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON galleries TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON galleries TO authenticated;
DROP POLICY IF EXISTS "galleries_public_read" ON galleries;
CREATE POLICY "galleries_public_read" ON galleries FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "gallery_owner_crud" ON galleries;
CREATE POLICY "gallery_owner_crud" ON galleries FOR ALL
  TO authenticated USING (auth.uid() = creator_id) WITH CHECK (auth.uid() = creator_id);

CREATE TABLE IF NOT EXISTS gallery_unlocks (
  gallery_id uuid NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (gallery_id, user_id)
);
ALTER TABLE gallery_unlocks ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, DELETE ON gallery_unlocks TO authenticated;
DROP POLICY IF EXISTS "unlocks_owner" ON gallery_unlocks;
CREATE POLICY "unlocks_owner" ON gallery_unlocks FOR ALL
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS store_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  category text NOT NULL DEFAULT 'used_clothes',
  price_coins numeric(8,2) NOT NULL DEFAULT 0,
  price_usd numeric(8,2) NOT NULL DEFAULT 0,
  image_url text DEFAULT '',
  days_worn int,
  vacuum_sealed boolean DEFAULT true,
  certificate boolean DEFAULT false,
  in_stock int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE store_items ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON store_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON store_items TO authenticated;
DROP POLICY IF EXISTS "store_public_read" ON store_items;
CREATE POLICY "store_public_read" ON store_items FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "store_owner_crud" ON store_items;
CREATE POLICY "store_owner_crud" ON store_items FOR ALL
  TO authenticated USING (auth.uid() = creator_id) WITH CHECK (auth.uid() = creator_id);

CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  media_url text NOT NULL,
  caption text DEFAULT '',
  is_exclusive_vip boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON stories TO anon, authenticated;
GRANT INSERT, DELETE ON stories TO authenticated;
DROP POLICY IF EXISTS "stories_public_read" ON stories;
CREATE POLICY "stories_public_read" ON stories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "story_owner_crud" ON stories;
CREATE POLICY "story_owner_crud" ON stories FOR ALL
  TO authenticated USING (auth.uid() = creator_id) WITH CHECK (auth.uid() = creator_id);

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fan_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  creator_id uuid NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (fan_id, creator_id)
);
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, DELETE ON conversations TO authenticated;
DROP POLICY IF EXISTS "conv_participants" ON conversations;
CREATE POLICY "conv_participants" ON conversations FOR SELECT
  TO authenticated USING (auth.uid() = fan_id OR auth.uid() = creator_id OR public.is_admin());
DROP POLICY IF EXISTS "conv_insert_fan" ON conversations;
CREATE POLICY "conv_insert_fan" ON conversations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = fan_id);
DROP POLICY IF EXISTS "conv_delete_participant" ON conversations;
CREATE POLICY "conv_delete_participant" ON conversations FOR DELETE
  TO authenticated USING (auth.uid() = fan_id OR auth.uid() = creator_id);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  text text NOT NULL DEFAULT '',
  photo_url text,
  is_photo_locked boolean DEFAULT false,
  photo_price numeric(8,2) DEFAULT 0,
  is_audio boolean DEFAULT false,
  audio_duration text,
  is_tip boolean DEFAULT false,
  tip_amount numeric(8,2) DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON messages TO authenticated;
DROP POLICY IF EXISTS "msg_participants_read" ON messages;
CREATE POLICY "msg_participants_read" ON messages FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM conversations c WHERE c.id = messages.conversation_id
            AND (c.fan_id = auth.uid() OR c.creator_id = auth.uid()))
  );
DROP POLICY IF EXISTS "msg_insert_participant" ON messages;
CREATE POLICY "msg_insert_participant" ON messages FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM conversations c WHERE c.id = messages.conversation_id
            AND (c.fan_id = auth.uid() OR c.creator_id = auth.uid()))
  );

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'post',
  creator_id uuid REFERENCES creators(id) ON DELETE SET NULL,
  title text NOT NULL,
  message text NOT NULL DEFAULT '',
  media_url text,
  target_id text,
  target_tab text DEFAULT 'feed',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON notifications TO authenticated;
DROP POLICY IF EXISTS "notif_owner_all" ON notifications;
CREATE POLICY "notif_owner_all" ON notifications FOR ALL
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS subscriptions (
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  creator_id uuid NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, creator_id)
);
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, DELETE ON subscriptions TO authenticated;
DROP POLICY IF EXISTS "subs_owner_all" ON subscriptions;
CREATE POLICY "subs_owner_all" ON subscriptions FOR ALL
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON app_settings TO anon, authenticated;
GRANT UPDATE ON app_settings TO authenticated;
DROP POLICY IF EXISTS "settings_public_read" ON app_settings;
CREATE POLICY "settings_public_read" ON app_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "settings_admin_write" ON app_settings;
CREATE POLICY "settings_admin_write" ON app_settings FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_posts_creator ON posts(creator_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_galleries_creator ON galleries(creator_id);
CREATE INDEX IF NOT EXISTS idx_stories_creator ON stories(creator_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_creator ON subscriptions(creator_id);