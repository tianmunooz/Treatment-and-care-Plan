
export const translations = {
  en: {
    // Header
    back: 'Back',
    save: 'Save',
    pdf: 'PDF',
    patientView: 'Patient View',
    finalize: 'Finalize',
    patientPlan: 'Treatment Plan',
    admin: 'Admin & Settings',
    startTutorial: 'Start Tutorial',
    langEnglish: 'English',
    langSpanish: 'Español',


    // Template Selector
    aiSuggestionTitle: 'Get an AI-Powered Suggestion',
    aiSuggestionSubtitle: "Describe the patient's goals and let our AI create a starting plan for you.",
    orStartFromTemplate: 'Or, Start from a Template',
    analyzing: 'Analyzing...',

    // Template Card
    aiSuggestion: 'AI Suggestion',
    selectTemplate: 'Select Template',

    // AI Suggestions
    aiSuggestionsTitle: 'AI Suggestions',
    aiSuggestionsSubtitle: 'Tap to add recommended treatments or optimize your plan.',
    
    // Tutorial
    tutorialAiTitle: 'AI-Powered Suggestions',
    tutorialAiText: 'Simply describe your patient\'s needs in plain language. Our AI will analyze the notes and generate a complete, multi-phase treatment plan recommendation for you.',
    tutorialTemplatesTitle: 'Start from a Template',
    tutorialTemplatesText: 'You can also begin with one of our expertly-crafted templates. Choose a category or start with a blank plan to build from scratch.',
    tutorialAdminTitle: 'Admin & Settings',
    tutorialAdminText: 'In this section, you can fully customize the application. Add your own treatments, modify templates, and set your practice information.',
    tutorialNext: 'Next',
    tutorialBack: 'Back',
    tutorialFinish: 'Finish',
    // Admin Tutorial
    tutorialAdminNavGeneralTitle: 'General Settings',
    tutorialAdminNavGeneralText: 'Manage your practice information like name, logo, and contact details. This appears on all generated PDF plans.',
    tutorialAdminNavTemplatesTitle: 'Plan Templates',
    tutorialAdminNavTemplatesText: 'Create and edit pre-built plans to streamline your workflow. You can modify phases and treatments for each template.',
    tutorialAdminNavServicesTitle: 'Products & Services',
    tutorialAdminNavServicesText: 'Define every product or service you offer, grouped into categories. Set default prices, goals, and fields for each one.',
    tutorialAdminNavOptionsTitle: 'Dropdown Options',
    tutorialAdminNavOptionsText: 'Customize the values available in various dropdown menus across the app, such as target areas or frequencies.',
    tutorialAdminSaveTitle: 'Save Your Changes',
    tutorialAdminSaveText: 'After making edits, click here to save all your changes to the application\'s configuration.',
    tutorialAdminLangTitle: 'Language Editing',
    tutorialAdminLangText: 'Switch between English and Spanish to add or edit translations for all your custom items, ensuring a bilingual experience.',
    nextPhase: 'Next Phase',
  },
  es: {
    // Header
    back: 'Atrás',
    save: 'Guardar',
    pdf: 'PDF',
    patientView: 'Vista del Paciente',
    finalize: 'Finalizar',
    patientPlan: 'Plan de Tratamiento',
    admin: 'Administración y Ajustes',
    startTutorial: 'Iniciar Tutorial',
    langEnglish: 'Inglés',
    langSpanish: 'Español',

    // Template Selector
    aiSuggestionTitle: 'Obtenga una sugerencia de IA',
    aiSuggestionSubtitle: 'Describa los objetivos del paciente y deje que nuestra IA cree un plan inicial para usted.',
    orStartFromTemplate: 'O, comience desde una plantilla',
    analyzing: 'Analizando...',

    // Template Card
    aiSuggestion: 'Sugerencia de IA',
    selectTemplate: 'Seleccionar plantilla',
    
    // AI Suggestions
    aiSuggestionsTitle: 'Sugerencias de IA',
    aiSuggestionsSubtitle: 'Toque para agregar tratamientos recomendados u optimizar su plan.',
    
    // Tutorial
    tutorialAiTitle: 'Sugerencias de IA',
    tutorialAiText: 'Simplemente describa las necesidades de su paciente en un lenguaje sencillo. Nuestra IA analizará las notas y generará una recomendación de plan de tratamiento completa y multifásica para usted.',
    tutorialTemplatesTitle: 'Comenzar desde una Plantilla',
    tutorialTemplatesText: 'También puede comenzar con una de nuestras plantillas elaboradas por expertos. Elija una categoría o comience con un plan en blanco para construir desde cero.',
    tutorialAdminTitle: 'Administración y Ajustes',
    tutorialAdminText: 'En esta sección, puede personalizar completamente la aplicación. Agregue sus propios tratamientos, modifique plantillas y configure la información de su práctica.',
    tutorialNext: 'Siguiente',
    tutorialBack: 'Atrás',
    tutorialFinish: 'Finalizar',
    // Admin Tutorial
    tutorialAdminNavGeneralTitle: 'Ajustes Generales',
    tutorialAdminNavGeneralText: 'Administre la información de su práctica, como el nombre, el logotipo y los datos de contacto. Esto aparece en todos los planes PDF generados.',
    tutorialAdminNavTemplatesTitle: 'Plantillas de Planes',
    tutorialAdminNavTemplatesText: 'Cree y edite planes predefinidos para agilizar su flujo de trabajo. Puede modificar las fases y los tratamientos de cada plantilla.',
    tutorialAdminNavServicesTitle: 'Productos y Servicios',
    tutorialAdminNavServicesText: 'Defina cada producto o servicio que ofrece, agrupado en categorías. Establezca precios, objetivos y campos predeterminados para cada uno.',
    tutorialAdminNavOptionsTitle: 'Opciones de Menús',
    tutorialAdminNavOptionsText: 'Personalice los valores disponibles en varios menús desplegables de la aplicación, como las áreas de tratamiento o las frecuencias.',
    tutorialAdminSaveTitle: 'Guarde sus Cambios',
    tutorialAdminSaveText: 'Después de realizar ediciones, haga clic aquí para guardar todos sus cambios en la configuración de la aplicación.',
    tutorialAdminLangTitle: 'Edición de Idiomas',
    tutorialAdminLangText: 'Cambie entre inglés y español para agregar o editar traducciones para todos sus elementos personalizados, garantizando una experiencia bilingüe.',
    nextPhase: 'Siguiente Fase',
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

export const getTranslator = (lang: Language) => (key: TranslationKey): string => {
  return translations[lang]?.[key] || translations.en[key];
};