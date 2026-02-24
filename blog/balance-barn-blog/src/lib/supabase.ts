import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wzoalivurogoqwyjctmv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6b2FsaXZ1cm9nb3F3eWpjdG12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2Nzc4MDIsImV4cCI6MjA3NzI1MzgwMn0.GJzhV0vNmeFTbLDCwTruzIRulBmWsQj5wvhX8x4d1bM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
