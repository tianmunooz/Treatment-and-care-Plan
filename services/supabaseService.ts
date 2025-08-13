import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://akwkgwbmngahnypbgphn.supabase.co';
// The key is provided by the execution environment.
const supabaseKey = process.env.API_KEY; 

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      definitions: {
        Row: {
          user_id: string;
          data: Json;
        };
        Insert: {
          user_id: string;
          data: Json;
        };
        Update: {
          data?: Json;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export const supabase = createClient<Database>(supabaseUrl!, supabaseKey!);