/*
# Datos de muestra para Pantilibre

1. Contenido
- 4 publicaciones (posts), 4 galerías privadas, 4 prendas del armario, 4 historias.
- Cada elemento ligado a una vendedora real por username (nunca por id fijado).
- Imágenes reutilizan los editoriales locales de la carpeta pública.

2. Configuración inicial
- app_settings con flags: registro abierto, modo mantenimiento, comisión de la plataforma.
*/
INSERT INTO posts (creator_id, content, image_urls, category, tags, likes_count, is_locked)
SELECT c.id, p.content, p.imgs, p.category, p.tags, p.likes, p.is_locked
FROM (VALUES
  ('camilagold',
   'Acabo de subir una nueva sesión exclusiva al feed. Medias de seda de 10 deniers y liga dorada... Espero sus comentarios amores ✨💋',
   ARRAY['/assets/images/seller_editorial_one_1794671262551.jpg'],
   'lingerie', ARRAY['medias','satin','liga'], 342, false),
  ('elenacurvy',
   'Disponibles 2 nuevas prendas usadas en mi armario exclusivo. Doble empaque hermético termosellado al vacío y tarjeta manuscrita 💌👠',
   ARRAY['/assets/images/seller_editorial_two_1794671263611.jpg'],
   'used_clothes', ARRAY['ropausada','bbw','latex'], 218, false),
  ('victoriamature',
   'Lencería vintage de encaje francés recién estrenada. La costura trasera marca la diferencia... ¿la quieren probar? 🔥',
   ARRAY['/assets/images/seller_editorial_three_1794671264724.jpg'],
   'mature', ARRAY['mature','milf','encaje'], 486, false),
  ('lunafeet',
   'Hoy caminé 8 horas con tacones cerrados... ¿Quieren la foto exclusiva de mis suelas? Escríbanme al DM 🦶💋',
   ARRAY['/assets/images/seller_editorial_four_1794671265297.jpg'],
   'feet', ARRAY['piesbonitos','tacones','arcos'], 291, false)
) AS p(username, content, imgs, category, tags, likes, is_locked)
JOIN creators c ON c.username = p.username;

INSERT INTO galleries (creator_id, title, description, cover_url, preview_images, full_images, media_count, coin_price, category, tags, likes_count)
SELECT c.id, g.title, g.description, g.cover, g.previews, g.fulls, g.media_count, g.price, g.category, g.tags, g.likes
FROM (VALUES
  ('camilagold', 'Sesión Seda & Encaje', '12 fotos exclusivas en medias de seda y liga dorada. Iluminación cálida, ángulos íntimos.', '/assets/images/seller_editorial_one_1794671262551.jpg', ARRAY['/assets/images/seller_editorial_one_1794671262551.jpg'], ARRAY['/assets/images/seller_editorial_one_1794671262551.jpg','/assets/images/seller_editorial_two_1794671263611.jpg'], 12, 45, 'lingerie', ARRAY['medias','seda','encaje'], 124),
  ('victoriamature', 'Vintage Boudoir Madame', 'Sesión boudoir en lencería vintage con costura trasera y corset. 15 fotos de lujo.', '/assets/images/seller_editorial_three_1794671264724.jpg', ARRAY['/assets/images/seller_editorial_three_1794671264724.jpg'], ARRAY['/assets/images/seller_editorial_three_1794671264724.jpg','/assets/images/seller_editorial_four_1794671265297.jpg'], 15, 60, 'mature', ARRAY['mature','vintage','boudoir'], 203),
  ('lunafeet', 'Arcos & Stilettos Privados', 'Fotografías de arcos, suelas y tacones de 12cm tras una jornada completa. 10 fotos.', '/assets/images/seller_editorial_four_1794671265297.jpg', ARRAY['/assets/images/seller_editorial_four_1794671265297.jpg'], ARRAY['/assets/images/seller_editorial_four_1794671265297.jpg','/assets/images/seller_editorial_one_1794671262551.jpg'], 10, 35, 'feet', ARRAY['pies','stiletto','arcos'], 88),
  ('valentinabbw', 'Curvas Opulentas Boudoir', 'Sesión curvy en lencería de talla grande con iluminación suave. 14 fotos exclusivas.', '/assets/images/seller_editorial_two_1794671263611.jpg', ARRAY['/assets/images/seller_editorial_two_1794671263611.jpg'], ARRAY['/assets/images/seller_editorial_two_1794671263611.jpg','/assets/images/seller_editorial_three_1794671264724.jpg'], 14, 50, 'gorditas', ARRAY['curvy','bbw','boudoir'], 167)
) AS g(username, title, description, cover, previews, fulls, media_count, price, category, tags, likes)
JOIN creators c ON c.username = g.username;

INSERT INTO store_items (creator_id, title, description, category, price_coins, price_usd, image_url, days_worn, vacuum_sealed, certificate, in_stock)
SELECT c.id, s.title, s.description, s.category, s.price_coins, s.price_usd, s.image_url, s.days_worn, true, true, s.stock
FROM (VALUES
  ('camilagold', 'Medias de red negras (2 días de uso)', 'Medias de red negras 20 denier usadas 2 días. Termoselladas al vacío con tarjeta manuscrita.', 'used_clothes', 45, 12.99, '/assets/images/seller_editorial_one_1794671262551.jpg', 2, 1),
  ('victoriamature', 'Liguero vintage de encaje', 'Liguero de encaje francés usado una jornada completa. Certificado de autenticidad incluido.', 'used_clothes', 65, 18.50, '/assets/images/seller_editorial_three_1794671264724.jpg', 1, 1),
  ('lunafeet', 'Calcetines deportivos sudados', 'Calcetines deportivos tras 8h de sesión con tacones. Empaque al vacío doble.', 'used_clothes', 35, 9.99, '/assets/images/seller_editorial_four_1794671265297.jpg', 1, 2),
  ('elenacurvy', 'Fotos personalizadas al DM', 'Sesión de fotos personalizadas según tus indicaciones. Entrega en menos de 24h.', 'custom_media', 25, 6.99, '/assets/images/seller_editorial_two_1794671263611.jpg', NULL, 10)
) AS s(username, title, description, category, price_coins, price_usd, image_url, days_worn, stock)
JOIN creators c ON c.username = s.username;

INSERT INTO stories (creator_id, media_url, caption, is_exclusive_vip)
SELECT c.id, s.media, s.caption, s.vip
FROM (VALUES
  ('camilagold', '/assets/images/seller_editorial_one_1794671262551.jpg', 'Backstage en el tocador: probándome mis nuevas medias de red y stilettos antes de la sesión privada... ✨👠', false),
  ('victoriamature', '/assets/images/seller_editorial_three_1794671264724.jpg', 'Ajustándome el corset ceñido... Curvas al milímetro para mis suscriptores VIP 🔥🖤', true),
  ('lunafeet', '/assets/images/seller_editorial_four_1794671265297.jpg', 'Sesión con tacones de 12cm... Los arcos de mis pies quedaron exhaustos pero perfectos 😉👠', false),
  ('elenacurvy', '/assets/images/seller_editorial_two_1794671263611.jpg', 'Acabo de preparar un nuevo paquete al vacío con mi perfume favorito. Sellado al 100% y listo para viajar 📦💋', false)
) AS s(username, media, caption, vip)
JOIN creators c ON c.username = s.username;

INSERT INTO app_settings (key, value) VALUES
  ('general', '{"registration_open": true, "maintenance_mode": false, "platform_fee_percent": 15, "min_withdraw_coins": 100}'::jsonb)
ON CONFLICT (key) DO NOTHING;