export const ResumeData = {
  profile: {
    name: 'Moisés Corcho Pérez',
    title: 'Ingeniero de Sistemas - Desarrollador Backend',
    location: 'Montería, Córdoba',
    summary:
      'Soy un desarrollador backend formado tanto en entornos académicos como empresariales. Mi enfoque en PHP, Laravel y bases de datos se ha fortalecido a través de proyectos reales y personales. Mi pasión por el aprendizaje y la resolución lógica de problemas se combina con habilidades de empatía y escucha activa.',
    contact: {
      email: 'mcorchoperez@gmail.com',
      phone: '(+57) 311 358 3693',
      linkedin: 'linkedin.com/in/moises-corcho-perez-ingenierodesistemas',
      portfolio: 'moisescorchodev.com',
    },
  },
  experience: [
    {
      id: 'exp_ticworks',
      role: 'PHP Developer',
      company: 'TICWorks',
      date: 'Marzo 2026 – Abril 2026',
      description:
        'Participé activamente en la modernización y el mantenimiento evolutivo de la plataforma TICWorks, colaborando en la migración técnica del motor de PHP 7.2 hacia PHP 8.2. Implementamos el uso de PHPStan para análisis estático preventivo y optimizamos el sistema de logging. Reforcé la seguridad en módulos críticos (Auth, Jobs, Payments) y mejoré la experiencia de postulación con flujos dinámicos.',
      stack: [
        'PHP 8.2',
        'Laravel',
        'MySQL',
        'PHPStan',
        'Docker',
        'Git',
        'Composer',
      ],
    },
    {
      id: 'exp_lia',
      role: 'Full Stack Developer (Laravel & React)',
      company: 'Lia',
      date: 'Febrero 2026 – Marzo 2026',
      description:
        'Lideré el desarrollo del ecosistema de monetización y la maduración de la interfaz de usuario de Lia (IA). Implementé el flujo de suscripciones con Stripe Checkout y Laravel Cashier v16. Desarrollé un Paywall con interceptores dinámicos y gestión de estado con Zustand, asegurando soporte para Dark Mode e internacionalización bajo Clean Architecture.',
      stack: [
        'PHP 8.3',
        'Laravel 11',
        'React',
        'Zustand',
        'Stripe',
        'TypeScript',
        'Tailwind',
        'TDD',
      ],
    },
    {
      id: 'exp_flusso',
      role: 'Laravel / Vue Fullstack Developer',
      company: 'Flusso',
      date: 'Febrero 2026 – Marzo 2026',
      description:
        'Ejecuté el rebranding completo de la Landing Page de Flusso, traduciendo diseños de Figma a una interfaz pixel-perfect de alta fidelidad. Implementé una experiencia 100% responsiva utilizando Tailwind CSS y Vue 3 con Inertia.js y Laravel 12, garantizando una implementación pulida y moderna del punto de entrada principal.',
      stack: ['PHP 8.3', 'Laravel 12', 'Vue 3', 'Inertia.js', 'Tailwind', 'Git'],
    },
    {
      id: 'exp_andrestelocambia',
      role: 'Laravel Backend Developer',
      company: 'andrestelocambia',
      date: 'Diciembre 2025 – Febrero 2026',
      description:
        'Realicé un rebranding completo de la Landing Page y el Panel de Usuario de la plataforma de Exchange andrestelocambia, migrando toda la interfaz de Bootstrap a Tailwind CSS. Se refactorizaron módulos críticos como el flujo de envío de dinero. Implementación de OAuth con Google y Google Reviews vía SerpApi.',
      stack: ['PHP 8.3', 'Laravel 11', 'Jquery', 'Docker', 'Git', 'Tailwind'],
    },
    {
      id: 'exp_imagine',
      role: 'Laravel / Flutter Semi Senior Developer',
      company: 'Imagine Apps',
      date: 'Octubre 2025 – Noviembre 2025',
      description:
        'Participé en la refactorización y modernización de un backend desarrollado en Laravel, migrándolo de Laravel 10 a Laravel 12. Mejoras de arquitectura, mantenimiento de código y preparación del sistema para una posterior reimplementación con FastAPI.',
      stack: ['PHP 8.3', 'Laravel 12', 'Jquery', 'Docker', 'Flutter', 'Git'],
    },
    {
      id: 'exp_dvloper',
      role: 'PHP Backend Developer',
      company: 'DVLOPER',
      date: 'Febrero 2025 – Octubre 2025',
      description:
        'Desarrollador FullStack utilizando el stack TALL. Responsable de la creación de módulos frontend con Livewire 3 y Tailwind CSS 3, así como del mantenimiento y desarrollo de nuevas funcionalidades en el backend con Laravel 11.',
      stack: [
        'PHP 8.4',
        'Laravel 11/12',
        'Livewire 3',
        'Tailwind 3',
        'Docker',
        'Git',
      ],
    },
    {
      id: 'exp_ucc',
      role: 'Analista DARC',
      company: 'Universidad Cooperativa de Colombia',
      date: 'Julio 2024 - Diciembre 2024',
      description:
        'Responsable de la gestión integral de los procesos académicos. Desarrollé una guía valorada por la dirección para ejecutar de forma óptima los procesos asociados al cargo. Desarrollé un Sistema de Gestión de Activos para el área de TI.',
      stack: [
        'Excel',
        'Oracle PeopleSoft',
        'PHP 8.4',
        'Laravel 12',
        'Livewire 3',
      ],
    },
    {
      id: 'exp_distracom',
      role: 'Analista de Desarrollo Junior',
      company: 'DISTRACOM',
      date: 'Noviembre 2023 - Febrero 2024',
      description:
        'Proporcioné soporte integral a las estaciones de combustible. Creé desde cero y modifiqué scripts SQL que optimizaron significativamente las operaciones diarias al automatizar tareas manuales.',
      stack: ['Excel', 'SQL Server'],
    },
  ],
  skills: {
    programming: {
      advanced: ['PHP'],
      intermediate: ['JavaScript', 'HTML5'],
      basic: ['Java'],
    },
    frameworksAndTools: {
      advanced: ['Laravel', 'MVC'],
      intermediate: [
        'Livewire',
        'Filament',
        'Git',
        'GitHub',
        'PHPUnit',
        'Pest',
        'TailwindCSS',
        'SOLID',
        'Clean Code',
        'jQuery',
      ],
      basic: ['Docker', 'Basecamp'],
    },
    databases: {
      intermediate: ['MySQL', 'PostgreSQL', 'SQL Server'],
    },
    languages: {
      native: ['Español'],
      advanced: ['Inglés (C1 Advanced)'],
    },
  },
  education: [
    {
      id: 'edu_ucc',
      degree: 'Ingeniero de Sistemas',
      school: 'Universidad Cooperativa de Colombia',
      date: 'Enero 2018 – Diciembre 2023',
    },
    {
      id: 'edu_poli',
      degree: 'Diplomado en Docencia y Didáctica Universitaria',
      school: 'Politécnico Superior de Colombia',
      date: 'Enero 2024 – Febrero 2024',
    },
  ],
  certs: [
    'Curso de servicios web con Laravel – Codigofacilito',
    'Curso profesional de Laravel v8 – Codigofacilito',
    'Write PHP Like a Pro: Build a PHP MVC Framework – Udemy',
    'PHP Unit Testing with PHPUnit – Udemy',
    'Curso profesional de bases de datos – Codigofacilito',
    'SQL. Curso completo de SQL – Udemy',
    'PostgreSQL. Aprende desde cero – Udemy',
    'Máster en SQL Server – Udemy',
    'Certificado de Inglés – EF SET (C1 Advanced)',
  ],
};
