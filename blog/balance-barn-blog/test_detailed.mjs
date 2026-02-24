import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://wzoalivurogoqwyjctmv.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6b2FsaXZ1cm9nb3F3eWpjdG12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2Nzc4MDIsImV4cCI6MjA3NzI1MzgwMn0.GJzhV0vNmeFTbLDCwTruzIRulBmWsQj5wvhX8x4d1bM');

async function testAuth() {
  try {
    console.log('Signing in...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@thebalancebarn.com',
      password: 'Sixflag7#'
    });
    
    if (authError) {
      console.error('Auth error:', authError);
      return;
    }
    
    console.log('Auth successful, user:', authData.user.id);
    console.log('Access token:', authData.session.access_token.substring(0, 50) + '...');
    
    console.log('Testing edge function call...');
    const { data, error } = await supabase.functions.invoke('blog-posts', {
      body: { 
        action: 'create', 
        data: {
          title: 'Test Post',
          content: 'Test content',
          slug: 'test-post-mjs',
          status: 'draft',
          author_id: authData.user.id,
          meta_title: 'Test',
          meta_description: 'Test',
          excerpt: 'Test',
          reading_time_minutes: 1
        }
      }
    });
    
    if (error) {
      console.error('Function call error details:');
      console.error('  Message:', error.message);
      console.error('  Code:', error.code);
      console.error('  Details:', error.details);
      console.error('  Hint:', error.hint);
      console.error('  Full error:', JSON.stringify(error, null, 2));
    } else {
      console.log('Function call successful:', data);
    }
    
  } catch (err) {
    console.error('Test failed with exception:', err);
  }
}

testAuth();