/*
# Sembrar contenido principal (posts, galerías, tienda, historias)

1. Contexto
- Las migraciones anteriores solo crearon vendedoras; las tablas de contenido
  (posts, galleries, store_items, stories) quedaron vacías.
- Esta migración las rellena enlazando a vendedoras reales por username, por lo
  que es idempotente y no depende de IDs generados.

2. Contenido
- 12 publicaciones, 8 galerías privadas, 8 prendas del armario y 12 historias
  recientes (created_at = now(), dentro de la ventana de 24h que lee la app).
- Las imágenes usan las fotos de Pexels ya asociadas a cada vendedora, de modo
  que el muro, las galerías y la tienda se ven poblados al cargar.

3. Seguridad
- No cambia RLS, permisos ni datos existentes. Solo inserta contenido público.
- Cada INSERT es condicional (NOT EXISTS) para poder re-aplicarse sin duplicar.
*/

-- ============ POSTS ============
INSERT INTO posts (creator_id, content, image_urls, category, tags, likes_count, coin_price, is_locked, created_at)
SELECT c.id, p.content, p.imgs, p.category, p.tags, p.likes, p.price, p.is_locked, now() - (p.age_hours || ' hours')::interval
FROM (VALUES
  ('ada_satin', 'Editorial de satén recién salido del set. Medias de pasarela y luz suave de estudio ✨', ARRAY['https://images.pexels.com/photos/15140692/pexels-photo-15140692.jpeg?auto=compress&cs=tinysrgb&w=800'], 'lingerie', ARRAY['satin','editorial','medias'], 412, 0, false, 3),
  ('bianca_velvet', 'Corset de terciopelo burdeos ajustado. Curvas que no caben en palabras 💋', ARRAY['https://images.pexels.com/photos/16208680/pexels-photo-16208680.jpeg?auto=compress&cs=tinysrgb&w=800'], 'gorditas', ARRAY['terciopelo','corset','curvy'], 356, 0, false, 7),
  ('katarina_feet', 'Arcos de bailarina tras 6 horas de puntas. Pedicura al espejo 🩰', ARRAY['https://images.pexels.com/photos/4013692/pexels-photo-4013692.jpeg?auto=compress&cs=tinysrgb&w=800'], 'feet', ARRAY['pies','arcos','pedicura'], 298, 0, false, 11),
  ('dominique_leather', 'Botas de tacón y cuero negro. Sesión dominante solo para mi club 🖤', ARRAY['https://images.pexels.com/photos/11548432/pexels-photo-11548432.jpeg?auto=compress&cs=tinysrgb&w=800'], 'latex', ARRAY['cuero','botas','dominacion'], 501, 25, true, 18),
  ('lucia_opera', 'Ligueros de gala de mi última función de ópera. Encaje italiano que aún guarda el perfume del escenario 🎭', ARRAY['https://images.pexels.com/photos/32801810/pexels-photo-32801810.jpeg?auto=compress&cs=tinysrgb&w=800'], 'lingerie', ARRAY['encaje','ligueros','opera'], 388, 0, false, 24),
  ('alba_nylon', 'Nylon translúcido tipo niebla. Suelas y arcos que desaparecen en la luz.', ARRAY['https://images.pexels.com/photos/7945547/pexels-photo-7945547.jpeg?auto=compress&cs=tinysrgb&w=800'], 'feet', ARRAY['nylon','pies','suelas'], 274, 0, false, 30),
  ('renata_lace', 'Encaje francés heredado de mi abuela. Una pieza vintage con historia 🔥', ARRAY['https://images.pexels.com/photos/10357392/pexels-photo-10357392.jpeg?auto=compress&cs=tinysrgb&w=800'], 'lingerie', ARRAY['encaje','vintage','frances'], 322, 15, true, 40),
  ('carla_gym', 'Calcetines post-entrenamiento reales. Sudor y esfuerzo de verdad 🧦', ARRAY['https://images.pexels.com/photos/11526544/pexels-photo-11526544.jpeg?auto=compress&cs=tinysrgb&w=800'], 'used_clothes', ARRAY['gym','calcetines','sudor'], 233, 0, false, 50),
  ('vera_cashmere', 'Cashmere nude y seda champagne. Lujo silencioso para quien lo entiende ✨', ARRAY['https://images.pexels.com/photos/23991042/pexels-photo-23991042.jpeg?auto=compress&cs=tinysrgb&w=800'], 'lingerie', ARRAY['cashmere','seda','lujo'], 445, 30, true, 8),
  ('soFia_bow', 'Lazos de satén y encaje rosa palo. Coquette y dulce para mi lista VIP 🎀', ARRAY['https://images.pexels.com/photos/9456677/pexels-photo-9456677.jpeg?auto=compress&cs=tinysrgb&w=800'], 'teens', ARRAY['lazos','coquette','rosa'], 219, 0, false, 15),
  ('marina_latex', 'Cosplay de sirena en látex esmeralda. Brillo de estudio y tema marino 🧜‍♀️', ARRAY['https://images.pexels.com/photos/8221012/pexels-photo-8221012.jpeg?auto=compress&cs=tinysrgb&w=800'], 'cosplay', ARRAY['latex','sirena','cosplay'], 268, 0, false, 33),
  ('irene_boudoir', 'Boudoir en suite de hotel. Lencería de alta costura y perfume de noche 🌙', ARRAY['https://images.pexels.com/photos/37525396/pexels-photo-37525396.jpeg?auto=compress&cs=tinysrgb&w=800'], 'mature', ARRAY['boudoir','hotel','noche'], 377, 20, true, 45)
) AS p(username, content, imgs, category, tags, likes, price, is_locked, age_hours)
JOIN creators c ON c.username = p.username
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE posts.creator_id = c.id AND posts.content = p.content);

-- ============ GALLERIES ============
INSERT INTO galleries (creator_id, title, description, cover_url, preview_images, full_images, media_count, coin_price, category, tags, likes_count, created_at)
SELECT c.id, g.title, g.description, g.cover, g.previews, g.fulls, g.media_count, g.price, g.category, g.tags, g.likes, now() - (g.age_hours || ' hours')::interval
FROM (VALUES
  ('ada_satin', 'Sesión Satén Editorial', 'Full set editorial en medias de satén con luz de estudio. 14 fotos en alta resolución.', 'https://images.pexels.com/photos/12334216/pexels-photo-12334216.jpeg?auto=compress&cs=tinysrgb&w=1200', ARRAY['https://images.pexels.com/photos/15140692/pexels-photo-15140692.jpeg?auto=compress&cs=tinysrgb&w=800'], ARRAY['https://images.pexels.com/photos/15140692/pexels-photo-15140692.jpeg?auto=compress&cs=tinysrgb&w=1200','https://images.pexels.com/photos/12334216/pexels-photo-12334216.jpeg?auto=compress&cs=tinysrgb&w=1200'], 14, 45, 'lingerie', ARRAY['satin','editorial','altaresolucion'], 156, 5),
  ('dominique_leather', 'Cuero Dominante', 'Sesión en cuero negro con botas y guantes largos. 16 fotos para miembros Diamond.', 'https://images.pexels.com/photos/40225539/pexels-photo-40225539.jpeg?auto=compress&cs=tinysrgb&w=1200', ARRAY['https://images.pexels.com/photos/11548432/pexels-photo-11548432.jpeg?auto=compress&cs=tinysrgb&w=800'], ARRAY['https://images.pexels.com/photos/11548432/pexels-photo-11548432.jpeg?auto=compress&cs=tinysrgb&w=1200','https://images.pexels.com/photos/40225539/pexels-photo-40225539.jpeg?auto=compress&cs=tinysrgb&w=1200'], 16, 75, 'latex', ARRAY['cuero','dominacion','diamond'], 203, 9),
  ('katarina_feet', 'Arcos de Bailarina', 'Serie de adoración de pies: arcos, suelas y pantimedias de danza. 12 fotos.', 'https://images.pexels.com/photos/34921744/pexels-photo-34921744.jpeg?auto=compress&cs=tinysrgb&w=1200', ARRAY['https://images.pexels.com/photos/4013692/pexels-photo-4013692.jpeg?auto=compress&cs=tinysrgb&w=800'], ARRAY['https://images.pexels.com/photos/4013692/pexels-photo-4013692.jpeg?auto=compress&cs=tinysrgb&w=1200','https://images.pexels.com/photos/34921744/pexels-photo-34921744.jpeg?auto=compress&cs=tinysrgb&w=1200'], 12, 40, 'feet', ARRAY['pies','arcos','adoracion'], 118, 13),
  ('vera_cashmere', 'Lujo Silencioso', 'Cashmere nude y seda champagne en suite privada. 15 fotos con certificado.', 'https://images.pexels.com/photos/14677599/pexels-photo-14677599.jpeg?auto=compress&cs=tinysrgb&w=1200', ARRAY['https://images.pexels.com/photos/23991042/pexels-photo-23991042.jpeg?auto=compress&cs=tinysrgb&w=800'], ARRAY['https://images.pexels.com/photos/23991042/pexels-photo-23991042.jpeg?auto=compress&cs=tinysrgb&w=1200','https://images.pexels.com/photos/14677599/pexels-photo-14677599.jpeg?auto=compress&cs=tinysrgb&w=1200'], 15, 90, 'lingerie', ARRAY['cashmere','seda','certificado'], 167, 21),
  ('lucia_opera', 'Boudoir de Ópera', 'Ligueros de gala y encaje de escenario. 13 fotos con luz teatral.', 'https://images.pexels.com/photos/20828151/pexels-photo-20828151.jpeg?auto=compress&cs=tinysrgb&w=1200', ARRAY['https://images.pexels.com/photos/32801810/pexels-photo-32801810.jpeg?auto=compress&cs=tinysrgb&w=800'], ARRAY['https://images.pexels.com/photos/32801810/pexels-photo-32801810.jpeg?auto=compress&cs=tinysrgb&w=1200','https://images.pexels.com/photos/20828151/pexels-photo-20828151.jpeg?auto=compress&cs=tinysrgb&w=1200'], 13, 55, 'lingerie', ARRAY['opera','ligueros','teatral'], 132, 25),
  ('alba_nylon', 'Niebla de Nylon', 'Nylon translúcido, suelas y zapatos bailarina recién descalzados. 10 fotos.', 'https://images.pexels.com/photos/23119732/pexels-photo-23119732.jpeg?auto=compress&cs=tinysrgb&w=1200', ARRAY['https://images.pexels.com/photos/7945547/pexels-photo-7945547.jpeg?auto=compress&cs=tinysrgb&w=800'], ARRAY['https://images.pexels.com/photos/7945547/pexels-photo-7945547.jpeg?auto=compress&cs=tinysrgb&w=1200','https://images.pexels.com/photos/23119732/pexels-photo-23119732.jpeg?auto=compress&cs=tinysrgb&w=1200'], 10, 35, 'feet', ARRAY['nylon','suelas','bailarina'], 97, 29),
  ('bianca_velvet', 'Curvas Opulentas', 'Sesión curvy en corset de terciopelo. 14 fotos de lujo con iluminación cálida.', 'https://images.pexels.com/photos/14257415/pexels-photo-14257415.jpeg?auto=compress&cs=tinysrgb&w=1200', ARRAY['https://images.pexels.com/photos/16208680/pexels-photo-16208680.jpeg?auto=compress&cs=tinysrgb&w=800'], ARRAY['https://images.pexels.com/photos/16208680/pexels-photo-16208680.jpeg?auto=compress&cs=tinysrgb&w=1200','https://images.pexels.com/photos/14257415/pexels-photo-14257415.jpeg?auto=compress&cs=tinysrgb&w=1200'], 14, 50, 'gorditas', ARRAY['curvy','corset','boudoir'], 189, 37),
  ('marina_latex', 'Sirena Esmeralda', 'Cosplay acuático en látex esmeralda con brillo de estudio. 11 fotos.', 'https://images.pexels.com/photos/25565948/pexels-photo-25565948.jpeg?auto=compress&cs=tinysrgb&w=1200', ARRAY['https://images.pexels.com/photos/8221012/pexels-photo-8221012.jpeg?auto=compress&cs=tinysrgb&w=800'], ARRAY['https://images.pexels.com/photos/8221012/pexels-photo-8221012.jpeg?auto=compress&cs=tinysrgb&w=1200','https://images.pexels.com/photos/25565948/pexels-photo-25565948.jpeg?auto=compress&cs=tinysrgb&w=1200'], 11, 40, 'cosplay', ARRAY['sirena','latex','cosplay'], 104, 41)
) AS g(username, title, description, cover, previews, fulls, media_count, price, category, tags, likes, age_hours)
JOIN creators c ON c.username = g.username
WHERE NOT EXISTS (SELECT 1 FROM galleries WHERE galleries.creator_id = c.id AND galleries.title = g.title);

-- ============ STORE ITEMS ============
INSERT INTO store_items (creator_id, title, description, category, price_coins, price_usd, image_url, days_worn, vacuum_sealed, certificate, in_stock, created_at)
SELECT c.id, s.title, s.description, s.category, s.coins, s.usd, s.img, s.days, true, true, s.stock, now() - (s.age_hours || ' hours')::interval
FROM (VALUES
  ('katarina_feet', 'Calzas de danza usadas', 'Calzas de puntas usadas en ensayo. Empaque al vacío con tarjeta manuscrita.', 'used_clothes', 45, 12.99, 'https://images.pexels.com/photos/4013692/pexels-photo-4013692.jpeg?auto=compress&cs=tinysrgb&w=800', 2, 2, 10),
  ('carla_gym', 'Calcetines deportivos sudados', 'Calcetines de entrenamiento tras 2 horas de cardio. Doble sello al vacío.', 'used_clothes', 35, 9.99, 'https://images.pexels.com/photos/11526544/pexels-photo-11526544.jpeg?auto=compress&cs=tinysrgb&w=800', 1, 3, 12),
  ('ada_satin', 'Medias de satén de pasarela', 'Medias de satén usadas en shooting editorial. Certificado de autenticidad incluido.', 'used_clothes', 60, 17.50, 'https://images.pexels.com/photos/15140692/pexels-photo-15140692.jpeg?auto=compress&cs=tinysrgb&w=800', 1, 1, 20),
  ('dominique_leather', 'Guantes largos de cuero', 'Guantes de cuero negro usados en sesión. Empaque premium con lacre.', 'used_clothes', 80, 24.99, 'https://images.pexels.com/photos/40225539/pexels-photo-40225539.jpeg?auto=compress&cs=tinysrgb&w=800', 1, 1, 30),
  ('renata_lace', 'Liguero vintage de encaje', 'Liguero francés heredado, uso de sesión. Certificado y tarjeta firmada.', 'used_clothes', 70, 21.00, 'https://images.pexels.com/photos/10357392/pexels-photo-10357392.jpeg?auto=compress&cs=tinysrgb&w=800', 1, 1, 15),
  ('alba_nylon', 'Foto personalizada al DM', 'Sesión de fotos personalizada de pies al atardecer. Entrega en menos de 24h.', 'custom_media', 50, 14.50, 'https://images.pexels.com/photos/7945547/pexels-photo-7945547.jpeg?auto=compress&cs=tinysrgb&w=800', NULL, 5, 5),
  ('vera_cashmere', 'Recuerdo perfumado de vainilla', 'Tarjeta perfumada con esencia de vainilla y dedicatoria escrita a mano.', 'perfumed_souvenir', 25, 7.99, 'https://images.pexels.com/photos/23991042/pexels-photo-23991042.jpeg?auto=compress&cs=tinysrgb&w=800', NULL, 10, 8),
  ('paulina_free', 'Pantis de algodón diario', 'Pantis de algodón usados a diario. Empaque discreto y carta personal.', 'used_clothes', 15, 4.99, 'https://images.pexels.com/photos/15827724/pexels-photo-15827724.jpeg?auto=compress&cs=tinysrgb&w=800', 1, 4, 45)
) AS s(username, title, description, category, coins, usd, img, days, stock, age_hours)
JOIN creators c ON c.username = s.username
WHERE NOT EXISTS (SELECT 1 FROM store_items WHERE store_items.creator_id = c.id AND store_items.title = s.title);

-- ============ STORIES (last 24h) ============
INSERT INTO stories (creator_id, media_url, caption, is_exclusive_vip, created_at)
SELECT c.id, s.media, s.caption, s.vip, now() - (s.age_hours || ' hours')::interval
FROM (VALUES
  ('ada_satin', 'https://images.pexels.com/photos/12334216/pexels-photo-12334216.jpeg?auto=compress&cs=tinysrgb&w=800', 'Probándome las medias de satén antes del shooting ✨', false, 2),
  ('katarina_feet', 'https://images.pexels.com/photos/34921744/pexels-photo-34921744.jpeg?auto=compress&cs=tinysrgb&w=800', 'Mis arcos después de puntas... exhaustos pero perfectos 🩰', false, 4),
  ('dominique_leather', 'https://images.pexels.com/photos/40225539/pexels-photo-40225539.jpeg?auto=compress&cs=tinysrgb&w=800', 'Solo Diamante ve este set de cuero 🔥', true, 6),
  ('lucia_opera', 'https://images.pexels.com/photos/20828151/pexels-photo-20828151.jpeg?auto=compress&cs=tinysrgb&w=800', 'Backstage: ajustándome el liguero de gala 🎭', false, 8),
  ('vera_cashmere', 'https://images.pexels.com/photos/14677599/pexels-photo-14677599.jpeg?auto=compress&cs=tinysrgb&w=800', 'Cashmere nude en la suite... lujo silencioso ✨', true, 10),
  ('alba_nylon', 'https://images.pexels.com/photos/23119732/pexels-photo-23119732.jpeg?auto=compress&cs=tinysrgb&w=800', 'Nylon tipo niebla, apenas se ve 😉', false, 12),
  ('bianca_velvet', 'https://images.pexels.com/photos/14257415/pexels-photo-14257415.jpeg?auto=compress&cs=tinysrgb&w=800', 'Corset de terciopelo ajustado al cuerpo 💋', false, 14),
  ('carla_gym', 'https://images.pexels.com/photos/34751826/pexels-photo-34751826.jpeg?auto=compress&cs=tinysrgb&w=800', 'Post-entreno real... sudor de verdad 🧦', false, 16),
  ('marina_latex', 'https://images.pexels.com/photos/25565948/pexels-photo-25565948.jpeg?auto=compress&cs=tinysrgb&w=800', 'Cosplay sirena: el látex brilla en estudio 🧜‍♀️', false, 18),
  ('renata_lace', 'https://images.pexels.com/photos/19138128/pexels-photo-19138128.jpeg?auto=compress&cs=tinysrgb&w=800', 'Encaje francés vintage... una joya heredada 🔥', false, 20),
  ('irene_boudoir', 'https://images.pexels.com/photos/33847264/pexels-photo-33847264.jpeg?auto=compress&cs=tinysrgb&w=800', 'Suite boudoir lista para mi VIP 🌙', true, 22),
  ('paulina_free', 'https://images.pexels.com/photos/10426587/pexels-photo-10426587.jpeg?auto=compress&cs=tinysrgb&w=800', 'Luz de ventana y algodón... natural 🌸', false, 23)
) AS s(username, media, caption, vip, age_hours)
JOIN creators c ON c.username = s.username
WHERE NOT EXISTS (SELECT 1 FROM stories WHERE stories.creator_id = c.id AND stories.media_url = s.media);
