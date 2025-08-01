

import { PlanTemplate, IconName } from './types';
import { SyringeIcon, PackageIcon, ClockIcon, FacialIcon, VialIcon } from './components/icons';

const commonData = {
  practice: {
    name: 'Aesthetics 360 Medical Center',
    address: '123 Wellness Boulevard, Beverly Hills, CA 90210',
    phone: '(555) 123-4567',
    email: 'info@aesthetics360.com',
    website: 'www.aesthetics360.com',
  },
  provider: 'Dr. Sarah Martinez, MD',
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

export const PLAN_TEMPLATES: PlanTemplate[] = [
  {
    ...commonData,
    title: 'Anti-Aging Foundation Plan',
    phases: [
      {
        id: 'phase-1',
        title: 'Initial Assessment & Foundation Treatments',
        treatments: [
          { id: 'treat-1', week: 'Week 1', name: 'Comprehensive Skin Analysis', goal: 'Improve skin texture', frequency: 'Once', price: 0, icon: 'Facial', keyInstructions: 'Arrive with a clean face, no makeup.' },
          { id: 'treat-2', week: 'Week 2', name: 'Botox Treatment', goal: 'Improve skin texture', frequency: 'Once', price: 650, icon: 'Syringe', keyInstructions: 'Avoid sun exposure 48h before and after.' },
        ],
        controlsAndMetrics: [
          'Monitor skin reaction and healing',
          'Document progress with photos',
          'Adjust treatment intensity as needed'
        ],
      },
      {
        id: 'phase-2',
        title: 'Maintenance (Quarterly)',
        treatments: [
          { id: 'treat-3', week: 'Ongoing', name: 'Botox/Dysport Touch-up', goal: 'Maintains wrinkle reduction effects.', frequency: 'Every 3-4 months', price: 650, icon: 'Syringe', keyInstructions: 'Schedule follow-up appointments proactively.' },
        ],
        controlsAndMetrics: [
          'Assess effectiveness of previous treatment',
          'Adjust dosage if necessary',
        ],
      },
    ],
    investment: { ...commonData.investment, discountPercent: 0 },
    notes: 'A great starting point for clients new to aesthetic treatments, focusing on prevention and subtle enhancements.'
  },
  {
    ...commonData,
    title: 'Skin Rejuvenation Program',
    phases: [
      {
        id: 'phase-1',
        title: 'Intensive Correction (3 Months)',
        treatments: [
          { id: 'treat-1', week: 'Week 1', name: 'Microneedling Session 1', goal: 'Stimulates collagen to improve texture and fine lines.', frequency: 'Week 1', price: 400, icon: 'Syringe', keyInstructions: 'Avoid retinol for 5 days prior.' },
          { id: 'treat-2', week: 'Week 5', name: 'Microneedling Session 2', goal: 'Continues collagen induction for enhanced results.', frequency: 'Week 5', price: 400, icon: 'Syringe', keyInstructions: 'Stay well-hydrated before the session.' },
          { id: 'treat-3', week: 'Week 9', name: 'Microneedling Session 3', goal: 'Final session for optimal skin rejuvenation.', frequency: 'Week 9', price: 400, icon: 'Syringe', keyInstructions: 'Use provided post-care kit.' },
        ],
        controlsAndMetrics: [
          'Track reduction in fine lines and scarring',
          'Monitor for any adverse reactions',
          'Ensure proper post-care is followed'
        ]
      },
       {
        id: 'phase-2',
        title: 'Maintenance & Enhancement',
        treatments: [
          { id: 'treat-4', week: 'Ongoing', name: 'Maintenance Microneedling', goal: 'One session every 6 months to maintain results.', frequency: 'Every 6 months', price: 400, icon: 'Syringe', keyInstructions: 'Book in advance.' },
          { id: 'treat-5', week: 'Ongoing', name: 'At-home Skincare Regimen', goal: 'Medical-grade products to support and extend results.', frequency: 'Ongoing', price: 300, icon: 'Package', keyInstructions: 'Follow AM/PM routine strictly.' },
        ],
        controlsAndMetrics: [
            'Evaluate long-term skin health',
            'Adjust at-home care products as seasons change',
        ]
      },
    ],
    investment: { ...commonData.investment, discountPercent: 10 },
    notes: 'This plan is designed to significantly improve skin quality over a structured period, with a built-in maintenance plan.'
  },
  {
    ...commonData,
    title: 'Blank Treatment Plan',
    phases: [
      {
        id: 'phase-1',
        title: 'Phase 1',
        treatments: [],
        controlsAndMetrics: [],
      },
    ],
    investment: { ...commonData.investment, discountPercent: 0 },
    notes: ''
  }
];

export const TREATMENT_ICONS: { [key in IconName]: { label: string; icon: React.ElementType } } = {
  Syringe: { label: 'Syringe (Injectables)', icon: SyringeIcon },
  Package: { label: 'Skincare Package', icon: PackageIcon },
  Clock: { label: 'Maintenance', icon: ClockIcon },
  Facial: { label: 'Facial', icon: FacialIcon },
  Vial: { label: 'Chemical Peel', icon: VialIcon },
};