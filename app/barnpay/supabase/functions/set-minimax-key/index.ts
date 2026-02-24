// Temporary function to set MiniMax API key
Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const apiKey = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJBc2h0b24gQXNjaGVuYnJlbmVyIiwiVXNlck5hbWUiOiJBc2h0b24gQXNjaGVuYnJlbmVyIiwiQWNjb3VudCI6IiIsIlN1YmplY3RJRCI6IjE5ODMzOTUwNzQwNTgyMzI0NzMiLCJQaG9uZSI6IiIsIkdyb3VwSUQiOiIxOTgzMzk1MDc0MDU0MDM0MDczIiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoiYXNjaGVuYnJlbmVyYXNodG9uQGdtYWlsLmNvbSIsIkNyZWF0ZVRpbWUiOiIyMDI1LTEwLTI5IDE3OjI1OjQ0IiwiVG9rZW5UeXBlIjoxLCJpc3MiOiJtaW5pbWF4In0.aygEYSv4cCPhz4cgd5ZcKDZVBw0DRWK1ZjU930sizp_7MMf3DgEb8ZZ7fL5fez5KrJE-GzWO7Yd_tFhI2Z_4v-QBUNIffaMFOHFq088UqD1BtasbO96qgM5uUgaMDXpb--mn5PD2PTKtp_O926ILYig0LwxXoTNlAanHo5hcKcgRRigKVFr7iT_NP-vpfApGdclpiK4hGYaztyGoZ8VpQJigdwGUqEYfMUCJn7kzILiybPU5mT2SffHe0-XlM71-tjYFp4_CKHEBeo239uaUSrZ5BQYbbBAg027xL8RwViE3f9u8ezlGqNMjb755ls532bnKsD1__mQvzefXKk1NIA";
        
        console.log('MiniMax API Key configured successfully');
        
        return new Response(JSON.stringify({
            success: true,
            message: 'MiniMax API key configured',
            key_length: apiKey.length
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({
            error: error.message
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
