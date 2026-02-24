Deno.serve(async (req) => {
    console.log('=== Process File Function Started ===');
    
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        console.log('OPTIONS request received');
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        console.log('Processing request body...');
        const { fileData, fileName, fileType, clientId, clientName, businessType, txCounty } = await req.json();
        console.log('Request data:', { fileName, fileType, hasFileData: !!fileData, clientName });

        if (!fileData || !fileName) {
            throw new Error('File data and filename are required');
        }

        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        console.log('Supabase URL:', supabaseUrl);

        // Create or get client
        let actualClientId = clientId;
        if (!actualClientId && clientName) {
            console.log('Creating client:', clientName);
            const clientResponse = await fetch(`${supabaseUrl}/rest/v1/clients`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({
                    name: clientName,
                    business_type: businessType || null,
                    tx_county: txCounty || null
                })
            });

            if (!clientResponse.ok) {
                const errorText = await clientResponse.text();
                console.error('Client creation error:', errorText);
                throw new Error(`Client creation failed: ${errorText}`);
            }

            const clientData = await clientResponse.json();
            actualClientId = clientData[0].id;
            console.log('Client created with ID:', actualClientId);
        }

        // Extract base64 data from data URL
        const base64Data = fileData.includes(',') ? fileData.split(',')[1] : fileData;
        
        // Convert base64 to binary
        const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
        console.log('Binary data size:', binaryData.length);

        // Generate storage path with timestamp
        const timestamp = Date.now();
        const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const storagePath = `${timestamp}-${safeFileName}`;
        console.log('Storage path:', storagePath);

        // Upload to Supabase Storage
        console.log('Uploading to storage...');
        const contentType = fileType === 'text/csv' || fileName.endsWith('.csv') ? 'text/csv' : 'text/plain';
        const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/client-uploads/${storagePath}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'Content-Type': contentType,
                'x-upsert': 'true'
            },
            body: binaryData
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('Storage upload error:', errorText);
            throw new Error(`Storage upload failed: ${errorText}`);
        }

        console.log('File uploaded successfully');

        // Parse file content
        const content = new TextDecoder().decode(binaryData);
        console.log('File content length:', content.length);

        let parsedData = {};
        
        if (fileType === 'text/csv' || fileName.endsWith('.csv')) {
            console.log('Parsing CSV file');
            const lines = content.trim().split('\n');
            parsedData = {
                type: 'csv',
                rows: lines.length,
                preview: lines.slice(0, 3).join('\n')
            };
        } else if (fileType === 'application/json' || fileName.endsWith('.json')) {
            console.log('Parsing JSON file');
            parsedData = JSON.parse(content);
        } else {
            console.log('Parsing as text');
            parsedData = { content: content.substring(0, 500) };
        }

        // Save file metadata
        console.log('Saving file metadata...');
        const fileMetaResponse = await fetch(`${supabaseUrl}/rest/v1/client_files`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                client_id: actualClientId,
                file_name: fileName,
                file_type: fileType || 'unknown',
                storage_path: storagePath,
                processed: false
            })
        });

        if (!fileMetaResponse.ok) {
            const errorText = await fileMetaResponse.text();
            console.error('File metadata save error:', errorText);
            throw new Error(`File metadata save failed: ${errorText}`);
        }

        const fileMetaData = await fileMetaResponse.json();
        const fileId = fileMetaData[0].id;
        console.log('File metadata saved with ID:', fileId);

        // Save processed data
        console.log('Saving processed data...');
        const processedResponse = await fetch(`${supabaseUrl}/rest/v1/processed_data`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                file_id: fileId,
                metric_type: 'raw_data',
                raw_data: parsedData,
                computed: false
            })
        });

        if (!processedResponse.ok) {
            const errorText = await processedResponse.text();
            console.error('Processed data save error:', errorText);
            throw new Error(`Processed data save failed: ${errorText}`);
        }

        console.log('=== Process File Function Completed Successfully ===');

        return new Response(JSON.stringify({
            data: {
                success: true,
                fileId,
                clientId: actualClientId,
                storagePath,
                message: 'File processed successfully'
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('=== Process File Function Error ===');
        console.error('Error details:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);

        const errorResponse = {
            error: {
                code: 'FILE_PROCESS_FAILED',
                message: error.message,
                details: error.stack
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
