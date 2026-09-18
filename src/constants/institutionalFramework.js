/** Declaración institucional y pilares orientadores de CHEEMS (ES / EN). */

export const INSTITUTIONAL_DECLARATION = {
  es: 'Soy LIBRE, AUTÓNOMO Y RESPONSABLE a través del diálogo y la construcción, como ideal regulativo; me dirijo, controlo y dicto mis propias leyes.',
  en: 'I am FREE, AUTONOMOUS AND RESPONSIBLE through dialogue and construction, as a regulatory ideal; I guide myself, control myself and dictate my own laws.',
};

export const INSTITUTIONAL_PILLARS = {
  es: [
    'Desarrollo humano',
    'Ética',
    'Autonomía',
    'Transformación positiva',
    'Bienestar',
    'Evolución personal',
    'Responsabilidad social',
  ],
  en: [
    'Human development',
    'Ethics',
    'Autonomy',
    'Positive transformation',
    'Well-being',
    'Personal growth',
    'Social responsibility',
  ],
};

export const INSTITUTIONAL_UI = {
  es: {
    philosophyTitle: 'Filosofía orientadora del proyecto',
    philosophyIntro:
      'CHEEMS integra esta declaración como marco ético y humano del servicio digital de transporte público.',
    pillarsTitle: 'Valores institucionales',
    welcomeLabel: 'Mensaje institucional',
    welcomeBody:
      'Bienvenido. Soy el asistente de CHEEMS Transport. Además de ayudarte con rutas, tarifas, buses y conductores, me guío por el principio de que cada persona es libre, autónoma y responsable en el diálogo y la construcción colectiva. ¿En qué puedo orientarte hoy?',
    reflectiveTitle: 'Módulo reflexivo',
    reflectiveHint: 'Explora un tema institucional con una breve reflexión guiada:',
    reflectivePrompts: [
      { id: 'autonomy', label: 'Autonomía y responsabilidad', prompt: '¿Cómo se relacionan la autonomía y la responsabilidad social en el uso del transporte público?' },
      { id: 'ethics', label: 'Ética en el servicio', prompt: '¿Qué papel tiene la ética cuando consulto rutas, tarifas o presento una PQRS?' },
      { id: 'wellbeing', label: 'Bienestar y desarrollo humano', prompt: '¿Cómo contribuye el transporte público al bienestar y al desarrollo humano de la comunidad?' },
      { id: 'transformation', label: 'Transformación positiva', prompt: '¿De qué manera una app de información de buses puede impulsar una transformación positiva en la ciudad?' },
    ],
    showPhilosophy: 'Ver declaración y valores',
    hidePhilosophy: 'Ocultar declaración',
    reflectiveSend: 'Reflexionar',
  },
  en: {
    philosophyTitle: 'Project guiding philosophy',
    philosophyIntro:
      'CHEEMS embeds this statement as the ethical and human framework of its public transit digital service.',
    pillarsTitle: 'Institutional values',
    welcomeLabel: 'Institutional message',
    welcomeBody:
      'Welcome. I am the CHEEMS Transport assistant. Besides helping with routes, fares, buses, and drivers, I am guided by the principle that every person is free, autonomous, and responsible through dialogue and collective construction. How can I help you today?',
    reflectiveTitle: 'Reflective module',
    reflectiveHint: 'Explore an institutional theme with a short guided reflection:',
    reflectivePrompts: [
      { id: 'autonomy', label: 'Autonomy and responsibility', prompt: 'How are autonomy and social responsibility connected when using public transit?' },
      { id: 'ethics', label: 'Ethics in service', prompt: 'What role does ethics play when I check routes, fares, or submit a PQRS?' },
      { id: 'wellbeing', label: 'Well-being and human development', prompt: 'How does public transit contribute to community well-being and human development?' },
      { id: 'transformation', label: 'Positive transformation', prompt: 'How can a bus information app foster positive transformation in the city?' },
    ],
    showPhilosophy: 'View statement and values',
    hidePhilosophy: 'Hide statement',
    reflectiveSend: 'Reflect',
  },
};
