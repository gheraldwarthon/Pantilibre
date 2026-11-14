import React from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Container,
  Breadcrumbs,
  Link
} from '@mui/material';
import { ArrowBack, Gavel, PrivacyTip, Description } from '@mui/icons-material';
import { PantilibreLogo } from './PantilibreLogo';

export type LegalPage = 'terms' | 'privacy';

interface LegalSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

const COMPANY = 'ZVIG USA, Inc.';
const SITE = 'https://pantilibre.com';

const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: 'Condiciones de uso',
    paragraphs: [
      'Última actualización: 29 de abril de 2022.',
      `Estos Términos y Condiciones ("Términos") rigen su relación con el sitio web ${SITE} (el "Servicio") operado por ${COMPANY} ("nosotros", "nos" o "nuestro"). Lea atentamente estos Términos antes de utilizar el Servicio.`
    ]
  },
  {
    heading: 'Aceptación de los términos',
    paragraphs: [
      'Su acceso y uso del Servicio están condicionados a la aceptación y el cumplimiento de estos Términos. Estos Términos se aplican a todos los visitantes, usuarios y demás personas que accedan o utilicen el Servicio.',
      'Al acceder o utilizar el Servicio, usted acepta regirse por estos Términos. Si no está de acuerdo con alguna parte de los términos, no podrá acceder al Servicio.'
    ]
  },
  {
    heading: 'Compras',
    paragraphs: [
      'Si desea adquirir algún producto o servicio disponible a través del Servicio ("Compra"), es posible que se le solicite que proporcione cierta información relevante para su Compra, incluyendo su número de tarjeta de crédito, la fecha de vencimiento, su dirección de facturación y su información de envío.',
      'Usted declara y garantiza que tiene el derecho legal de usar cualquier tarjeta de crédito u otro método de pago en relación con cualquier Compra, y que la información que nos proporciona es verdadera, correcta y completa.',
      'Al enviar dicha información, usted nos otorga el derecho de proporcionarla a terceros con el fin de facilitar la finalización de las compras.',
      'Nos reservamos el derecho de rechazar o cancelar su pedido en cualquier momento por motivos como disponibilidad del producto o servicio, errores en la descripción o el precio, errores en su pedido, o ante la sospecha de fraude o de una transacción no autorizada o ilegal.'
    ]
  },
  {
    heading: 'Disponibilidad, errores e imprecisiones',
    paragraphs: [
      'Actualizamos constantemente nuestra oferta de productos y servicios. Es posible que algunos productos o servicios tengan precios incorrectos, descripciones inexactas o no estén disponibles, y que se produzcan retrasos en la actualización de la información.',
      'No podemos garantizar la exactitud ni la integridad de la información, incluidos precios, imágenes, especificaciones, disponibilidad y servicios. Nos reservamos el derecho de modificar o actualizar la información y de corregir errores, inexactitudes u omisiones en cualquier momento y sin previo aviso.'
    ]
  },
  {
    heading: 'Concursos, sorteos y promociones',
    paragraphs: [
      'Los concursos, sorteos u otras promociones ("Promociones") disponibles a través del Servicio pueden regirse por reglas distintas a estos Términos. Si participa en alguna Promoción, revise las reglas correspondientes y nuestra Política de Privacidad. En caso de conflicto, prevalecerán las reglas de la Promoción.'
    ]
  },
  {
    heading: 'Suscripciones',
    paragraphs: [
      'Algunas partes del Servicio se facturan mediante suscripción. Se le facturará por adelantado de forma recurrente y periódica, con ciclos de facturación mensuales.',
      'Al finalizar cada ciclo, su Suscripción se renovará automáticamente en las mismas condiciones, a menos que usted la cancele. Puede cancelar la renovación a través de la página de administración de su cuenta o contactando al equipo de atención al cliente.',
      'Para procesar el pago se requiere un método de pago válido. Deberá proporcionar información de facturación precisa y completa. Al enviar dicha información, autoriza automáticamente el cargo de todos los cargos de suscripción generados a través de su cuenta.',
      'Si la facturación automática falla, se emitirá una factura electrónica indicando que debe proceder manualmente con el pago completo correspondiente al período indicado.'
    ]
  },
  {
    heading: 'Cambios en las tarifas',
    paragraphs: [
      'Podremos modificar las tarifas de suscripción a nuestra entera discreción y en cualquier momento. Cualquier cambio entrará en vigor al final del ciclo de facturación vigente.',
      'Le notificaremos con antelación suficiente cualquier cambio para que tenga la oportunidad de cancelar su suscripción antes de que el cambio entre en vigor. El uso continuado del Servicio después de que el cambio entre en vigor constituye su aceptación del importe modificado.'
    ]
  },
  {
    heading: 'Reembolsos',
    paragraphs: [
      'Las cuotas de suscripción pagadas son reembolsables; póngase en contacto con nuestro servicio de atención al cliente para solicitar un reembolso.'
    ]
  },
  {
    heading: 'Contenido',
    paragraphs: [
      'Nuestro Servicio le permite publicar, enlazar, almacenar, compartir y poner a disposición de otros cierta información, texto, gráficos, vídeos u otro material ("Contenido"). Usted es responsable del Contenido que publique, incluyendo su legalidad, fiabilidad y adecuación.',
      'Se prohíbe el Contenido que incluya sangre, violencia, menores de edad, falta de consentimiento y cualquier otro material ilegal u ofensivo.',
      'Al publicar Contenido, usted acepta otorgarnos el derecho y la licencia para usar, modificar, ejecutar públicamente, mostrar públicamente, reproducir y distribuir dicho Contenido en y a través del Servicio, así como ponerlo a disposición de otros usuarios.',
      'Usted conserva todos sus derechos sobre cualquier Contenido que envíe, publique o muestre, y declara que es su propietario o tiene derecho a usarlo y otorgarnos los derechos estipulados en estos Términos.',
      'La publicación de su Contenido no debe violar los derechos de privacidad, publicidad, derechos de autor, derechos contractuales ni ningún otro derecho de ninguna persona. Ninguna persona que no le haya dado su consentimiento por escrito podrá aparecer en el contenido.',
      'Usted debe verificar la edad y la identidad de todas las personas que aparecen en el contenido, garantizar que todas sean adultas y poder proporcionar pruebas que lo respalden si se solicitan.'
    ]
  },
  {
    heading: 'Cuentas',
    paragraphs: [
      'Al crear una cuenta, debe proporcionar información precisa, completa y actualizada en todo momento. El incumplimiento de esta obligación constituye una violación de los Términos y puede resultar en la cancelación inmediata de su cuenta.',
      'Usted es responsable de salvaguardar la contraseña que utiliza para acceder al Servicio y de todas las actividades realizadas bajo su contraseña. Se compromete a no revelar su contraseña a terceros y a notificarnos inmediatamente si detecta cualquier violación de seguridad o uso no autorizado de su cuenta.',
      'No podrá utilizar como nombre de usuario el nombre de otra persona o entidad, ni un nombre que no esté legalmente disponible o que sea ofensivo, vulgar u obsceno.'
    ]
  },
  {
    heading: 'Propiedad intelectual',
    paragraphs: [
      'El Servicio y su contenido original (excluyendo el contenido aportado por los usuarios), características y funcionalidades son y seguirán siendo propiedad exclusiva de Pantilibre y sus licenciantes.',
      'Nuestras marcas registradas e imagen comercial no podrán utilizarse en relación con ningún producto o servicio sin el consentimiento previo por escrito de Pantilibre.'
    ]
  },
  {
    heading: 'Enlaces a otros sitios web',
    paragraphs: [
      'Nuestro Servicio puede contener enlaces a sitios web o servicios de terceros que no son de nuestra propiedad ni están controlados por nosotros.',
      'No tenemos control ni asumimos responsabilidad alguna sobre el contenido, las políticas de privacidad o las prácticas de sitios web o servicios de terceros. Le recomendamos encarecidamente que lea los términos y las políticas de privacidad de cualquier sitio de terceros que visite.'
    ]
  },
  {
    heading: 'Terminación',
    paragraphs: [
      'Podemos cancelar o suspender su cuenta de inmediato, sin previo aviso ni responsabilidad alguna, por cualquier motivo, incluyendo el incumplimiento de los Términos.',
      'Tras la rescisión, su derecho a utilizar el Servicio cesará de inmediato. Si desea cancelar su cuenta, puede dejar de utilizar el Servicio.'
    ]
  },
  {
    heading: 'Limitación de responsabilidad',
    paragraphs: [
      'En ningún caso Pantilibre, ni sus directores, empleados, socios, agentes, proveedores o afiliados, serán responsables de ningún daño indirecto, incidental, especial, consecuencial o punitivo, incluyendo la pérdida de ganancias, datos, uso o fondo de comercio, que resulten del acceso o uso del Servicio, de cualquier conducta o contenido de terceros, del contenido obtenido del Servicio, o del acceso, uso o alteración no autorizados de sus transmisiones o contenido.'
    ]
  },
  {
    heading: 'Descargo de responsabilidad',
    paragraphs: [
      'El uso del Servicio es bajo su exclusiva responsabilidad. El Servicio se proporciona "tal cual" y "según disponibilidad", sin garantías de ningún tipo, ya sean expresas o implícitas.',
      'No garantizamos que el Servicio funcione sin interrupciones, de forma segura o que esté disponible en un momento o lugar determinado; que se corrijan los errores o defectos; que el Servicio esté libre de virus; o que los resultados del uso cumplan con sus requisitos.'
    ]
  },
  {
    heading: 'Ley aplicable',
    paragraphs: [
      'Estos Términos se regirán e interpretarán de conformidad con las leyes de Bulgaria, sin tener en cuenta sus disposiciones sobre conflicto de leyes.',
      'Si alguna disposición de estos Términos se considera inválida o inaplicable, las demás disposiciones permanecerán vigentes. Estos Términos constituyen el acuerdo completo entre nosotros respecto al Servicio.'
    ]
  },
  {
    heading: 'Cambios',
    paragraphs: [
      'Nos reservamos el derecho de modificar o reemplazar estos Términos en cualquier momento. Si la modificación es sustancial, procuraremos notificarle con al menos 30 días de antelación antes de que entren en vigor los nuevos términos.',
      'Al continuar accediendo o utilizando el Servicio después de que dichas revisiones entren en vigor, usted acepta regirse por los términos revisados. Si no está de acuerdo, deje de utilizar el Servicio.'
    ]
  },
  {
    heading: 'Contáctanos',
    paragraphs: [
      'Si tiene alguna pregunta sobre estos Términos, póngase en contacto con nosotros en support@pantilibre.com.'
    ]
  }
];

const PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: 'Política de privacidad',
    paragraphs: [
      'Fecha de entrada en vigor: 16 de mayo de 2018.',
      `${COMPANY} ("nosotros", "nos" o "nuestro") opera el sitio web ${SITE} (el "Servicio"). Esta página le informa sobre nuestras políticas con respecto a la recopilación, el uso y la divulgación de datos personales cuando utiliza nuestro Servicio.`,
      'Utilizamos sus datos para proporcionar y mejorar el Servicio. Al utilizar el Servicio, usted acepta la recopilación y el uso de información de acuerdo con esta política.'
    ]
  },
  {
    heading: 'Definiciones',
    paragraphs: [
      'Servicio: el sitio web operado por ZVIG USA, Inc.',
      'Datos personales: datos sobre una persona viva que puede ser identificada a partir de esos datos o de otra información que obre en nuestro poder.',
      'Datos de uso: datos que se recopilan automáticamente, generados por el uso del Servicio o por la propia infraestructura del Servicio.',
      'Cookies: pequeños fragmentos de datos que se almacenan en su dispositivo.',
      'Controlador de datos: la persona física o jurídica que determina los fines y los medios del tratamiento de los datos personales.',
      'Procesadores de datos: cualquier persona física o jurídica que procesa los datos en nombre del Responsable del Tratamiento de Datos.',
      'Interesado (o Usuario): cualquier persona física viva que utilice nuestro Servicio y cuyos datos personales sean objeto de tratamiento.'
    ]
  },
  {
    heading: 'Tipos de datos recopilados',
    paragraphs: [
      'Al utilizar nuestro Servicio, es posible que le solicitemos cierta información de identificación personal que puede utilizarse para contactarle o identificarle ("Datos Personales"). Esta información puede incluir:'
    ],
    bullets: [
      'Dirección de correo electrónico',
      'Nombre y apellido',
      'Número de teléfono',
      'Dirección, Estado, Provincia, Código postal, Ciudad',
      'Cookies y datos de uso'
    ]
  },
  {
    heading: 'Datos de uso',
    paragraphs: [
      'También podemos recopilar información sobre cómo se accede al Servicio y cómo se utiliza ("Datos de uso"). Estos datos pueden incluir la dirección IP, el tipo y versión del navegador, las páginas que visita, la fecha y hora de su visita, el tiempo que pasa en esas páginas, identificadores únicos de dispositivo y otros datos de diagnóstico.'
    ]
  },
  {
    heading: 'Datos de ubicación',
    paragraphs: [
      'Podemos usar y almacenar información sobre su ubicación si nos da permiso para hacerlo. Usamos estos datos para proporcionar funciones del Servicio y para mejorarlo y personalizarlo. Puede activar o desactivar los servicios de ubicación en cualquier momento desde la configuración de su dispositivo.'
    ]
  },
  {
    heading: 'Datos de seguimiento y cookies',
    paragraphs: [
      'Utilizamos cookies y tecnologías de seguimiento similares para monitorizar la actividad en nuestro Servicio y conservar cierta información.',
      'Las cookies son archivos con una pequeña cantidad de datos que pueden incluir un identificador único anónimo. Puede configurar su navegador para rechazar todas las cookies o para avisarle cuando se envíe una, aunque esto puede impedir el uso de algunas funciones.'
    ],
    bullets: [
      'Cookies de sesión: para el funcionamiento del servicio.',
      'Cookies de preferencias: para recordar sus preferencias y configuraciones.',
      'Cookies de seguridad: con fines de seguridad.'
    ]
  },
  {
    heading: 'Uso de datos',
    paragraphs: [
      'Pantilibre utiliza los datos recopilados para proporcionar y mantener el Servicio, notificarle cambios, permitirle participar en funciones interactivas, brindar soporte al cliente, recopilar análisis para mejorar el Servicio, monitorizar su uso, detectar y prevenir problemas técnicos, y proporcionarle noticias y ofertas relevantes salvo que haya optado por no recibirlas.'
    ]
  },
  {
    heading: 'Base jurídica para el tratamiento de datos (RGPD)',
    paragraphs: [
      'Si reside en el Espacio Económico Europeo (EEE), la base legal de Pantilibre para recopilar y utilizar su información personal depende de los datos recopilados y del contexto específico. Podemos procesar sus datos porque necesitamos ejecutar un contrato con usted, porque nos ha dado permiso, porque el procesamiento responde a intereses legítimos, o para cumplir con la ley.'
    ]
  },
  {
    heading: 'Retención de datos',
    paragraphs: [
      'Pantilibre conservará sus datos personales únicamente durante el tiempo necesario para los fines establecidos en esta Política, y en la medida necesaria para cumplir con obligaciones legales, resolver disputas y hacer cumplir nuestros acuerdos y políticas.',
      'Los datos de uso se conservan generalmente por un período más corto, salvo cuando se utilizan para reforzar la seguridad o mejorar la funcionalidad del servicio, o cuando estamos legalmente obligados a conservarlos por más tiempo.'
    ]
  },
  {
    heading: 'Transferencia de datos',
    paragraphs: [
      'Su información, incluidos los datos personales, puede ser transferida y almacenada en ordenadores ubicados fuera de su jurisdicción, donde las leyes de protección de datos pueden diferir.',
      'Si reside fuera de Bulgaria y decide proporcionarnos información, tenga en cuenta que transferimos los datos a Bulgaria y los procesamos allí. Su consentimiento a esta Política representa su aceptación de dicha transferencia.',
      'Tomaremos las medidas razonablemente necesarias para garantizar que sus datos se traten de forma segura y de acuerdo con esta Política.'
    ]
  },
  {
    heading: 'Divulgación de datos',
    paragraphs: [
      'En determinadas circunstancias, Pantilibre podría verse obligada a revelar sus Datos Personales si así lo exige la ley o en respuesta a solicitudes válidas de autoridades públicas. También podremos divulgar sus datos si creemos de buena fe que es necesario para cumplir una obligación legal, proteger nuestros derechos, prevenir irregularidades, proteger la seguridad personal de los usuarios o del público, o protegernos contra la responsabilidad legal.'
    ]
  },
  {
    heading: 'Seguridad de los datos',
    paragraphs: [
      'La seguridad de sus datos es importante para nosotros, pero recuerde que ningún método de transmisión por internet ni de almacenamiento electrónico es 100% seguro. Si bien nos esforzamos por utilizar medios comercialmente aceptables para proteger sus datos personales, no podemos garantizar su seguridad absoluta.'
    ]
  },
  {
    heading: 'Señales de "No rastrear"',
    paragraphs: [
      'No admitimos la función "No rastrear" ("DNT"). Puede activar o desactivar esta función accediendo a la página de Preferencias o Configuración de su navegador.'
    ]
  },
  {
    heading: 'Sus derechos de protección de datos (RGPD)',
    paragraphs: [
      'Si reside en el Espacio Económico Europeo (EEE), tiene ciertos derechos de protección de datos. Pantilibre se compromete a tomar las medidas necesarias para que pueda corregir, modificar, eliminar o limitar el uso de sus datos personales.'
    ],
    bullets: [
      'Derecho a acceder, actualizar o eliminar la información que tenemos sobre usted.',
      'Derecho de rectificación: puede solicitar la rectificación de información inexacta o incompleta.',
      'Derecho de oposición al tratamiento de sus datos personales.',
      'Derecho de limitación del tratamiento de su información personal.',
      'Derecho a la portabilidad de datos en un formato estructurado y de uso común.',
      'Derecho a retirar el consentimiento en cualquier momento.'
    ]
  },
  {
    heading: 'Proveedores de servicios',
    paragraphs: [
      'Podemos recurrir a empresas y personas externas para facilitar el Servicio, prestarlo en nuestro nombre, realizar servicios relacionados o ayudarnos a analizar su uso. Estos terceros solo tienen acceso a sus Datos Personales para realizar estas tareas y están obligados a no divulgarlos ni utilizarlos para ningún otro fin.'
    ]
  },
  {
    heading: 'Analítica',
    paragraphs: [
      'Podemos utilizar proveedores de servicios externos como Google Analytics para supervisar y analizar el uso de nuestro Servicio. Puede optar por no compartir su actividad con Google Analytics instalando el complemento de exclusión voluntaria que ofrece Google.',
      'Para obtener más información sobre las prácticas de privacidad de Google, visite la página de Privacidad y Términos de Google.'
    ]
  },
  {
    heading: 'Enlaces a otros sitios',
    paragraphs: [
      'Nuestro servicio puede contener enlaces a otros sitios web que no son operados por nosotros. Le recomendamos encarecidamente que revise la política de privacidad de cada sitio web que visite. No tenemos control ni asumimos responsabilidad alguna por el contenido, las políticas de privacidad o las prácticas de sitios o servicios de terceros.'
    ]
  },
  {
    heading: 'Privacidad de los niños',
    paragraphs: [
      'Nuestro servicio no está dirigido a menores de 18 años ("Niños"). No recopilamos información personal identificable de menores de 18 años.',
      'Si es padre, madre o tutor legal y sabe que su hijo o hija nos ha proporcionado datos personales, póngase en contacto con nosotros. Si detectamos que hemos recopilado datos de menores sin el consentimiento de sus padres, eliminaremos dicha información de nuestros servidores.'
    ]
  },
  {
    heading: 'Cambios en esta Política de Privacidad',
    paragraphs: [
      'Es posible que actualicemos nuestra Política de Privacidad periódicamente. Le notificaremos cualquier cambio publicando la nueva Política en esta página y, cuando corresponda, mediante un aviso destacado antes de que el cambio entre en vigor.',
      'Se recomienda revisar esta Política periódicamente. Los cambios entran en vigor en el momento de su publicación en esta página.'
    ]
  },
  {
    heading: 'Contáctanos',
    paragraphs: [
      'Si tiene alguna pregunta sobre esta Política de Privacidad, póngase en contacto con nosotros por correo electrónico en support@pantilibre.com o a través de la página de Soporte de nuestro sitio web.'
    ]
  }
];

interface LegalPagesViewProps {
  page: LegalPage;
  onBack: () => void;
  onSwitchPage: (page: LegalPage) => void;
}

export const LegalPagesView: React.FC<LegalPagesViewProps> = ({ page, onBack, onSwitchPage }) => {
  const isTerms = page === 'terms';
  const sections = isTerms ? TERMS_SECTIONS : PRIVACY_SECTIONS;
  const Icon = isTerms ? Gavel : PrivacyTip;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFF8F9', color: '#2D1822' }}>
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
        <Breadcrumbs
          aria-label="migas de pan"
          sx={{ mb: 3, '& .MuiBreadcrumbs-separator': { color: '#9D7387' } }}
        >
          <Link
            component="button"
            underline="hover"
            color="inherit"
            onClick={onBack}
            sx={{ fontWeight: 600, color: '#9D7387', fontSize: 13 }}
          >
            Inicio
          </Link>
          <Typography sx={{ color: '#BE185D', fontWeight: 800, fontSize: 13 }}>
            {isTerms ? 'Términos y Condiciones' : 'Política de Privacidad'}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              bgcolor: '#FFF0F5',
              border: '1px solid #FBCFE8',
              color: '#BE185D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon />
          </Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 900, fontSize: { xs: '1.5rem', sm: '2rem' }, letterSpacing: '-0.02em' }}
          >
            {isTerms ? 'Términos y Condiciones' : 'Política de Privacidad'}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2.5,
            borderRadius: 3,
            bgcolor: '#FFFDF0',
            border: '1px solid #F5DE98',
            mb: 4,
            display: 'flex',
            gap: 1.5,
            alignItems: 'flex-start'
          }}
        >
          <Description sx={{ color: '#B45309', fontSize: 20, mt: 0.25 }} />
          <Typography variant="body2" sx={{ color: '#78350F', lineHeight: 1.6, fontSize: 13.5 }}>
            {isTerms
              ? 'Este documento describe las condiciones que rigen el uso de Pantilibre. Al acceder al Servicio aceptas cumplir con estos términos.'
              : 'Este documento describe cómo recopilamos, usamos y protegemos tus datos personales en Pantilibre.'}
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: '#FFFFFF',
            borderRadius: 4,
            border: '1px solid #FCE7F3',
            boxShadow: '0 4px 20px rgba(224, 93, 132, 0.06)',
            overflow: 'hidden'
          }}
        >
          {sections.map((section, idx) => (
            <Box key={section.heading}>
              <Box sx={{ px: { xs: 2.5, sm: 4 }, py: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 900,
                    color: idx === 0 ? '#831843' : '#2D1822',
                    mb: 1.5,
                    fontSize: idx === 0 ? '1.3rem' : '1.05rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  {section.heading}
                </Typography>
                {section.paragraphs.map((p, i) => (
                  <Typography
                    key={i}
                    variant="body2"
                    sx={{ color: '#4B3642', lineHeight: 1.75, mb: 1.2, fontSize: 14 }}
                  >
                    {p}
                  </Typography>
                ))}
                {section.bullets && (
                  <Box component="ul" sx={{ pl: 3, my: 1, display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                    {section.bullets.map((b, i) => (
                      <Typography
                        key={i}
                        component="li"
                        variant="body2"
                        sx={{ color: '#4B3642', lineHeight: 1.6, fontSize: 14 }}
                      >
                        {b}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
              {idx < sections.length - 1 && <Divider sx={{ borderColor: '#FFF0F5' }} />}
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            mt: 4,
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #FFF0F5 0%, #FCE7F3 100%)',
            border: '1px solid #FBCFE8',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PantilibreLogo size="sm" />
            <Typography variant="body2" sx={{ color: '#6B4C5D', fontSize: 13 }}>
              ¿Necesitas ayuda o tienes dudas? Escríbenos a support@pantilibre.com
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => onSwitchPage(isTerms ? 'privacy' : 'terms')}
            startIcon={isTerms ? <PrivacyTip /> : <Gavel />}
            sx={{
              borderColor: '#F472B6',
              color: '#BE185D',
              fontWeight: 800,
              borderRadius: 3,
              textTransform: 'none',
              '&:hover': { bgcolor: '#FFF5F8', borderColor: '#DB2777' }
            }}
          >
            Ver {isTerms ? 'Política de Privacidad' : 'Términos y Condiciones'}
          </Button>
        </Box>

        <Button
          onClick={onBack}
          startIcon={<ArrowBack />}
          variant="text"
          sx={{ mt: 3, color: '#9D7387', fontWeight: 700, textTransform: 'none' }}
        >
          Volver a la página anterior
        </Button>
      </Container>
    </Box>
  );
};
