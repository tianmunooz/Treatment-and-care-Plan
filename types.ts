

export type IconName = 'Syringe' | 'Package' | 'Clock' | 'Facial' | 'Vial';

export interface Treatment {
  id: string;
  week: string;
  name: string;
  goal: string;
  frequency: string;
  price: number;
  icon: IconName;
  keyInstructions: string;
}

export interface Phase {
  id: string;
  title: string;
  treatments: Treatment[];
  controlsAndMetrics: string[];
}

export interface Plan {
  id: string;
  title: string;
  patient: {
    name: string;
    age: number;
    sex: string;
  };
  provider: string;
  date: string;
  practice: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  contraindications: {
    medications: string;
    allergies: string;
    medicalHistory: string;
    previousTreatments: string;
  };
  providerVerified: boolean;
  phases: Phase[];
  amRoutine: string[];
  pmRoutine: string[];
  skincareInstructions: string;
  generalRecommendations: { text: string; checked: boolean }[];
  investment: {
    discountPercent: number;
    financingOptions: {
      months: number;
      apr: number;
    }[];
  };
  nextSteps: string[];
  notes: string;
}


export type PlanTemplate = Omit<Plan, 'id' | 'patient' | 'date' | 'providerVerified' | 'contraindications'>;