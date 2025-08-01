
import { PLAN_TEMPLATES } from '../constants';
import { PlanTemplate } from '../types';

// This is a mocked service for Phase 1 to demonstrate architectural intent.
// In a real implementation, this would interact with the Gemini API.

export const geminiService = {
  /**
   * Simulates suggesting a plan template based on keywords in consultation notes.
   * @param consultNotes - The text from the patient consultation.
   * @returns A promise that resolves to a suggested PlanTemplate.
   */
  suggestTemplate: async (consultNotes: string): Promise<PlanTemplate> => {
    console.log("Analyzing consult notes for template suggestion:", consultNotes);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const lowerCaseNotes = consultNotes.toLowerCase();

    if (lowerCaseNotes.includes('rejuvenation') || lowerCaseNotes.includes('texture')) {
      console.log("Suggestion: Skin Rejuvenation Program");
      // Returning a deep copy to prevent mutation of the constant
      return JSON.parse(JSON.stringify(PLAN_TEMPLATES[1]));
    }
    
    if (lowerCaseNotes.includes('wrinkles') || lowerCaseNotes.includes('anti-aging')) {
       console.log("Suggestion: Anti-Aging Foundation Plan");
       return JSON.parse(JSON.stringify(PLAN_TEMPLATES[0]));
    }
    
    console.log("Suggestion: Blank Treatment Plan (no specific keywords found)");
    return JSON.parse(JSON.stringify(PLAN_TEMPLATES[2]));
  },
};