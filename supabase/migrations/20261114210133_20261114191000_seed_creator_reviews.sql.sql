/*
# Create creator_reviews table and seed buyer reviews

1. New Tables
- `creator_reviews`
  - `id` (uuid, primary key)
  - `creator_id` (uuid, FK to creators, cascade delete)
  - `buyer_name` (text)
  - `buyer_avatar` (text, Unsplash URL)
  - `is_vip_buyer` (boolean)
  - `rating` (smallint, 1-5)
  - `item_purchased` (text)
  - `comment` (text)
  - `verified_purchase` (boolean)
  - `likes_count` (integer)
  - `created_at` (timestamptz)

2. Security
- Enable RLS on `creator_reviews`.
- Grant SELECT to anon + authenticated (reviews are public marketplace content).
- Public read policy (intentionally shared data).

3. Data
- Seed 2-3 Spanish buyer reviews per existing seller (VIP sellers get 3, free sellers get 2).
- Idempotent: skips any seller that already has reviews.
*/

CREATE TABLE IF NOT EXISTS creator_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  buyer_name text NOT NULL,
  buyer_avatar text NOT NULL,
  is_vip_buyer boolean NOT NULL DEFAULT false,
  rating smallint NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  item_purchased text NOT NULL,
  comment text NOT NULL,
  verified_purchase boolean NOT NULL DEFAULT true,
  likes_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS creator_reviews_creator_id_idx ON creator_reviews(creator_id);

ALTER TABLE creator_reviews ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON creator_reviews TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_creator_reviews" ON creator_reviews;
CREATE POLICY "public_read_creator_reviews"
ON creator_reviews FOR SELECT
TO anon, authenticated
USING (true);

DO $$
DECLARE
  rec record;
  idx int := 0;
  n int;
  buyers text[] := ARRAY[
    'Marcos V.','Carlos R.','Andrés G.','Javier T.','Sebastián M.','Roberto B.','Guillermo F.','Tomás P.','Diego H.','Luis A.',
    'Fernando N.','Ricardo S.','Emilio C.','Hugo B.','Mateo D.','Santiago V.','Pedro M.','Álvaro R.','Nicolás P.','Gabriel T.'
  ];
  avatars text[] := ARRAY[
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=150&q=80'
  ];
  items text[] := ARRAY[
    'Pantis de seda usados (2 días)','Medias de encaje con tacones','Galería VIP en 4K','Calcetines post-tacones',
    'Sesión privada por DM','Ligueros de satén','Corset de látex','Prenda sellada al vacío',
    'Suscripción mensual VIP','Video exclusivo en HD','Pedido personalizado a medida','Pack de fotos dedicadas'
  ];
  comments text[] := ARRAY[
    'Paquete con empaque discreto y sellado al vacío impecable. La esencia se conservó perfecta y la nota manuscrita fue un detalle encantador.',
    'Calidad de imagen espectacular y trato cercano en el chat. Respondió rápido y cumplió todo lo prometido.',
    'Entrega puntual y comprobante de envío al instante. La prenda llegó en su caja neutra sin ningún distintivo.',
    'La sesión privada superó todas mis expectativas. Vale cada moneda invertida, sin duda repetiría.',
    'Aroma auténtico y certificado de autenticidad firmado. Cliente desde hace meses, nunca me ha decepcionado.',
    'Muy profesional y discreta. El video en 4K se ve increíble y la atención por mensaje es de primera.',
    'El sellado al vacío conservó todo el perfume. Excelente presentación y envío rápido a mi ciudad.',
    'Cumplió exactamente con el pedido personalizado. Las fotos dedicadas fueron el broche perfecto.',
    'Atención VIP real: audios dedicados y respuesta en minutos. La prenda olía igual a su descripción.',
    'Compra segura y sin complicaciones. La doble bolsa hermética llegó intacta y con tarjeta de dedicatoria.',
    'Calidad fotográfica de estudio. Se nota el cuidado en cada detalle del paquete y la charla previa.',
    'Totalmente recomendada. Discreción absoluta en la factura y en el embalaje exterior.'
  ];
BEGIN
  FOR rec IN
    SELECT c.id, p.seller_tier
    FROM creators c
    JOIN profiles p ON p.id = c.id
  LOOP
    IF EXISTS (SELECT 1 FROM creator_reviews WHERE creator_id = rec.id) THEN
      CONTINUE;
    END IF;

    n := CASE WHEN rec.seller_tier = 'vip' THEN 3 ELSE 2 END;

    FOR i IN 1..n LOOP
      idx := idx + 1;
      INSERT INTO creator_reviews (
        creator_id, buyer_name, buyer_avatar, is_vip_buyer, rating, item_purchased,
        comment, verified_purchase, likes_count, created_at
      ) VALUES (
        rec.id,
        buyers[((idx - 1) % array_length(buyers, 1)) + 1],
        avatars[((idx - 1) % array_length(avatars, 1)) + 1],
        (idx % 3 <> 0),
        5,
        items[((idx - 1) % array_length(items, 1)) + 1],
        comments[((idx - 1) % array_length(comments, 1)) + 1],
        true,
        (idx * 7) % 41,
        now() - (i || ' days')::interval
      );
    END LOOP;
  END LOOP;
END $$;