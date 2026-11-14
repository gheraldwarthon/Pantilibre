/*
# Añadir 40 vendedoras de demostración (20 VIP + 20 FREE)

1. Contexto
- La app ya tiene 9 vendedoras sembradas. Esta migración añade 40 nuevas:
  20 con seller_tier = 'vip' y 20 con seller_tier = 'free'.
- Cada vendedora necesita una fila en auth.users (profiles.id es FK a auth.users),
  una fila en profiles y otra en creators.

2. Usuarios de demostración
- Se crean usuarios en auth.users con correo <username>@pantilibre.demo y
  contraseña compartida de demostración "Demo1234!". Solo para la demo visual.
- role = 'creator', plan = 'gold_vip', seller_tier = vip|free según corresponda.

3. Contenido
- Fotos reales de Pexels (licencia libre) para avatar y portada.
- Datos coherentes: categorías, tags, bio, ubicación, precios y métricas.
- VIP: badges VIP/SUPER_VIP/DIAMOND y precios altos; FREE: precios bajos.

4. Seguridad
- No cambia RLS ni permisos; las inserciones usan los roles del MCP (bypass RLS).
- Idempotente: ON CONFLICT DO NOTHING y comprobación de email existente.
*/

DO $$
DECLARE
  v_rows constant text := $rows$
    ('lucia_opera','Lucía Ópera Lingerie','vip','SUPER_VIP',
     ARRAY['lingerie','mature'], ARRAY['seda','encaje','ligueros','elegancia'],
     'Soprano retirada del coro. Vendo mis medias de seda italianas de escenario, ligueros de gala y prendas con perfume de teatro.',
     'Milán, IT','https://images.pexels.com/photos/32801810/pexels-photo-32801810.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/20828151/pexels-photo-20828151.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.97,215,3900,21.99),
    ('bianca_velvet','Bianca Velvet Rose','vip','VIP',
     ARRAY['lingerie','gorditas'], ARRAY['terciopelo','curvy','curvas','corset'],
     'Curvas envueltas en terciopelo burdeos. Sets de corset artesanal y prendas usadas con mi esencia de vainilla.',
     'Lisboa, PT','https://images.pexels.com/photos/16208680/pexels-photo-16208680.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/14257415/pexels-photo-14257415.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.95,188,3400,19.50),
    ('ada_satin','Ada Satin Editorial','vip','SUPER_VIP',
     ARRAY['lingerie','teens'], ARRAY['editorial','satin','medias','fashion'],
     'Modelo editorial de día, fetiche de noche. Medias de satén de pasarela, prendas de shooting usadas y sets en alta resolución.',
     'Barcelona, ES','https://images.pexels.com/photos/15140692/pexels-photo-15140692.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/12334216/pexels-photo-12334216.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.96,240,4100,22.50),
    ('renata_lace','Renata Lace Whisper','vip','VIP',
     ARRAY['lingerie','mature'], ARRAY['encaje','frances','mature','delicadeza'],
     'Encaje francés susurrado sobre piel. Colección de ligueros vintage heredados y prendas con historia.',
     'París, FR','https://images.pexels.com/photos/10357392/pexels-photo-10357392.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/19138128/pexels-photo-19138128.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.94,175,3200,20.00),
    ('dominique_leather','Dominique Leather Grace','vip','DIAMOND',
     ARRAY['latex','mature'], ARRAY['cuero','dominacion','botas','elegante'],
     'Elegancia en cuero negro. Dominación sensual con botas de tacón, guantes largos y prendas de sesión usadas.',
     'Ámsterdam, NL','https://images.pexels.com/photos/11548432/pexels-photo-11548432.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/40225539/pexels-photo-40225539.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.99,310,5000,24.99),
    ('katarina_feet','Katarina Arch Diva','vip','SUPER_VIP',
     ARRAY['feet','lingerie'], ARRAY['piesbonitos','arcos','tacones','pedicura'],
     'Arcos de bailarina, talla 36 y pedicura impecable. Sesiones de adoración, suelas y pantimedias de danza.',
     'Praga, CZ','https://images.pexels.com/photos/4013692/pexels-photo-4013692.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/34921744/pexels-photo-34921744.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.98,265,4400,21.00),
    ('sofia_bow','Sofia Bow & Blush','vip','VIP',
     ARRAY['teens','lingerie'], ARRAY['lazos','rosa','teen18','coquette'],
     'Estética coquette: lazos de satén, encaje rosa palo y pantis con olor dulce. Sets jóvenes (18+) y delicados.',
     'Sevilla, ES','https://images.pexels.com/photos/9456677/pexels-photo-9456677.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/38443359/pexels-photo-38443359.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.93,120,2600,15.50),
    ('yara_gold','Yara Golden Hour','vip','SUPER_VIP',
     ARRAY['lingerie','feet'], ARRAY['goldenhour','dorada','medias','sunset'],
     'Fotos en luz dorada de atardecer. Medias brillantes, pies con pulido espejo y tacones de gala.',
     'Cancún, MX','https://images.pexels.com/photos/20459105/pexels-photo-20459105.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/29090944/pexels-photo-29090944.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.97,230,4200,20.50),
    ('ines_coffee','Inés Coffee & Satin','vip','VIP',
     ARRAY['lingerie','used_clothes'], ARRAY['cafe','satin','ropausada','manana'],
     'Mañanas de café y satén. Mis pantis de desayuno, calcetines de lana y braguitas de algodón listas para envío.',
     'Bogotá, CO','https://images.pexels.com/photos/29352197/pexels-photo-29352197.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/9758680/pexels-photo-9758680.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.92,145,2900,17.00),
    ('cecilia_pearl','Cecilia Pearl Diver','vip','DIAMOND',
     ARRAY['mature','latex'], ARRAY['perlas','latex','elegancia','joyas'],
     'Coleccionista de perlas y látex negro. Sesiones con joyería fina y catsuits de concurso pulido.',
     'Viena, AT','https://images.pexels.com/photos/12678150/pexels-photo-12678150.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/31850380/pexels-photo-31850380.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.99,290,5100,26.00),
    ('marina_latex','Marina Latex Abyss','vip','VIP',
     ARRAY['latex','cosplay'], ARRAY['latex','sirena','cosplay','brillo'],
     'Sirena de látex esmeralda, cosplay acuático y guantes hasta el codo. Fotos de estudio con tema marino.',
     'Cádiz, ES','https://images.pexels.com/photos/8221012/pexels-photo-8221012.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/25565948/pexels-photo-25565948.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.95,160,3000,18.99),
    ('noelia_bond','Noelia Bond Girl','vip','SUPER_VIP',
     ARRAY['cosplay','mature'], ARRAY['bond','spy','elegante','vestido'],
     'Espía de cine: vestidos de gala, medias de costura al estilo clásico y sesiones con temática de película.',
     'Ginebra, CH','https://images.pexels.com/photos/20483250/pexels-photo-20483250.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/40675488/pexels-photo-40675488.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.96,205,3800,22.00),
    ('paula_secretary','Paula Secretary 9to5','vip','VIP',
     ARRAY['cosplay','used_clothes'], ARRAY['secretaria','oficina','medias','ropausada'],
     'Secretaria de oficina real. Mis medias de 9 a 5, zapatos de salón gastados y ropa de oficina usada con olor personal.',
     'Santiago, CL','https://images.pexels.com/photos/6001818/pexels-photo-6001818.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/27014626/pexels-photo-27014626.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.91,110,2500,16.50),
    ('vera_cashmere','Vera Cashmere Nude','vip','DIAMOND',
     ARRAY['lingerie','mature'], ARRAY['cashmere','nude','seda','lujo'],
     'Cashmere nude y seda champagne. Lujo silencioso: prendas de marca usadas, certificados firmados y envíos blindados.',
     'Mónaco, MC','https://images.pexels.com/photos/23991042/pexels-photo-23991042.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/14677599/pexels-photo-14677599.jpeg?auto=compress&cs=tinysrgb&w=1200',
     5.00,340,5600,27.50),
    ('alba_nylon','Alba Nylon Mist','vip','SUPER_VIP',
     ARRAY['feet','lingerie'], ARRAY['nylon','translucido','pies','suela'],
     'Nylon translúcido tipo niebla. Suelas perfectas, arcos finos y zapatos bailarina recién descalzados.',
     'Oporto, PT','https://images.pexels.com/photos/7945547/pexels-photo-7945547.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/23119732/pexels-photo-23119732.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.96,225,4000,19.99),
    ('carla_gym','Carla Gym Socks','vip','VIP',
     ARRAY['used_clothes','feet'], ARRAY['gym','calcetines','deportivo','entreno'],
     'Deportista de competición. Calcetines de entrenamiento sudados, medias de compresión y ropa de gimnasio usada.',
     'Rosario, AR','https://images.pexels.com/photos/11526544/pexels-photo-11526544.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/34751826/pexels-photo-34751826.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.90,98,2300,15.99),
    ('daniela_goth','Daniela Gothic Doll','vip','VIP',
     ARRAY['latex','cosplay'], ARRAY['goth','muneca','corset','oscura'],
     'Muñeca gótica: corsets de cuero, maquillaje dramático y medias rasgadas. Sets con elegancia siniestra.',
     'Budapest, HU','https://images.pexels.com/photos/14724697/pexels-photo-14724697.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/30886741/pexels-photo-30886741.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.89,88,2100,14.99),
    ('irene_boudoir','Irene Boudoir Secrets','vip','SUPER_VIP',
     ARRAY['mature','lingerie'], ARRAY['boudoir','secreto','lenceria','noche'],
     'Boudoir de hotel de lujo. Sesiones íntimas en suites, lencería de alta costura y prendas con perfume de noche.',
     'Buenos Aires, AR','https://images.pexels.com/photos/37525396/pexels-photo-37525396.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/33847264/pexels-photo-33847264.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.98,250,4600,23.00),
    ('miranda_silk','Miranda Silk Kimono','vip','VIP',
     ARRAY['lingerie','teens'], ARRAY['kimono','seda','oriental','medias'],
     'Kimonos de seda japonesa, obi ceñido y medias tobi. Estética oriental elegante con toques fetiche.',
     'Kyoto, JP','https://images.pexels.com/photos/20828151/pexels-photo-20828151.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/19220342/pexels-photo-19220342.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.94,135,2800,17.99),
    ('olivia_champagne','Olivia Champagne Bubbles','vip','VIP',
     ARRAY['teens','lingerie'], ARRAY['champagne','burbujas','fiesta','lenceria'],
     'Champagne, burbujas y lencería de gala. Sesiones de fiesta, copas y pantis con aroma a celebración.',
     'Niza, FR','https://images.pexels.com/photos/325865/pexels-photo-325865.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/14724697/pexels-photo-14724697.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.92,118,2700,16.99),
    ('paulina_free','Paulina Free Spirit','free','VIP',
     ARRAY['lingerie'], ARRAY['libre','casera','algodon','cercana'],
     'Vendedora nueva en plan gratuito. Pantis de algodón diarios, fotos caseras con móvil y trato cercano.',
     'Quito, EC','https://images.pexels.com/photos/15827724/pexels-photo-15827724.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/10426587/pexels-photo-10426587.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.85,24,420,4.99),
    ('clara_free','Clara Free Bloom','free','VIP',
     ARRAY['teens','lingerie'], ARRAY['floral','teen18','casero','primavera'],
     'Estudiante con armario floral. Medias de primavera, braguitas de flores y polaroids con dedicatoria.',
     'Zaragoza, ES','https://images.pexels.com/photos/34238049/pexels-photo-34238049.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/9456677/pexels-photo-9456677.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.88,31,560,5.50),
    ('rubi_free','Rubi Free Scarlet','free','VIP',
     ARRAY['lingerie','used_clothes'], ARRAY['escarlata','pasion','ropausada','rojo'],
     'Rojo pasión en cada prenda. Braguitas escarlatas usadas, medias rojas de baile y beso de labial en cada paquete.',
     'Asunción, PY','https://images.pexels.com/photos/2878431/pexels-photo-2878431.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/10357392/pexels-photo-10357392.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.86,27,480,5.99),
    ('sonia_free','Sonia Free Sunset','free','VIP',
     ARRAY['feet','lingerie'], ARRAY['atardecer','pies','suela','dorada'],
     'Fotos de pies al atardecer. Suelas doradas, arcos suaves y calcetines de algodón usados al final del día.',
     'Málaga, ES','https://images.pexels.com/photos/16869444/pexels-photo-16869444.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/29090942/pexels-photo-29090942.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.83,19,350,4.50),
    ('tatiana_free','Tatiana Free Velvet','free','VIP',
     ARRAY['mature','lingerie'], ARRAY['terciopelo','madura','elegante','suave'],
     'Mujer madura con toque de terciopelo. Lencería suave, prendas usadas con cariño y audios susurrados.',
     'Córdoba, AR','https://images.pexels.com/photos/3936894/pexels-photo-3936894.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/32801805/pexels-photo-32801805.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.87,22,390,6.50),
    ('melissa_free','Melissa Free Gym','free','VIP',
     ARRAY['used_clothes','feet'], ARRAY['gym','deporte','calcetines','sudor'],
     'Gimnasio diario y calcetines sudados. Prendas deportivas usadas, fotos post-entrenamiento y videos cortos.',
     'Guayaquil, EC','https://images.pexels.com/photos/35367077/pexels-photo-35367077.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/11526544/pexels-photo-11526544.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.82,17,320,4.99),
    ('aisha_free','Aisha Free Henna','free','VIP',
     ARRAY['lingerie','cosplay'], ARRAY['henna','danza','velo','exotica'],
     'Danzarina con henna en las manos. Velos de danza, medias doradas y prendas con perfume de incienso.',
     'Casablanca, MA','https://images.pexels.com/photos/40322798/pexels-photo-40322798.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/15790242/pexels-photo-15790242.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.85,21,410,5.50),
    ('nadia_free','Nadia Free Snow','free','VIP',
     ARRAY['lingerie','mature'], ARRAY['nieve','invierno','lana','calcetines'],
     'Invierno nórdico: calcetines de lana, medias térmicas y prendas con olor a hogar. Fotos junto a la chimenea.',
     'Oslo, NO','https://images.pexels.com/photos/38483793/pexels-photo-38483793.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/19220342/pexels-photo-19220342.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.89,25,450,6.00),
    ('bianca_free','Bianca Free Petal','free','VIP',
     ARRAY['teens','lingerie'], ARRAY['petalo','dulce','rosa','casero'],
     'Dulce como pétalos. Braguitas rosadas, medias con lazo y fotos con luz natural de ventana.',
     'Montevideo, UY','https://images.pexels.com/photos/39139045/pexels-photo-39139045.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/20459105/pexels-photo-20459105.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.84,15,290,4.99),
    ('camila_free','Camila Free Studious','free','VIP',
     ARRAY['teens','used_clothes'], ARRAY['estudiante','universidad','medias','ropa'],
     'Universitaria de biblioteca. Mis medias de clase, calcetines de estudio y ropa cómoda usada entre apuntes.',
     'La Plata, AR','https://images.pexels.com/photos/10426587/pexels-photo-10426587.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/7945547/pexels-photo-7945547.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.81,13,260,4.50),
    ('delfina_free','Delfina Free Waves','free','VIP',
     ARRAY['feet','teens'], ARRAY['olas','playa','pies','arena'],
     'Vida de playa: pies con arena, sandalias gastadas y medias de red de verano con olor a mar.',
     'Punta del Este, UY','https://images.pexels.com/photos/325865/pexels-photo-325865.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/16208680/pexels-photo-16208680.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.87,20,380,5.50),
    ('esmeralda_free','Esmeralda Free Jade','free','VIP',
     ARRAY['lingerie','latex'], ARRAY['jade','esmeralda','brillo','verde'],
     'Látex verde jade para debutantes. Sets introductorios, brillo suave y prendas de prueba económicas.',
     'Cochabamba, BO','https://images.pexels.com/photos/20483250/pexels-photo-20483250.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/30696273/pexels-photo-30696273.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.83,18,340,5.99),
    ('fiona_free','Fiona Free Woods','free','VIP',
     ARRAY['used_clothes','mature'], ARRAY['bosque','natural','lana','rural'],
     'Vida rural: lana de oveja, medias gruesas de bosque y prendas de campo con aroma a leña.',
     'Cuenca, EC','https://images.pexels.com/photos/9758680/pexels-photo-9758680.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/8221012/pexels-photo-8221012.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.86,16,300,5.00),
    ('gabriela_free','Gabriela Free Campus','free','VIP',
     ARRAY['teens','lingerie'], ARRAY['campus','universitaria','lazo','coqueta'],
     'Chica de campus con lazos en el pelo. Medias de universidad, braguitas dulces y polaroids de dormitorio.',
     'Lima, PE','https://images.pexels.com/photos/29352197/pexels-photo-29352197.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/38443359/pexels-photo-38443359.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.85,23,370,5.50),
    ('helena_free','Helena Free Dancer','free','VIP',
     ARRAY['feet','cosplay'], ARRAY['bailarina','puntas','medias','teatro'],
     'Bailarina de teatro independiente. Medias de puntas gastadas, zapatillas de lona sudadas y calcetines de ensayo.',
     'Brasilia, BR','https://images.pexels.com/photos/37524408/pexels-photo-37524408.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/34921744/pexels-photo-34921744.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.88,26,430,6.00),
    ('ivana_free','Ivana Free Boho','free','VIP',
     ARRAY['lingerie','mature'], ARRAY['boho','encaje','crochet','artesanal'],
     'Espíritu boho: crochet artesanal, encaje rústico y prendas tejidas con aroma a hierbas secas.',
     'Mendoza, AR','https://images.pexels.com/photos/39139045/pexels-photo-39139045.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/31850380/pexels-photo-31850380.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.80,12,240,4.99),
    ('julieta_free','Julieta Free Comic','free','VIP',
     ARRAY['cosplay','teens'], ARRAY['comic','nerd','cosplay','casero'],
     'Cosplay casero de cómics. Lentejuelas, medias de personaje y disfraces hechos a mano con mucho cariño.',
     'Medellín, CO','https://images.pexels.com/photos/20483250/pexels-photo-20483250.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/23119732/pexels-photo-23119732.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.82,14,280,5.00),
    ('karla_free','Karla Free Biker','free','VIP',
     ARRAY['used_clothes','latex'], ARRAY['biker','cuero','chaqueta','moto'],
     'Chica de moto: chaqueta de cuero gastada, guantes usados y medias bajo el uniforme de ruta.',
     'Córdoba, ES','https://images.pexels.com/photos/2878431/pexels-photo-2878431.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/40225539/pexels-photo-40225539.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.84,19,330,5.50),
    ('lola_free','Lola Free Bells','free','VIP',
     ARRAY['cosplay','lingerie'], ARRAY['campanas','juguetona','lazo','juegos'],
     'Juguetona con cascabeles. Lencería de juego, medias con campanitas y audios risueños personalizados.',
     'Santa Cruz, BO','https://images.pexels.com/photos/16869444/pexels-photo-16869444.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/12334216/pexels-photo-12334216.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.83,21,360,5.99),
    ('marisol_free','Marisol Free Mango','free','VIP',
     ARRAY['teens','used_clothes'], ARRAY['mango','tropical','frutal','verano'],
     'Trópico en cada paquete: prendas con aroma a mango, medias ligera y ropa fresca de verano.',
     'Cancún, MX','https://images.pexels.com/photos/34238049/pexels-photo-34238049.jpeg?auto=compress&cs=tinysrgb&w=400&h=600','https://images.pexels.com/photos/10426587/pexels-photo-10426587.jpeg?auto=compress&cs=tinysrgb&w=1200',
     4.81,11,230,4.50)
  $rows$;
  i int := 0;
  tier text;
  badge text;
  price numeric;
  new_id uuid;
  rec record;
BEGIN
  FOR rec IN EXECUTE
    'SELECT * FROM (VALUES ' || v_rows || ') AS v(username,name,tier,badge,categories,tags,bio,location,avatar,cover,rating,reviews,subs,price)'
  LOOP
    i := i + 1;
    tier := rec.tier;
    badge := rec.badge;
    price := rec.price;

    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = rec.username || '@pantilibre.demo') THEN
      INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, created_at, updated_at,
        raw_app_meta_data, raw_user_meta_data
      ) VALUES (
        '00000000-0000-0000-0000-000000000000', gen_random_uuid(),
        'authenticated', 'authenticated',
        rec.username || '@pantilibre.demo', NULL,
        now(), now() - (i || ' days')::interval, now(),
        '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb
      )
      RETURNING id INTO new_id;
    ELSE
      SELECT id INTO new_id FROM auth.users WHERE email = rec.username || '@pantilibre.demo';
    END IF;

    INSERT INTO profiles (id, username, name, avatar_url, role, plan, seller_tier, photo_limit, coins)
    VALUES (new_id, rec.username, rec.name, rec.avatar, 'creator', 'gold_vip', tier, NULL, 500)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO creators (
      id, username, name, avatar_url, cover_url, badge, is_verified, is_online, featured,
      categories, tags, bio, location, rating, review_count, subscribers_count,
      monthly_subscription_price, joined_at, social_quote, height, shoe_size, measurements, favorite_perfume
    )
    SELECT
      new_id, rec.username, rec.name, rec.avatar, rec.cover, badge, true,
      (i % 3 <> 2), rec.tier = 'vip' AND i % 4 = 1,
      rec.categories, rec.tags, rec.bio, rec.location, rec.rating, rec.reviews, rec.subs,
      price, now() - (i || ' days')::interval,
      NULL, '1.68 m', '37 EUR / 4.5 UK', '88 - 60 - 92 cm', 'Esencia de Vainilla'
    ON CONFLICT (id) DO NOTHING;
  END LOOP;
END $$;
