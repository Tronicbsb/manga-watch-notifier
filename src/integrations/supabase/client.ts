// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fgmscsevqlubbesoiqta.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnbXNjc2V2cWx1YmJlc29pcXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NDgxNDgsImV4cCI6MjA2NDIyNDE0OH0.oiaQXB6dQ9k71zatXyQn8JKpqxxu1eATVc1pTZay7NI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);