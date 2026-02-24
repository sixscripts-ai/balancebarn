import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://wzoalivurogoqwyjctmv.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6b2FsaXZ1cm9nb3F3eWpjdG12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2Nzc4MDIsImV4cCI6MjA3NzI1MzgwMn0.GJzhV0vNmeFTbLDCwTruzIRulBmWsQj5wvhX8x4d1bM');

async function testAuth() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@thebalancebarn.com',
    password: 'Sixflag7#'
  });
  
  if (!authError) {
    console.log('User token:', authData.session.access_token);
    console.log('Testing with user token...');
    
    // Test with direct fetch using user token
    const response = await fetch('https://wzoalivurogoqwyjctmv.supabase.co/functions/v1/blog-posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.session.access_token}`
      },
      body: JSON.stringify({
        action: 'create', 
        data: {
          title: 'Direct Fetch Test',
          content: 'Test content',
          slug: 'direct-fetch-test',
          status: 'draft',
          author_id: authData.user.id,
          meta_title: 'Test',
          meta_description: 'Test',
          excerpt: 'Test',
          reading_time_minutes: 1
        }
      })
    });
    
    console.log('Response status:', response.status);
    const text = await response.text();
    console.log('Response:', text);
  }
}

testAuth();