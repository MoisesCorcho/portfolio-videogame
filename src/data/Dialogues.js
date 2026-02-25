/**
 * @fileoverview NPC dialogue data.
 * Maps NPC dialogue IDs to their name and list of phrases.
 * Each NPC can have multiple phrases that cycle sequentially on interaction.
 */

/**
 * @typedef {Object} DialogueEntry
 * @property {string} name - Display name of the NPC
 * @property {string[]} phrases - Array of dialogue lines
 */

/**
 * Master dialogue registry.
 * Keys are dialogue IDs that match the 'dialogueId' custom property in Tiled.
 *
 * @type {Object.<string, DialogueEntry>}
 */
export const NPC_DIALOGUES = {
  priestess_1: {
    name: 'Sacerdotisa',
    phrases: [
      'Siento una fuerte presencia de conocimiento en este santuario...',
      'Moisés ha recolectado muchos pergaminos y certificados en su viaje.',
      'Desde bases de datos completas, frameworks MVC y Laravel, hasta su certificado EF SET de Inglés C1.',
    ],
  },
  adventurer_1: {
    name: 'Estudiante Explorador',
    phrases: [
      '¡El estudio nunca termina! Siempre hay nuevas tecnologías que aprender.',
      'Su paso por la Universidad Cooperativa de Colombia forjó sus bases como Ingeniero de Sistemas.',
      'Incluso cuenta con un Diplomado en Docencia. ¡El conocimiento es para compartirse!',
    ],
  },
  gypsy_1: {
    name: 'Adivina',
    phrases: [
      'Las cartas revelan un historial de aprendizaje constante...',
      'Veo diplomas de SQL Server, PostgreSQL y PHP MVC en su brillante camino.',
      'El conocimiento certificado es un tesoro que nadie te puede robar.',
    ],
  },
  fairy_1: {
    name: 'Hada',
    phrases: [
      '✨ ¡Hola! ¡Soy un hada del bosque!',
      'Este portafolio está lleno de magia.',
      '¡Explora cada rincón para descubrir más!',
    ],
  },
  elder_1: {
    name: 'Anciano Sabio',
    phrases: [
      'Ah, joven aventurero... acércate a la zona de estudio.',
      'La verdadera sabiduría se forma tanto en entornos académicos como en la práctica pura.',
      'Moisés se graduó como Ingeniero de Sistemas a finales del 2023. ¡Cuánto tiempo ha pasado!',
    ],
  },
  villager_1: {
    name: 'Aldeano',
    phrases: [
      '¡Hola! Bienvenido al portafolio de Moisés Corcho Pérez.',
      'Es un Ingeniero de Sistemas y ávido Desarrollador Backend.',
      'Le apasiona crear soluciones con cualquier tipo de tecnologia, especialmente con PHP y Laravel.',
    ],
  },
  blacksmith_1: {
    name: 'Herrero Backend',
    phrases: [
      '¡El buen código se forja con arquitectura sólida y voluntad!',
      'Moisés ha forjado sistemas en andrestelocambia, Imagine Apps, DVLOPER, y más.',
      'Maneja a la perfección Laravel, Livewire y Tailwind CSS. ¡Verdaderas herramientas de artesano!',
    ],
  },
  adventurer_03: {
    name: 'Explorador de la Cueva',
    phrases: [
      '¡Cuidado! En estas profundidades es donde se forjan las verdaderas habilidades...',
      'Moisés ha dominado el PHP y Laravel, superando los peligros del backend.',
      'También domina reliquias de bases de datos como MySQL, PostgreSQL y SQL Server.',
    ],
  },
  adventurer_05: {
    name: 'Duende magico',
    phrases: [
      '¡Ji ji ji! ¡Bienvenido a mi rincón de las habilidades y la magia creadora!',
      '¿Buscas magia poderosa? Conozco hechizos muy avanzados en PHP, Laravel y la antigua arquitectura MVC.',
      'Para encantamientos intermedios, domino JavaScript, HTML5 y escribo pergaminos siguiendo SOLID y Clean Code.',
      'Mi morral de herramientas está lleno: uso Livewire, Filament, TailwindCSS, y guardo todos mis secretos en Git y GitHub.',
      'También almaceno incontables tesoros de conocimiento en bóvedas como MySQL, PostgreSQL y SQL Server.',
      'Puedo conjurar todos estos hechizos con gran fluidez, ya sea en mi Español nativo o en Inglés avanzado.',
    ],
  },
};
