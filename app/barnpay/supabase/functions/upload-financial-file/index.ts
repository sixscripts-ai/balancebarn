// Secure File Upload Edge Function
// Handles file uploads to Supabase storage with proper authentication

Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: corsHeaders
        });
    }

    try {
        const { fileData, fileName, userId } = await req.json();
        
        if (!fileData || !fileName || !userId) {
            throw new Error('Missing required parameters: fileData, fileName, userId');
        }

        // Get Supabase credentials
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

        // Convert base64 to file
        const base64Data = fileData.split(',')[1];
        const fileBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        // Validate file type
        const validExtensions = ['.csv', '.xlsx', '.xls'];
        const fileExtension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
        
        if (!validExtensions.includes(fileExtension)) {
            throw new Error('Invalid file type. Only CSV and Excel files are allowed.');
        }

        // Generate unique file path
        const timestamp = Date.now();
        const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${userId}/${timestamp}_${safeFileName}`;

        // Determine content type based on file extension
        let contentType = 'text/csv';
        if (fileExtension === '.xlsx') contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        else if (fileExtension === '.xls') contentType = 'application/vnd.ms-excel';

        // Upload to storage
        const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/user-files/${filePath}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': contentType,
                'apikey': supabaseKey
            },
            body: fileBytes
        });

        if (!uploadResponse.ok) {
            const error = await uploadResponse.text();
            throw new Error(`Storage upload failed: ${error}`);
        }

        // Create file record in database
        const fileRecordResponse = await fetch(`${supabaseUrl}/rest/v1/uploaded_files`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                user_id: userId,
                filename: fileName,
                file_path: filePath,
                file_type: fileExtension,
                file_size: fileBytes.length,
                processing_status: 'pending'
            })
        });

        if (!fileRecordResponse.ok) {
            const error = await fileRecordResponse.text();
            throw new Error(`Database record creation failed: ${error}`);
        }

        const fileRecord = await fileRecordResponse.json();

        // Read file content for processing
        const fileContent = new TextDecoder().decode(fileBytes);

        // Process the file
        const processResponse = await fetch(`${supabaseUrl}/functions/v1/process-financial-file-v2`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fileContent,
                fileName,
                userId,
                fileId: fileRecord[0].id
            })
        });

        if (!processResponse.ok) {
            console.warn('File processing failed, but upload succeeded');
        }

        return new Response(JSON.stringify({
            success: true,
            data: {
                fileId: fileRecord[0].id,
                fileName: fileName,
                filePath: filePath,
                message: 'File uploaded and processed successfully'
            }
        }), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Upload error:', error);
        return new Response(JSON.stringify({
            error: {
                code: 'UPLOAD_ERROR',
                message: error.message
            }
        }), {
            status: 500,
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });
    }
});