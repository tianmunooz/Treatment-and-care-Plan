

import { GoogleGenAI, Type } from "@google/genai";
import { PlanTemplate, Definitions, Phase, Treatment } from '../types';
import { v4 as uuidv4 } from 'uuid';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Generates a structured treatment plan and extracts patient data from consultation notes using Gemini.
 * @param consultNotes - The text from the patient consultation.
 * @param definitions - The complete set of available treatments and options.
 * @returns A promise that resolves to an object containing the generated PlanTemplate and extracted patient data.
 */
const generatePlanFromNotes = async (consultNotes: string, definitions: Definitions): Promise<{ template: PlanTemplate, patientData: { name: string, age: number, sex: string } | null }> => {
    // 1. Define the exact JSON structure we want the AI to return.
    const schema = {
        type: Type.OBJECT,
        properties: {
            patientName: { type: Type.STRING, description: 'The full name of the patient mentioned in the notes.' },
            patientAge: { type: Type.INTEGER, description: 'The age of the patient as a number, extracted from the notes.' },
            patientSex: { type: Type.STRING, description: 'The sex of the patient (e.g., "Female", "Male", "Other").' },
            phases: {
                type: Type.ARRAY,
                description: 'The array of treatment phases.',
                items: {
                    type: Type.OBJECT,
                    description: 'A single phase of the treatment plan.',
                    properties: {
                        title: { type: Type.STRING, description: 'A descriptive title for the phase (e.g., "Phase 1: Correction", "Maintenance").' },
                        treatments: {
                            type: Type.ARRAY,
                            description: 'The list of treatments within this phase.',
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    categoryKey: { type: Type.STRING, description: 'The key for the treatment category.' },
                                    treatmentKey: { type: Type.STRING, description: 'The key for the specific treatment within the category.' },
                                    goal: { type: Type.STRING, description: 'The primary goal for this specific treatment.' },
                                    week: { type: Type.STRING, description: 'The suggested week/timeline key for this treatment.' },
                                    frequency: { type: Type.STRING, description: 'The suggested frequency key for this treatment.' },
                                    targetArea: {
                                        type: Type.ARRAY,
                                        description: 'Array of target area keys, if applicable.',
                                        items: { type: Type.STRING }
                                    },
                                    keyInstructions: { type: Type.STRING, description: 'A single, brief key instruction for the patient.' }
                                },
                                required: ['categoryKey', 'treatmentKey', 'goal', 'week', 'frequency']
                            }
                        }
                    },
                    required: ['title', 'treatments']
                }
            }
        },
        required: ['phases', 'patientName', 'patientAge', 'patientSex']
    };

    // 2. Give the AI context by providing simplified lists of available treatments and options.
    const availableTreatments = Object.entries(definitions.categories).map(([catKey, catDef]) => ({
        categoryKey: catKey,
        categoryName: catDef.displayName.en,
        items: catDef.items.map(item => ({
            treatmentKey: item.key,
            treatmentName: item.name.en,
        }))
    }));

    const availableOptions = {
        timelines: definitions.options.timelines.map(o => ({ key: o.key, name: o.name.en })),
        frequencies: definitions.options.frequencies.map(o => ({ key: o.key, name: o.name.en })),
        targetAreas: definitions.options.targetAreas.map(o => ({ key: o.key, name: o.name.en })),
    };

    // 3. Construct the prompt for the AI.
    const systemInstruction = "You are an expert aesthetic medicine consultant. Your task is to analyze patient consultation notes to extract the patient's full name, age, and sex, and create a structured, multi-phase treatment plan. You must use ONLY the treatments and options provided to you in the JSON data, referencing them by their 'key' values. Structure your response according to the provided JSON schema.";
    
    const prompt = `
      Patient Consultation Notes:
      "${consultNotes}"

      --------------------

      Here are the available treatments and options you MUST use. Respond with the 'key' values provided in this data.

      Available Treatments Data:
      ${JSON.stringify(availableTreatments, null, 2)}

      Available Options Data:
      ${JSON.stringify(availableOptions, null, 2)}

      --------------------

      Based on the consultation notes, generate a complete treatment plan. The plan should be structured into logical phases. For each treatment, specify its categoryKey, treatmentKey, a concise goal, a suggested week, a frequency, target areas (if applicable), and brief key instructions.
      Also, you MUST extract the patient's full name, age (as a number), and sex.
    `;

    // 4. Call the Gemini API.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });

    const aiResponse = JSON.parse(response.text);
    const generatedPhases: any[] = aiResponse.phases || [];

    const patientData = {
        name: aiResponse.patientName || 'New Patient',
        age: aiResponse.patientAge || 0,
        sex: aiResponse.patientSex || 'Not specified'
    };

    // 5. Process the AI's response, adding full details from our definitions.
    const newPhases: Phase[] = generatedPhases.map((aiPhase: any) => {
        const newTreatments: Treatment[] = (aiPhase.treatments || []).map((aiTreatment: any) => {
            const treatmentDef = definitions.categories[aiTreatment.categoryKey]?.items.find(i => i.key === aiTreatment.treatmentKey);
            if (!treatmentDef) {
                console.warn(`AI suggested an unknown treatment, skipping: ${aiTreatment.categoryKey}/${aiTreatment.treatmentKey}`);
                return null; // Skip if the AI hallucinates a treatment not in our definitions.
            }

            return {
                ...JSON.parse(JSON.stringify(treatmentDef.defaults)), // Deep copy defaults
                id: uuidv4(),
                categoryKey: aiTreatment.categoryKey,
                treatmentKey: aiTreatment.treatmentKey,
                goal: aiTreatment.goal || treatmentDef.defaults.goal.en,
                week: aiTreatment.week || 'tbd',
                frequency: aiTreatment.frequency || 'as-needed',
                keyInstructions: aiTreatment.keyInstructions || `Follow standard care for ${treatmentDef.name.en}.`,
                targetArea: aiTreatment.targetArea || [],
                discount: 0,
            };
        }).filter((t): t is Treatment => t !== null);

        return {
            id: uuidv4(),
            title: aiPhase.title,
            treatments: newTreatments,
            controlsAndMetrics: [],
        };
    });

    // 6. Build the final PlanTemplate object using the blank template as a base.
    const blankTemplate = definitions.planTemplates.find(t => t.id === 'blank-plan');
    if (!blankTemplate) {
      throw new Error("Blank template not found, cannot create AI plan.");
    }

    const newTemplate: PlanTemplate = {
        ...JSON.parse(JSON.stringify(blankTemplate)),
        id: `ai-generated-${uuidv4()}`,
        title: { en: 'AI-Generated Plan', es: 'Plan Generado por IA' },
        notes: { en: `Generated based on consultation notes.`, es: `Generado a partir de notas de consulta.` },
        phases: newPhases.length > 0 ? newPhases : [{ id: uuidv4(), title: "Phase 1", treatments: [], controlsAndMetrics: [] }],
    };

    return { template: newTemplate, patientData: patientData.name && patientData.age ? patientData : null };
};


export const geminiService = {
  /**
   * Generates a structured treatment plan and extracts patient data from consultation notes using Gemini.
   * @param consultNotes - The text from the patient consultation.
   * @param definitions - The complete set of available treatments and options.
   * @returns A promise that resolves to an object containing the generated PlanTemplate and extracted patient data.
   */
  generatePlanFromNotes,

  /**
   * Generates key patient instructions using the Gemini API.
   * @param treatmentName - The name of the treatment.
   * @param goal - The goal of the treatment.
   * @returns A promise that resolves to a string of instructions.
   */
  generateInstructions: async (treatmentName: string, goal: string): Promise<string> => {
    try {
      const prompt = `Generate a concise list of 2-3 key patient instructions for an aesthetic treatment. The instructions should be brief, clear, and focused on patient actions (e.g., 'Avoid sun exposure', 'Do not touch the treated area'). Do not use markdown or bullet points, just a single string of text with points separated by a period.
      
      Treatment: "${treatmentName}"
      Goal: "${goal}"
      
      Instructions:`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      const text = response.text;
      
      if (!text) {
        return 'Follow standard post-treatment care. Contact us with any concerns.';
      }
      
      return text.trim();

    } catch (error) {
      console.error("Error generating instructions with Gemini:", error);
      // Return a fallback
      return 'Follow standard post-treatment care as directed by your provider.';
    }
  },
};