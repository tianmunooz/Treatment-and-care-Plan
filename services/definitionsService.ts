
import { Definitions, StoredDefinitions } from '../types';
import { DEFAULT_DEFINITIONS } from '../data/definitions';
import { supabase, Json, Database } from './supabaseService';

const TABLE_NAME = 'definitions';

export const definitionService = {
  DEFAULT_DEFINITIONS, // Expose for initial state in App.tsx

  loadDefinitions: async (): Promise<Definitions> => {
    const { data: { session } } = await supabase.auth.getSession();
    const { treatmentIcons, ...serializablePart } = DEFAULT_DEFINITIONS;
    
    // Explicitly type the result of JSON.parse to help TypeScript
    const serializablePartCopy: StoredDefinitions = JSON.parse(JSON.stringify(serializablePart));
    const defaultDefs: Definitions = {
        ...serializablePartCopy,
        treatmentIcons,
    };
    
    if (!session?.user) {
      console.log("No user session, loading default definitions.");
      return defaultDefs;
    }

    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('data')
        .eq('user_id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      if (data?.data) {
        const parsed = data.data as unknown as Partial<StoredDefinitions>;
        // Deep merge with defaults to ensure new properties from updates are included
        // The saved data takes precedence.
        // Explicitly construct the result to avoid TS confusion with complex spreads
        const practiceInfo = { ...defaultDefs.practiceInfo, ...(parsed.practiceInfo || {}), };
        const categories = { ...defaultDefs.categories, ...(parsed.categories || {}) };
        const options = { ...defaultDefs.options, ...(parsed.options || {}) };
        
        const result: Definitions = {
          practiceInfo,
          categories,
          options,
          planTemplates: parsed.planTemplates || defaultDefs.planTemplates,
          treatmentIcons: defaultDefs.treatmentIcons, // Preserve icons from defaults
        };
        return result;
      }
    } catch (error) {
      console.error('Failed to load definitions from Supabase', error);
    }

    return defaultDefs;
  },

  saveDefinitions: async (definitions: Definitions): Promise<void> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.error("Cannot save definitions: no user session.");
      return;
    }

    // Don't save static icon components to the database
    const { treatmentIcons, ...defsToSave } = definitions;

    type DefinitionsInsert = Database['public']['Tables']['definitions']['Insert'];

    try {
      const record: DefinitionsInsert = {
        user_id: session.user.id,
        data: defsToSave as unknown as Json
      };
      
      const { error } = await supabase
        .from(TABLE_NAME)
        .upsert([record], { onConflict: 'user_id' });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Failed to save definitions to Supabase', error);
      throw error;
    }
  },

  resetDefinitions: async (): Promise<Definitions> => {
     const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      try {
          const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('user_id', session.user.id);

          if (error) {
            throw error;
          }
      } catch (error) {
          console.error('Failed to reset definitions in Supabase', error);
      }
    }
    // Return a deep copy to prevent mutation
    return JSON.parse(JSON.stringify(DEFAULT_DEFINITIONS));
  }
};