import React from 'react';

export type Language = 'en' | 'es';

export type IconName = 'Syringe' | 'Package' | 'Clock' | 'Facial' | 'Vial' | 'Sun';

export type DynamicFieldName = 'targetArea' | 'units' | 'volume' | 'vials' | 'dosage' | 'application' | 'intensity' | 'technology';

export type Translatable = {
  [key in Language]: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  practiceName: string;
}

export interface PracticeInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
  provider: string;
}

export interface Treatment {
  id: string;
  week: string;
  categoryKey: string;
  treatmentKey: string;
  goal: string;
  frequency: string;
  price: number;
  pricePerUnit?: number;
  icon: IconName;
  keyInstructions: string;
  discount?: number;
  contraindications?: string;
  // Category-specific optional fields
  targetArea?: string[]; // These will be keys now
  units?: string;
  dosage?: string;
  application?: string; // This will be a key
  intensity?: string; // This will be a key
  volume?: string;
  vials?: string;
  technology?: string; // This will be a key
}

export interface Phase {
  id: string;
  title: string;
  treatments: Treatment[];
  controlsAndMetrics: string[];
}

export interface Plan {
  id:string;
  title: string; // This will become an i18n key
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
    logoUrl?: string;
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
  notes: string; // This will become an i18n key
}


export interface PlanTemplate {
  id: string;
  title: Translatable;
  notes: Translatable;
  categoryKey?: string;
  phases: Phase[];
  amRoutine: Plan['amRoutine'];
  pmRoutine: Plan['pmRoutine'];
  skincareInstructions: Plan['skincareInstructions'];
  generalRecommendations: Plan['generalRecommendations'];
  investment: Plan['investment'];
  nextSteps: Plan['nextSteps'];
}


// Types for the new definitions structure
export interface TreatmentDefinitionItem {
  key: string;
  name: Translatable;
  fields: DynamicFieldName[];
  defaults: Omit<Partial<Treatment>, 'id' | 'categoryKey' | 'treatmentKey' | 'goal' | 'contraindications'> & { 
    goal: Translatable;
    contraindications?: Translatable;
    sku?: string;
    cost?: number;
    imageUrl?: string;
    brand?: string;
  };
}

export interface CategoryDefinition {
  displayName: Translatable;
  itemLabel: Translatable;
  items: TreatmentDefinitionItem[];
}

export interface OptionDefinition {
  key: string;
  name: Translatable;
}

export interface Definitions {
  practiceInfo: PracticeInfo;
  categories: {
    [key: string]: CategoryDefinition;
  };
  options: {
    technologies: OptionDefinition[];
    timelines: OptionDefinition[];
    frequencies: OptionDefinition[];
    targetAreas: OptionDefinition[];
    intensities: OptionDefinition[];
    applications: OptionDefinition[];
    templateCategories: OptionDefinition[];
    phaseTitles: OptionDefinition[];
  };
  planTemplates: PlanTemplate[];
  treatmentIcons: { [key in IconName]: { icon: React.ElementType } };
}

// Represents the structure of definitions that can be safely serialized to JSON
export type StoredDefinitions = Omit<Definitions, 'treatmentIcons'>;
