import { Definitions, IconName, PlanTemplate, PracticeInfo } from '../types';
import { SyringeIcon, PackageIcon, ClockIcon, FacialIcon, VialIcon, SunIcon } from '../components/icons';
import { v4 as uuidv4 } from 'uuid';

export const DEFAULT_PRACTICE_INFO: PracticeInfo = {
  name: 'Aesthetics 360 Medical Center',
  address: '123 Wellness Boulevard, Beverly Hills, CA 90210',
  phone: '(555) 123-4567',
  email: 'info@aesthetics360.com',
  website: 'www.aesthetics360.com',
  logoUrl: 'https://ik.imagekit.io/0fheaxmfc/Main%20Logo.png?updatedAt=1754492000386',
  provider: 'Dr. Sarah Martinez, MD',
};

const commonTemplateData = {
  amRoutine: [
      'Gentle Cleanser',
      'Vitamin C Serum',
      'Moisturizer',
      'Broad-Spectrum SPF 50+'
  ],
  pmRoutine: [
      'Gentle Cleanser',
      'Retinoid (as prescribed)',
      'Hyaluronic Acid Serum',
      'Night Cream'
  ],
  skincareInstructions: 'Follow the routine consistently. Introduce Retinoid slowly, starting 2-3 times per week and increasing as tolerated. Always wear sunscreen during the day, reapplying every 2 hours when exposed to direct sun.',
  generalRecommendations: [
      { text: 'Sun Protection: Wear SPF 50+ daily, even on cloudy days.', checked: true },
      { text: 'Hydration: Drink at least 8 glasses of water per day.', checked: true },
      { text: 'Diet: Maintain a balanced diet rich in antioxidants.', checked: false },
      { text: 'Lifestyle: Avoid smoking and limit alcohol consumption.', checked: true },
  ],
  investment: {
      discountPercent: 0,
      financingOptions: [
          { months: 6, apr: 0 },
          { months: 12, apr: 7.99 },
          { months: 24, apr: 9.99 },
      ]
  },
  nextSteps: [
      'Schedule your first treatment appointment via the patient portal or by calling our office.',
      'Purchase recommended at-home skincare products from our clinic or website.',
      'Book a follow-up consultation in 3 months to assess progress.'
  ],
};

const antiAgingFoundationTemplate: PlanTemplate = {
      id: 'anti-aging-foundation',
      categoryKey: 'anti-aging',
      ...commonTemplateData,
      title: { en: 'Anti-Aging Foundation Plan', es: 'Plan Fundamental Antienvejecimiento' },
      notes: { en: 'A great starting point for clients new to aesthetic treatments, focusing on prevention and subtle enhancements.', es: 'Un excelente punto de partida para clientes nuevos en tratamientos estéticos, centrado en la prevención y mejoras sutiles.' },
      phases: [
        {
          id: 'phase-1-anti-aging',
          title: 'Initial Assessment & Foundation Treatments',
          treatments: [
            { id: 'treat-1-aa', week: 'week-1', categoryKey: 'consultations', treatmentKey: 'comprehensive-skin-analysis', goal: 'Establish baseline and goals.', frequency: 'once', price: 0, icon: 'Facial', keyInstructions: 'Arrive with a clean face, no makeup.', technology: 'visia', discount: 0 },
            { id: 'treat-2-aa', week: 'week-2', categoryKey: 'injectables', treatmentKey: 'botox', goal: 'Reduce dynamic wrinkles in forehead and crows feet.', frequency: 'once', price: 650, icon: 'Syringe', keyInstructions: 'Avoid sun exposure 48h before and after.', targetArea: ['forehead', 'crows-feet'], units: '50', discount: 0, pricePerUnit: 13 },
          ],
          controlsAndMetrics: ['Monitor skin reaction and healing', 'Document progress with photos', 'Adjust treatment intensity as needed'],
        },
        {
          id: 'phase-2-anti-aging',
          title: 'Maintenance (Quarterly)',
          treatments: [
            { id: 'treat-3-aa', week: 'ongoing', categoryKey: 'injectables', treatmentKey: 'botox', goal: 'Maintains wrinkle reduction effects.', frequency: 'every-3-4-months', price: 650, icon: 'Syringe', keyInstructions: 'Schedule follow-up appointments proactively.', targetArea: ['forehead', 'crows-feet'], units: '50', discount: 0, pricePerUnit: 13 },
          ],
          controlsAndMetrics: ['Assess effectiveness of previous treatment', 'Adjust dosage if necessary'],
        },
      ],
      investment: { ...commonTemplateData.investment, discountPercent: 0 },
};

const rejuvenationProgramTemplate: PlanTemplate = {
      id: 'rejuvenation-program',
      categoryKey: 'laser',
      ...commonTemplateData,
      title: { en: 'Laser Rejuvenation Program', es: 'Programa de Rejuvenecimiento Láser' },
      notes: { en: 'This plan is designed to significantly improve skin quality over a structured period, with a built-in maintenance plan.', es: 'Este plan está diseñado para mejorar significativamente la calidad de la piel durante un período estructurado, con un plan de mantenimiento incorporado.'},
      phases: [
        {
          id: 'phase-1-rejuv',
          title: 'Intensive Correction (3 Months)',
          treatments: [
            { id: 'treat-1-rejuv', week: 'week-1', categoryKey: 'laser-light-therapy', treatmentKey: 'bbl', goal: 'Corrects sun damage and pigmentation.', frequency: 'series-of-3-5', price: 500, icon: 'Facial', keyInstructions: 'Strictly avoid sun exposure post-treatment.', targetArea: ['full-face'], discount: 0 },
            { id: 'treat-2-rejuv', week: 'month-3', categoryKey: 'laser-light-therapy', treatmentKey: 'moxi', goal: 'Improves skin tone and texture.', frequency: 'series-of-3-4', price: 600, icon: 'Facial', keyInstructions: 'Use provided post-care kit.', targetArea: ['full-face'], discount: 0 },
          ],
          controlsAndMetrics: ['Track reduction in pigmentation', 'Monitor skin texture improvement', 'Ensure proper sun protection is used daily']
        },
      ],
      investment: { ...commonTemplateData.investment, discountPercent: 10 },
};

const injectablesFocusTemplate: PlanTemplate = {
  id: 'injectables-focus',
  categoryKey: 'injectables',
  ...commonTemplateData,
  title: { en: 'Injectables Focus Plan', es: 'Plan Enfocado en Inyectables' },
  notes: { en: 'A plan centered around neurotoxins and dermal fillers for comprehensive facial harmonization.', es: 'Un plan centrado en neurotoxinas y rellenos dérmicos para una armonización facial integral.' },
  phases: [
    {
      id: uuidv4(),
      title: 'Structural Foundation & Wrinkle Reduction',
      treatments: [
        { id: uuidv4(), week: 'week-1', categoryKey: 'injectables', treatmentKey: 'juvederm-voluma', goal: 'Restore mid-face volume and lift.', frequency: 'once', price: 1700, icon: 'Syringe', keyInstructions: 'Avoid massaging the area. Sleep on your back.', targetArea: ['cheeks'], volume: '2', discount: 0, pricePerUnit: 850 },
        { id: uuidv4(), week: 'week-2', categoryKey: 'injectables', treatmentKey: 'botox', goal: 'Smooth forehead lines and crow\'s feet.', frequency: 'every-3-4-months', price: 650, icon: 'Syringe', keyInstructions: 'No strenuous exercise for 24 hours.', targetArea: ['forehead', 'crows-feet'], units: '50', discount: 0, pricePerUnit: 13 },
      ],
      controlsAndMetrics: []
    }
  ],
};

const genericAestheticsTemplate: PlanTemplate = {
  id: 'generic-aesthetics',
  categoryKey: 'generic-aesthetics',
  ...commonTemplateData,
  title: { en: 'Generic Aesthetics Starter', es: 'Plan Básico de Estética' },
  notes: { en: 'A balanced introductory plan covering skin health, wrinkle prevention, and overall radiance.', es: 'Un plan introductorio equilibrado que cubre la salud de la piel, la prevención de arrugas y la luminosidad general.' },
  phases: [
    {
      id: uuidv4(),
      title: 'Foundation & Glow',
      treatments: [
        { id: uuidv4(), week: 'week-1', categoryKey: 'facials-peels', treatmentKey: 'hydrafacial-md', goal: 'Deeply cleanse and hydrate for an instant glow.', frequency: 'monthly', price: 250, icon: 'Facial', keyInstructions: 'Avoid exfoliants for 3 days prior.', discount: 0 },
      ],
      controlsAndMetrics: []
    }
  ],
};

const veinTreatmentTemplate: PlanTemplate = {
  id: 'vein-treatment',
  categoryKey: 'veins',
  ...commonTemplateData,
  title: { en: 'Vein Treatment Plan', es: 'Plan de Tratamiento de Venas' },
  notes: { en: 'Focuses on the treatment of spider veins and small varicose veins using sclerotherapy.', es: 'Se enfoca en el tratamiento de arañas vasculares y pequeñas venas varicosas mediante escleroterapia.' },
  phases: [
    {
      id: uuidv4(),
      title: 'Sclerotherapy Sessions',
      treatments: [
        { id: uuidv4(), week: 'week-1', categoryKey: 'vein-treatments', treatmentKey: 'sclerotherapy', goal: 'Reduce the appearance of spider veins.', frequency: 'series-of-treatments', price: 400, icon: 'Vial', keyInstructions: 'Wear compression stockings as directed.', targetArea: ['legs'], vials: '1', discount: 0, pricePerUnit: 400 },
      ],
      controlsAndMetrics: []
    }
  ],
};

const acneTreatmentTemplate: PlanTemplate = {
  id: 'acne-treatment-protocol',
  categoryKey: 'acne',
  ...commonTemplateData,
  title: { en: 'Acne Treatment Protocol', es: 'Protocolo de Tratamiento para el Acné' },
  notes: { en: 'A targeted approach for active acne and post-acne scarring, combining in-clinic treatments and home care.', es: 'Un enfoque específico para el acné activo y las cicatrices post-acné, combinando tratamientos en clínica y cuidado en casa.' },
  phases: [
    {
      id: uuidv4(),
      title: 'Initial Outbreak Control',
      treatments: [
        { id: uuidv4(), week: 'week-1', categoryKey: 'facials-peels', treatmentKey: 'hydrafacial-md', goal: 'Deep cleanse and extract impurities.', frequency: 'monthly', price: 250, icon: 'Facial', keyInstructions: 'Avoid harsh scrubs before treatment.', discount: 0, intensity: 'light' },
        { id: uuidv4(), week: 'week-2', categoryKey: 'skincare-medications', treatmentKey: 'medical-grade-vitamin-c-serum', goal: 'Start homecare to manage oil and bacteria.', frequency: 'daily', price: 120, icon: 'Package', keyInstructions: 'Apply AM and PM.', discount: 0, application: 'both', dosage: 'pea-sized' },
      ],
      controlsAndMetrics: ['Monitor inflammation reduction', 'Track new lesion formation']
    }
  ],
};

const blankTemplate: PlanTemplate = {
      id: 'blank-plan',
      ...commonTemplateData,
      title: { en: 'Blank Treatment Plan', es: 'Plan de Tratamiento en Blanco' },
      notes: { en: '', es: '' },
      phases: [
        {
          id: 'phase-1-blank',
          title: 'Phase 1',
          treatments: [],
          controlsAndMetrics: [],
        },
      ],
      investment: { ...commonTemplateData.investment, discountPercent: 0 },
};

export const DEFAULT_DEFINITIONS: Definitions = {
  practiceInfo: DEFAULT_PRACTICE_INFO,
  categories: {
    consultations: {
      displayName: { en: 'Consultations', es: 'Consultas' },
      itemLabel: { en: 'Consultation Type', es: 'Tipo de Consulta' },
      items: [
        { key: 'comprehensive-skin-analysis', name: { en: 'Comprehensive Skin Analysis', es: 'Análisis Integral de la Piel' }, fields: ['technology'], defaults: { icon: 'Facial' as IconName, goal: { en: 'Establish baseline and create treatment plan.', es: 'Establecer línea de base y crear plan de tratamiento.' }, price: 0, frequency: 'once' } },
        { key: 'follow-up-consultation', name: { en: 'Follow-up Consultation', es: 'Consulta de Seguimiento' }, fields: [], defaults: { icon: 'Clock' as IconName, goal: { en: 'Assess progress and adjust plan.', es: 'Evaluar el progreso y ajustar el plan.' }, price: 100, frequency: 'as-needed' } }
      ]
    },
    injectables: {
      displayName: { en: 'Injectables', es: 'Inyectables' },
      itemLabel: { en: 'Product', es: 'Producto' },
      items: [
        { key: 'botox', name: { en: 'Botox', es: 'Bótox' }, fields: ['targetArea', 'units'], defaults: { icon: 'Syringe' as IconName, goal: { en: 'Reduce dynamic wrinkles.', es: 'Reducir arrugas dinámicas.' }, pricePerUnit: 13, units: '50', price: 650, frequency: 'every-3-4-months', contraindications: { en: 'Known allergy to botulinum toxin products, infection at injection site, pregnancy/breastfeeding, neuromuscular disorders (e.g., ALS, Myasthenia Gravis).', es: 'Alergia conocida a productos de toxina botulínica, infección en el sitio de inyección, embarazo/lactancia, trastornos neuromusculares (p. ej., ELA, Miastenia Gravis).' }, sku: 'INJ-BTX-50U', cost: 250, imageUrl: 'https://ik.imagekit.io/0fheaxmfc/Product%20Shots/vials.png?updatedAt=1754507025888', brand: 'Allergan' } },
        { key: 'dysport', name: { en: 'Dysport', es: 'Dysport' }, fields: ['targetArea', 'units'], defaults: { icon: 'Syringe' as IconName, goal: { en: 'Reduce dynamic wrinkles.', es: 'Reducir arrugas dinámicas.' }, pricePerUnit: 12, units: '50', price: 600, frequency: 'every-3-4-months', contraindications: { en: 'Known allergy to botulinum toxin products, infection at injection site, pregnancy/breastfeeding, neuromuscular disorders (e.g., ALS, Myasthenia Gravis).', es: 'Alergia conocida a productos de toxina botulínica, infección en el sitio de inyección, embarazo/lactancia, trastornos neuromusculares (p. ej., ELA, Miastenia Gravis).' }, brand: 'Galderma' } },
        { key: 'jeuveau', name: { en: 'Jeuveau', es: 'Jeuveau' }, fields: ['targetArea', 'units'], defaults: { icon: 'Syringe' as IconName, goal: { en: 'Reduce dynamic wrinkles.', es: 'Reducir arrugas dinámicas.' }, pricePerUnit: 12, units: '50', price: 600, frequency: 'every-3-4-months', contraindications: { en: 'Known allergy to botulinum toxin products, infection at injection site, pregnancy/breastfeeding, neuromuscular disorders.', es: 'Alergia conocida a productos de toxina botulínica, infección en el sitio de inyección, embarazo/lactancia, trastornos neuromusculares.' }, brand: 'Evolus' } },
        { key: 'letybo', name: { en: 'Letybo', es: 'Letybo' }, fields: ['targetArea', 'units'], defaults: { icon: 'Syringe' as IconName, goal: { en: 'Reduce dynamic wrinkles.', es: 'Reducir arrugas dinámicas.' }, pricePerUnit: 12, units: '50', price: 600, frequency: 'every-3-4-months', contraindications: { en: 'Known allergy to botulinum toxin products, infection at injection site, pregnancy/breastfeeding, neuromuscular disorders.', es: 'Alergia conocida a productos de toxina botulínica, infección en el sitio de inyección, embarazo/lactancia, trastornos neuromusculares.' }, brand: 'Evolus' } },
        { key: 'juvederm-ultra', name: { en: 'Juvederm Ultra', es: 'Juvederm Ultra' }, fields: ['targetArea', 'volume'], defaults: { icon: 'Syringe' as IconName, goal: { en: 'Add volume to lips or folds.', es: 'Añadir volumen a labios o pliegues.' }, pricePerUnit: 750, volume: '1', price: 750, frequency: 'once', contraindications: { en: 'History of severe allergies (anaphylaxis), lidocaine allergy, bleeding disorders, active skin inflammation or infection at the site.', es: 'Historial de alergias graves (anafilaxia), alergia a la lidocaína, trastornos hemorrágicos, inflamación o infección activa de la piel en el sitio.' }, brand: 'Allergan' } },
        { key: 'juvederm-ultra-xc', name: { en: 'Juvederm Ultra XC', es: 'Juvederm Ultra XC' }, fields: ['targetArea', 'volume'], defaults: { icon: 'Syringe' as IconName, goal: { en: 'Add volume to lips or folds, contains lidocaine.', es: 'Añadir volumen a labios o pliegues, contiene lidocaína.' }, pricePerUnit: 775, volume: '1', price: 775, frequency: 'once', contraindications: { en: 'History of severe allergies (anaphylaxis), lidocaine allergy, bleeding disorders, active skin inflammation or infection at the site.', es: 'Historial de alergias graves (anafilaxia), alergia a la lidocaína, trastornos hemorrágicos, inflamación o infección activa de la piel en el sitio.' }, brand: 'Allergan' } },
        { key: 'juvederm-voluma', name: { en: 'Juvederm Voluma', es: 'Juvederm Voluma' }, fields: ['targetArea', 'volume'], defaults: { icon: 'Syringe' as IconName, goal: { en: 'Add volume to cheeks.', es: 'Añadir volumen a las mejillas.' }, pricePerUnit: 850, volume: '1', price: 850, frequency: 'once', contraindications: { en: 'History of severe allergies (anaphylaxis), lidocaine allergy, bleeding disorders, active skin inflammation or infection at the site.', es: 'Historial de alergias graves (anafilaxia), alergia a la lidocaína, trastornos hemorrágicos, inflamación o infección activa de la piel en el sitio.' }, sku: 'INJ-JV-VOL-1ML', cost: 380, imageUrl: 'https://ik.imagekit.io/0fheaxmfc/Product%20Shots/syringes.png?updatedAt=1754507025894', brand: 'Allergan' } },
        { key: 'restylane', name: { en: 'Restylane', es: 'Restylane' }, fields: ['targetArea', 'volume'], defaults: { icon: 'Syringe' as IconName, goal: { en: 'Correct wrinkles and folds.', es: 'Corregir arrugas y pliegues.' }, pricePerUnit: 700, volume: '1', price: 700, frequency: 'once', contraindications: { en: 'History of severe allergies (anaphylaxis), lidocaine allergy, bleeding disorders, active skin inflammation or infection at the site.', es: 'Historial de alergias graves (anafilaxia), alergia a la lidocaína, trastornos hemorrágicos, inflamación o infección activa de la piel en el sitio.' }, brand: 'Galderma' } },
        { key: 'kybella', name: { en: 'Kybella', es: 'Kybella' }, fields: ['targetArea', 'vials'], defaults: { icon: 'Vial' as IconName, goal: { en: 'Reduce submental fat.', es: 'Reducir la grasa submentoniana.' }, pricePerUnit: 600, vials: '2', price: 1200, frequency: 'series-of-treatments', contraindications: { en: 'Infection in the treatment area, trouble swallowing, bleeding problems. Use caution if you have had prior cosmetic treatments on the neck/chin.', es: 'Infección en el área de tratamiento, dificultad para tragar, problemas de sangrado. Tenga precaución si ha tenido tratamientos cosméticos previos en el cuello/barbilla.' }, brand: 'Allergan' } },
        { key: 'sculptra', name: { en: 'Sculptra', es: 'Sculptra' }, fields: ['targetArea', 'vials'], defaults: { icon: 'Syringe' as IconName, goal: { en: 'Stimulate collagen production for volume.', es: 'Estimular la producción de colágeno para dar volumen.' }, pricePerUnit: 900, vials: '1', price: 900, frequency: 'series-of-treatments', contraindications: { en: 'History of keloid formation or hypertrophic scarring. Autoimmune diseases.', es: 'Historial de formación de queloides o cicatrices hipertróficas. Enfermedades autoinmunes.' }, brand: 'Galderma' } },
      ]
    },
    'facials-peels': {
        displayName: { en: 'Facials & Peels', es: 'Faciales y Peelings' },
        itemLabel: { en: 'Service', es: 'Servicio' },
        items: [
          { key: 'hydrafacial-md', name: { en: 'HydraFacial MD', es: 'HydraFacial MD' }, fields: ['intensity'], defaults: { icon: 'Facial' as IconName, goal: { en: 'Deeply cleanse, extract, and hydrate.', es: 'Limpiar, extraer e hidratar profundamente.' }, price: 250, frequency: 'monthly' } },
          { key: 'microneedling', name: { en: 'Microneedling', es: 'Microneedling' }, fields: ['targetArea'], defaults: { icon: 'Syringe' as IconName, goal: { en: 'Stimulate collagen for texture improvement.', es: 'Estimular colágeno para mejorar textura.' }, price: 450, frequency: 'series-of-3-5' } },
        ]
    },
    'laser-light-therapy': {
        displayName: { en: 'Laser & Light Therapy', es: 'Terapia Láser y de Luz' },
        itemLabel: { en: 'Treatment', es: 'Tratamiento' },
        items: [
            { key: 'bbl', name: { en: 'BBL (BroadBand Light)', es: 'BBL (Luz de Banda Ancha)' }, fields: ['targetArea'], defaults: { icon: 'Sun' as IconName, goal: { en: 'Correct sun damage and pigmentation.', es: 'Corregir daño solar y pigmentación.' }, price: 500, frequency: 'series-of-3-5' } },
            { key: 'moxi', name: { en: 'Moxi Laser', es: 'Láser Moxi' }, fields: ['targetArea', 'intensity'], defaults: { icon: 'Sun' as IconName, goal: { en: 'Improve skin tone and texture.', es: 'Mejorar tono y textura de la piel.' }, price: 600, frequency: 'series-of-3-4' } }
        ]
    },
    'skincare-medications': {
        displayName: { en: 'Skincare & Medications', es: 'Cuidado de la Piel y Medicamentos' },
        itemLabel: { en: 'Product', es: 'Producto' },
        items: [
            { key: 'medical-grade-vitamin-c-serum', name: { en: 'Medical-Grade Vitamin C Serum', es: 'Sérum de Vitamina C de Grado Médico' }, fields: ['application', 'dosage'], defaults: { icon: 'Package' as IconName, goal: { en: 'Antioxidant protection and skin brightening.', es: 'Protección antioxidante e iluminación de la piel.' }, price: 120, frequency: 'daily' } }
        ]
    },
    'vein-treatments': {
        displayName: { en: 'Vein Treatments', es: 'Tratamientos de Venas' },
        itemLabel: { en: 'Treatment', es: 'Tratamiento' },
        items: [
            { key: 'sclerotherapy', name: { en: 'Sclerotherapy', es: 'Escleroterapia' }, fields: ['targetArea', 'vials'], defaults: { icon: 'Vial' as IconName, goal: { en: 'Reduce spider veins.', es: 'Reducir arañas vasculares.' }, pricePerUnit: 400, price: 400, frequency: 'series-of-treatments' } }
        ]
    }
  },
  options: {
    technologies: [
      { key: 'visia', name: { en: 'Visia Skin Analysis', es: 'Análisis de Piel Visia' } },
      { key: 'vectra', name: { en: 'Vectra 3D Imaging', es: 'Imágenes 3D Vectra' } }
    ],
    timelines: [
      { key: 'tbd', name: { en: 'To Be Determined', es: 'A determinar' } },
      { key: 'week-1', name: { en: 'Week 1', es: 'Semana 1' } },
      { key: 'week-2', name: { en: 'Week 2', es: 'Semana 2' } },
      { key: 'month-3', name: { en: 'Month 3', es: 'Mes 3' } },
      { key: 'ongoing', name: { en: 'Ongoing', es: 'Continuo' } }
    ],
    frequencies: [
      { key: 'once', name: { en: 'One Time', es: 'Una Vez' } },
      { key: 'daily', name: { en: 'Daily', es: 'Diario' } },
      { key: 'monthly', name: { en: 'Monthly', es: 'Mensual' } },
      { key: 'every-3-4-months', name: { en: 'Every 3-4 Months', es: 'Cada 3-4 Meses' } },
      { key: 'series-of-treatments', name: { en: 'Series of Treatments', es: 'Serie de Tratamientos' } },
      { key: 'series-of-3-4', name: { en: 'Series of 3-4', es: 'Serie de 3-4' } },
      { key: 'series-of-3-5', name: { en: 'Series of 3-5', es: 'Serie de 3-5' } },
      { key: 'as-needed', name: { en: 'As Needed', es: 'Según sea necesario' } }
    ],
    targetAreas: [
      { key: 'forehead', name: { en: 'Forehead', es: 'Frente' } },
      { key: 'crows-feet', name: { en: 'Crow\'s Feet', es: 'Patas de Gallo' } },
      { key: 'lips', name: { en: 'Lips', es: 'Labios' } },
      { key: 'cheeks', name: { en: 'Cheeks', es: 'Mejillas' } },
      { key: 'submental', name: { en: 'Submental (Chin)', es: 'Submentoniana (Barbilla)' } },
      { key: 'full-face', name: { en: 'Full Face', es: 'Rostro Completo' } },
      { key: 'neck', name: { en: 'Neck', es: 'Cuello' } },
      { key: 'legs', name: { en: 'Legs', es: 'Piernas' } },
    ],
    intensities: [
      { key: 'light', name: { en: 'Light', es: 'Ligero' } },
      { key: 'medium', name: { en: 'Medium', es: 'Medio' } },
      { key: 'strong', name: { en: 'Strong', es: 'Fuerte' } }
    ],
    applications: [
      { key: 'am', name: { en: 'AM', es: 'AM' } },
      { key: 'pm', name: { en: 'PM', es: 'PM' } },
      { key: 'both', name: { en: 'AM & PM', es: 'AM y PM' } }
    ],
    templateCategories: [
        { key: 'anti-aging', name: { en: 'Anti-Aging', es: 'Antienvejecimiento' } },
        { key: 'laser', name: { en: 'Laser & Rejuvenation', es: 'Láser y Rejuvenecimiento' } },
        { key: 'injectables', name: { en: 'Injectables', es: 'Inyectables' } },
        { key: 'acne', name: { en: 'Acne', es: 'Acné' } },
        { key: 'veins', name: { en: 'Veins', es: 'Venas' } },
        { key: 'generic-aesthetics', name: { en: 'General Aesthetics', es: 'Estética General' } }
    ],
    phaseTitles: [
        { key: 'phase-1', name: { en: 'Phase 1: Foundation & Correction', es: 'Fase 1: Fundación y Corrección' } },
        { key: 'phase-2', name: { en: 'Phase 2: Enhancement & Refinement', es: 'Fase 2: Mejora y Refinamiento' } },
        { key: 'phase-3', name: { en: 'Phase 3: Maintenance & Prevention', es: 'Fase 3: Mantenimiento y Prevención' } }
    ]
  },
  planTemplates: [
    antiAgingFoundationTemplate,
    rejuvenationProgramTemplate,
    injectablesFocusTemplate,
    genericAestheticsTemplate,
    veinTreatmentTemplate,
    acneTreatmentTemplate,
    blankTemplate,
  ],
  treatmentIcons: {
    Syringe: { icon: SyringeIcon },
    Package: { icon: PackageIcon },
    Clock: { icon: ClockIcon },
    Facial: { icon: FacialIcon },
    Vial: { icon: VialIcon },
    Sun: { icon: SunIcon },
  }
};