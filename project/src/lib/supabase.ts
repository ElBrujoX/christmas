import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Timer = {
  id: string;
  created_at: string;
  end_time: string;
  title: string;
  is_completed: boolean;
  user_id: string;
}