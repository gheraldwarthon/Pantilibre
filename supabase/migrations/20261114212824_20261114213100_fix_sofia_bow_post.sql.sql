/*
# Corregir publicación faltante de sofia_bow

1. Contexto
- El semillero anterior tenía un error de mayúscula en el username ("soFia_bow"),
  por lo que esa publicación no entró. Este cambio la inserta con el nombre real.
- Idempotente: condiciona por contenido para no duplicar.
*/

INSERT INTO posts (creator_id, content, image_urls, category, tags, likes_count, coin_price, is_locked, created_at)
SELECT c.id, p.content, p.imgs, p.category, p.tags, p.likes, p.price, p.is_locked, now() - (p.age_hours || ' hours')::interval
FROM (VALUES
  ('sofia_bow', 'Lazos de satén y encaje rosa palo. Coquette y dulce para mi lista VIP 🎀',
   ARRAY['https://images.pexels.com/photos/9456677/pexels-photo-9456677.jpeg?auto=compress&cs=tinysrgb&w=800'],
   'teens', ARRAY['lazos','coquette','rosa'], 219, 0, false, 15)
) AS p(username, content, imgs, category, tags, likes, price, is_locked, age_hours)
JOIN creators c ON c.username = p.username
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE posts.creator_id = c.id AND posts.content = p.content);
