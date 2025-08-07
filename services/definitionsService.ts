import { Definitions } from '../types';
import { DEFAULT_DEFINITIONS } from '../data/definitions';

const DEFINITIONS_STORAGE_KEY = 'aesthetic_plan_definitions';

export const definitionService = {
  loadDefinitions: (): Definitions => {
    try {
      const storedDefinitions = localStorage.getItem(DEFINITIONS_STORAGE_KEY);
      if (storedDefinitions) {
        const parsed = JSON.parse(storedDefinitions);
        // Deep merge with defaults to ensure new properties are added
        // This is a simple merge, a more robust deep merge library could be used
        return {
          ...DEFAULT_DEFINITIONS,
          ...parsed,
          practiceInfo: { ...DEFAULT_DEFINITIONS.practiceInfo, ...(parsed.practiceInfo || {}) },
          options: { ...DEFAULT_DEFINITIONS.options, ...(parsed.options || {}) },
          categories: parsed.categories || DEFAULT_DEFINITIONS.categories,
          planTemplates: parsed.planTemplates || DEFAULT_DEFINITIONS.planTemplates,
        };
      }
    } catch (error) {
      console.error('Failed to load definitions from localStorage', error);
    }
    return DEFAULT_DEFINITIONS;
  },

  saveDefinitions: (definitions: Definitions): void => {
    try {
      const definitionsString = JSON.stringify(definitions);
      localStorage.setItem(DEFINITIONS_STORAGE_KEY, definitionsString);
    } catch (error) {
      console.error('Failed to save definitions to localStorage', error);
    }
  },

  resetDefinitions: (): Definitions => {
    try {
        localStorage.removeItem(DEFINITIONS_STORAGE_KEY);
    } catch (error) {
        console.error('Failed to remove definitions from localStorage', error);
    }
    // Return a deep copy to prevent mutation
    return JSON.parse(JSON.stringify(DEFAULT_DEFINITIONS));
  }
};