/*
# Añadir enlaces sociales a vendedoras + almacenamiento público de portadas

1. Nueva columna
- `creators.social_links` (jsonb, por defecto '{}') — enlaces a redes sociales de la vendedora (instagram, twitter, tiktok, onlyfans, web).

2. Nuevo bucket de almacenamiento
- `creator-media` (público) — fotos de portada y otros medios públicos de las vendedoras.

3. Seguridad
- Lectura pública de los archivos del bucket (las portadas son visibles en el catálogo).
- Escritura, actualización y borrado restringidos a la carpeta propia de la vendedora autenticada (carpeta = id de usuario).
*/

ALTER TABLE public.creators
  ADD COLUMN IF NOT EXISTS social_links jsonb NOT NULL DEFAULT '{}'::jsonb;

INSERT INTO storage.buckets (id, name, public)
VALUES ('creator-media', 'creator-media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "creator_media_public_read" ON storage.objects;
CREATE POLICY "creator_media_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'creator-media');

DROP POLICY IF EXISTS "creator_media_owner_insert" ON storage.objects;
CREATE POLICY "creator_media_owner_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'creator-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "creator_media_owner_update" ON storage.objects;
CREATE POLICY "creator_media_owner_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'creator-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'creator-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "creator_media_owner_delete" ON storage.objects;
CREATE POLICY "creator_media_owner_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'creator-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
