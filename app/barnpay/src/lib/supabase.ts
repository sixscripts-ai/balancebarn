import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://kievrokjquktunvodswr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpZXZyb2tqcXVrdHVudm9kc3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2ODEwMzEsImV4cCI6MjA3NzI1NzAzMX0.0goZ-c21ew_CVRANLUr1-MDxH2EFfrZiy9qOMoE_550";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
