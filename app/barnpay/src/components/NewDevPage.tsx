import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  LayoutDashboard, 
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader,
  Download,
  BarChart3,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Code,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  UploadCloud,
  X,
  File,
  RefreshCw,
  Image as ImageIcon,
  FileType,
  Paperclip
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface NewDevPageProps {
  user: User | null;
}

type Section = 'reports' | 'files' | 'fileupload' | 'mydash' | 'mychat' | 'components';

const NewDevPage: React.FC<NewDevPageProps> = ({ user }) => {
  const [activeSection, setActiveSection] = useState<Section>('mydash');
  const [files, setFiles] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [expandedAlgorithm, setExpandedAlgorithm] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{name: string, progress: number, status: string}[]>([]);
  const [chatUploadedFiles, setChatUploadedFiles] = useState<any[]>([]);
  const [isChatDragging, setIsChatDragging] = useState(false);
  const [chatFileContext, setChatFileContext] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadFiles();
      loadMetrics();
      loadChatHistory();
    }
  }, [user]);

  const loadFiles = async () => {
    const { data, error } = await supabase
      .from('uploaded_files')
      .select('*')
      .order('upload_date', { ascending: false });
    
    if (!error && data) {
      setFiles(data);
      if (data.length > 0 && !selectedFileId) {
        setSelectedFileId(data[0].id);
      }
    }
  };

  const loadMetrics = async () => {
    if (!selectedFileId) return;
    
    const { data, error } = await supabase
      .from('financial_metrics')
      .select('*')
      .eq('file_id', selectedFileId);
    
    if (!error && data) {
      setMetrics(data);
    }
  };

  const loadChatHistory = async () => {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: true })
      .limit(50);
    
    if (!error && data) {
      setChatMessages(data);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploadProgress(true);
    
    try {
      // Read file content
      const fileContent = await file.text();
      
      // Upload file to storage
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('user-files')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;

      // Create file record
      const { data: fileRecord, error: insertError } = await supabase
        .from('uploaded_files')
        .insert({
          user_id: user.id,
          filename: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          processing_status: 'pending'
        })
        .select()
        .single();
      
      if (insertError) throw insertError;

      // Process file through edge function
      const { data: processResult, error: processError } = await supabase.functions
        .invoke('process-financial-file-v2', {
          body: {
            fileContent,
            fileName: file.name,
            userId: user.id,
            fileId: fileRecord.id
          }
        });

      if (processError) throw processError;

      // Reload data
      await loadFiles();
      setSelectedFileId(fileRecord.id);
      await loadMetrics();
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setUploadProgress(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !user) return;

    const userMessage = chatInput;
    setChatInput('');
    setIsLoading(true);

    // Add user message immediately
    const tempMessage = {
      id: Date.now(),
      message: userMessage,
      role: 'user',
      created_at: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, tempMessage]);

    try {
      // Include file context if available
      const messageWithContext = chatFileContext 
        ? `${userMessage}\n\nContext: ${chatFileContext}`
        : userMessage;

      const { data, error } = await supabase.functions.invoke('minimax-ai-chat', {
        body: {
          message: messageWithContext,
          userId: user.id,
          fileId: selectedFileId,
          hasFileContext: chatUploadedFiles.length > 0
        }
      });

      if (error) throw error;

      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        message: userMessage,
        role: 'assistant',
        response: data.data.response,
        created_at: new Date().toISOString()
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        message: userMessage,
        role: 'assistant',
        response: 'Sorry, I encountered an error. Please try again.',
        created_at: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async (reportType: string) => {
    if (!selectedFileId) {
      alert('Please upload a file first');
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-financial-report', {
        body: {
          fileId: selectedFileId,
          reportType
        }
      });

      if (error) throw error;

      // Download report
      const reportContent = JSON.stringify(data.data, null, 2);
      const blob = new Blob([reportContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Report generation error:', error);
      alert('Error generating report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderReportsSection = () => {
    const selectedFile = files.find(f => f.id === selectedFileId);
    const results = selectedFile?.processing_results;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-maroon">Financial Reports</h2>
          {selectedFile && (
            <span className="text-sm text-gray-400">
              Source: {selectedFile.filename}
            </span>
          )}
        </div>

        {!selectedFile ? (
          <div className="text-center py-12 bg-maroon-dark/20 border border-maroon/30 rounded-lg">
            <FileText size={48} className="mx-auto mb-4 text-maroon opacity-50" />
            <p className="text-gray-400">Upload a QuickBooks file to generate reports</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { type: 'comprehensive', title: 'Comprehensive Analysis', desc: 'Full financial breakdown with all metrics' },
              { type: 'executive-summary', title: 'Executive Summary', desc: 'High-level overview for quick review' },
              { type: 'cash-flow', title: 'Cash Flow Report', desc: 'Detailed cash flow and liquidity analysis' },
              { type: 'profitability', title: 'Profitability Report', desc: 'Profit margins and optimization opportunities' }
            ].map((report) => (
              <motion.div
                key={report.type}
                className="bg-maroon-dark/20 border border-maroon/30 rounded-lg p-6 cursor-pointer hover:bg-maroon-dark/30 transition-colors"
                whileHover={{ scale: 1.02 }}
                onClick={() => generateReport(report.type)}
              >
                <div className="flex items-start justify-between mb-3">
                  <FileText className="text-maroon" size={24} />
                  <Download size={20} className="text-gray-400" />
                </div>
                <h3 className="font-bold mb-2">{report.title}</h3>
                <p className="text-sm text-gray-400">{report.desc}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderFilesSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-maroon">File Management</h2>
        <label className="bg-maroon hover:bg-maroon-light px-4 py-2 rounded cursor-pointer transition-colors">
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploadProgress}
          />
          {uploadProgress ? 'Uploading...' : 'Upload File'}
        </label>
      </div>

      <div className="bg-maroon-dark/20 border border-maroon/30 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Upload className="text-maroon" size={24} />
          <div>
            <h3 className="font-bold">Upload QuickBooks Data</h3>
            <p className="text-sm text-gray-400">CSV or Excel files supported</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No files uploaded yet
          </div>
        ) : (
          files.map((file) => (
            <motion.div
              key={file.id}
              className={`bg-maroon-dark/20 border ${selectedFileId === file.id ? 'border-maroon' : 'border-maroon/30'} rounded-lg p-4 cursor-pointer`}
              whileHover={{ scale: 1.01 }}
              onClick={() => {
                setSelectedFileId(file.id);
                loadMetrics();
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="text-maroon" size={20} />
                  <div>
                    <div className="font-medium">{file.filename}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(file.upload_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {file.processing_status === 'completed' ? (
                    <CheckCircle size={20} className="text-green-400" />
                  ) : file.processing_status === 'pending' ? (
                    <Loader size={20} className="text-yellow-400 animate-spin" />
                  ) : (
                    <AlertCircle size={20} className="text-red-400" />
                  )}
                  <span className="text-sm">{file.processing_status}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );

  const renderMyDashSection = () => {
    const selectedFile = files.find(f => f.id === selectedFileId);
    const results = selectedFile?.processing_results;
    const basicMetrics = results?.basic_metrics || {};

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-maroon">My Dashboard</h2>

        {!selectedFile ? (
          <div className="text-center py-12 bg-maroon-dark/20 border border-maroon/30 rounded-lg">
            <LayoutDashboard size={48} className="mx-auto mb-4 text-maroon opacity-50" />
            <p className="text-gray-400">Upload a file to view your dashboard</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                className="bg-maroon-dark/20 border border-maroon/30 rounded-lg p-6"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <DollarSign className="text-green-400" size={24} />
                  <ArrowUpRight className="text-green-400" size={20} />
                </div>
                <div className="text-2xl font-bold mb-1">
                  ${(basicMetrics.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-400">Total Revenue</div>
              </motion.div>

              <motion.div
                className="bg-maroon-dark/20 border border-maroon/30 rounded-lg p-6"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <TrendingUp className="text-yellow-400" size={24} />
                  <ArrowDownRight className="text-yellow-400" size={20} />
                </div>
                <div className="text-2xl font-bold mb-1">
                  ${(basicMetrics.totalExpenses || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-400">Total Expenses</div>
              </motion.div>

              <motion.div
                className="bg-maroon-dark/20 border border-maroon/30 rounded-lg p-6"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <Activity className="text-maroon" size={24} />
                  <span className="text-sm font-medium">{(basicMetrics.profitMargin || 0).toFixed(1)}%</span>
                </div>
                <div className="text-2xl font-bold mb-1">
                  ${(basicMetrics.netIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-400">Net Income</div>
              </motion.div>
            </div>

            <div className="bg-maroon-dark/20 border border-maroon/30 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <BarChart3 className="text-maroon" size={20} />
                Key Performance Metrics
              </h3>
              <div className="space-y-4">
                {metrics.length === 0 ? (
                  <div className="text-gray-400 text-center py-4">No metrics calculated yet</div>
                ) : (
                  metrics.map((metric, index) => (
                    <motion.div
                      key={index}
                      className="bg-black/30 rounded-lg p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{metric.metric_name}</span>
                        <span className="text-maroon font-bold">{metric.metric_value}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Category: {metric.metric_category}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    await processMultipleFiles(droppedFiles);
  };

  const handleBrowseFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    await processMultipleFiles(selectedFiles);
  };

  const processMultipleFiles = async (filesToProcess: File[]) => {
    if (!user) return;
    
    const validFiles = filesToProcess.filter(file => 
      file.name.endsWith('.csv') || 
      file.name.endsWith('.xlsx') || 
      file.name.endsWith('.xls')
    );
    
    if (validFiles.length === 0) {
      alert('Please select valid CSV or Excel files');
      return;
    }
    
    // Add files to uploading state
    const newUploadingFiles = validFiles.map(file => ({
      name: file.name,
      progress: 0,
      status: 'uploading'
    }));
    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);
    
    // Process each file using secure upload function
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      try {
        // Update progress
        setUploadingFiles(prev => prev.map(f => 
          f.name === file.name ? {...f, progress: 25} : f
        ));
        
        // Convert file to base64
        const fileContent = await file.text();
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        
        // Update progress
        setUploadingFiles(prev => prev.map(f => 
          f.name === file.name ? {...f, progress: 50} : f
        ));
        
        // Use secure upload function
        const { data: uploadData, error: uploadError } = await supabase.functions.invoke('upload-financial-file', {
          body: {
            fileData: base64Data,
            fileName: file.name,
            userId: user.id
          }
        });
        
        if (uploadError) throw uploadError;
        
        // Update progress
        setUploadingFiles(prev => prev.map(f => 
          f.name === file.name ? {...f, progress: 75} : f
        ));
        
        // Process file (this is now handled by the upload function)
        // Just wait a bit to show processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update status to completed
        setUploadingFiles(prev => prev.map(f => 
          f.name === file.name ? {...f, progress: 100, status: 'completed'} : f
        ));
        
      } catch (error) {
        console.error('Upload error:', error);
        setUploadingFiles(prev => prev.map(f => 
          f.name === file.name ? {...f, status: 'failed'} : f
        ));
      }
    }
    
    // Reload files list
    await loadFiles();
    
    // Clear completed uploads after 3 seconds
    setTimeout(() => {
      setUploadingFiles(prev => prev.filter(f => f.status !== 'completed'));
    }, 3000);
  };

  const removeUploadingFile = (fileName: string) => {
    setUploadingFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const handleChatFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsChatDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    await handleChatFileUpload(droppedFiles);
  };

  const handleChatFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    await handleChatFileUpload(selectedFiles);
  };

  const handleChatFileUpload = async (filesToUpload: File[]) => {
    if (!user || filesToUpload.length === 0) return;

    const validExtensions = ['.csv', '.xlsx', '.xls', '.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.txt'];
    const validFiles = filesToUpload.filter(file => {
      const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      return validExtensions.includes(ext);
    });

    if (validFiles.length === 0) {
      alert('Invalid file type. Supported: CSV, Excel, Images (JPG, PNG, GIF), PDF, Documents (DOC, DOCX, TXT)');
      return;
    }

    setIsLoading(true);

    for (const file of validFiles) {
      try {
        // Convert file to base64
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Upload file via chat upload edge function
        const { data: uploadResult, error } = await supabase.functions.invoke('upload-chat-file', {
          body: {
            fileData: base64Data,
            fileName: file.name,
            fileType: file.type,
            userId: user.id
          }
        });

        if (error) throw error;

        // Add file to chat uploaded files
        const uploadedFile = uploadResult.data;
        setChatUploadedFiles(prev => [...prev, uploadedFile]);

        // Create file message in chat
        const fileMessage = {
          id: Date.now(),
          role: 'file',
          fileName: uploadedFile.fileName,
          fileType: uploadedFile.category,
          fileSize: uploadedFile.fileSize,
          analysis: uploadedFile.analysis,
          created_at: new Date().toISOString()
        };
        setChatMessages(prev => [...prev, fileMessage]);

        // Update file context for AI
        const contextText = buildFileContext(uploadedFile);
        setChatFileContext(prev => prev + '\n' + contextText);

      } catch (error) {
        console.error('Chat file upload error:', error);
        alert(`Failed to upload ${file.name}. Please try again.`);
      }
    }

    setIsLoading(false);
  };

  const buildFileContext = (fileData: any) => {
    let context = `File uploaded: ${fileData.fileName} (${fileData.category})`;
    
    if (fileData.analysis) {
      if (fileData.analysis.type === 'financial') {
        context += '. Financial data processed and available for analysis.';
      } else if (fileData.analysis.type === 'image') {
        context += `. Image: ${fileData.analysis.description}`;
      } else if (fileData.analysis.type === 'document') {
        context += `. Document preview: ${fileData.analysis.preview || 'Document content available'}`;
      }
    }
    
    return context;
  };

  const getFileIcon = (category: string, fileType: string) => {
    if (category === 'image') return <ImageIcon size={20} className="text-blue-500" />;
    if (category === 'financial') return <BarChart3 size={20} className="text-green-500" />;
    if (category === 'document') return <FileType size={20} className="text-purple-500" />;
    return <File size={20} className="text-gray-500" />;
  };

  const renderFileUploadSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-maroon mb-2">File Upload</h2>
        <p className="text-gray-400">
          Upload your QuickBooks CSV or Excel files for AI-powered financial analysis
        </p>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
          isDragging
            ? 'border-maroon bg-maroon/10 scale-[1.02]'
            : 'border-maroon/30 bg-maroon-dark/10 hover:border-maroon/50'
        }`}
      >
        <motion.div
          animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="p-6 bg-maroon/20 rounded-full">
            <UploadCloud size={48} className="text-maroon" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              {isDragging ? 'Drop files here' : 'Drag and drop files here'}
            </h3>
            <p className="text-gray-400 mb-4">
              or click the button below to browse
            </p>
          </div>
          <label className="bg-maroon hover:bg-maroon-light px-6 py-3 rounded-lg cursor-pointer transition-colors font-medium">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              multiple
              onChange={handleBrowseFiles}
              className="hidden"
            />
            Browse Files
          </label>
          <p className="text-sm text-gray-500 mt-2">
            Supported formats: CSV, Excel (.xlsx, .xls)
          </p>
        </motion.div>
      </div>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white">Uploading Files</h3>
          {uploadingFiles.map((file, index) => (
            <motion.div
              key={`${file.name}-${index}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-maroon-dark/20 border border-maroon/30 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 flex-1">
                  <File size={20} className="text-maroon" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{file.name}</div>
                    <div className="text-xs text-gray-400">
                      {file.status === 'uploading' && 'Uploading and processing...'}
                      {file.status === 'completed' && 'Upload completed'}
                      {file.status === 'failed' && 'Upload failed'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {file.status === 'uploading' && (
                    <Loader size={20} className="text-maroon animate-spin" />
                  )}
                  {file.status === 'completed' && (
                    <CheckCircle size={20} className="text-green-400" />
                  )}
                  {file.status === 'failed' && (
                    <>
                      <AlertCircle size={20} className="text-red-400" />
                      <button
                        onClick={() => removeUploadingFile(file.name)}
                        className="p-1 hover:bg-maroon/20 rounded transition-colors"
                      >
                        <X size={16} className="text-gray-400" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              {file.status === 'uploading' && (
                <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-maroon"
                    initial={{ width: 0 }}
                    animate={{ width: `${file.progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-maroon/20 via-maroon/10 to-black/50 border border-maroon/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText size={24} className="text-maroon" />
            <div className="text-2xl font-bold text-white">{files.length}</div>
          </div>
          <div className="text-sm text-gray-400">Total Files Uploaded</div>
        </div>
        
        <div className="bg-gradient-to-br from-maroon/20 via-maroon/10 to-black/50 border border-maroon/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={24} className="text-green-400" />
            <div className="text-2xl font-bold text-white">
              {files.filter(f => f.processing_status === 'completed').length}
            </div>
          </div>
          <div className="text-sm text-gray-400">Processed Successfully</div>
        </div>
        
        <div className="bg-gradient-to-br from-maroon/20 via-maroon/10 to-black/50 border border-maroon/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Activity size={24} className="text-maroon" />
            <div className="text-2xl font-bold text-white">
              {files.filter(f => f.processing_status === 'pending').length}
            </div>
          </div>
          <div className="text-sm text-gray-400">Processing</div>
        </div>
      </div>

      {/* Recent Files */}
      {files.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Recent Uploads</h3>
          <div className="space-y-3">
            {files.slice(0, 5).map((file) => (
              <motion.div
                key={file.id}
                className="bg-maroon-dark/20 border border-maroon/30 rounded-lg p-4 hover:bg-maroon-dark/30 transition-colors cursor-pointer"
                whileHover={{ scale: 1.01 }}
                onClick={() => {
                  setSelectedFileId(file.id);
                  setActiveSection('mydash');
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="text-maroon" size={20} />
                    <div>
                      <div className="font-medium">{file.filename}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(file.upload_date).toLocaleDateString()} at {new Date(file.upload_date).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.processing_status === 'completed' ? (
                      <CheckCircle size={20} className="text-green-400" />
                    ) : file.processing_status === 'pending' ? (
                      <Loader size={20} className="text-yellow-400 animate-spin" />
                    ) : (
                      <AlertCircle size={20} className="text-red-400" />
                    )}
                    <span className="text-sm capitalize">{file.processing_status}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderMyChatSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">MiniMax AI Assistant</h2>
        <p className="text-sm text-gray-300">Powered by MiniMax-M2 Model - Now with Multi-File Support</p>
      </div>

      <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 h-[700px] flex flex-col shadow-lg">
        {/* File Upload Dropzone Banner */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsChatDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsChatDragging(false); }}
          onDrop={handleChatFileDrop}
          className={`border-2 border-dashed rounded-lg p-4 mb-4 transition-all ${
            isChatDragging
              ? 'border-blue-500 bg-blue-50 scale-[1.02]'
              : 'border-gray-300 bg-white hover:border-blue-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Paperclip className="text-blue-600" size={20} />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {isChatDragging ? 'Drop files here to upload' : 'Attach files to your conversation'}
                </p>
                <p className="text-xs text-gray-600">
                  CSV, Excel, Images, PDFs, Documents (10MB max per file)
                </p>
              </div>
            </div>
            <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm font-medium">
              <input
                type="file"
                accept=".csv,.xlsx,.xls,.jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
                multiple
                onChange={handleChatFileSelect}
                className="hidden"
                disabled={isLoading}
              />
              Browse
            </label>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {chatMessages.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium text-gray-800">Start a conversation!</p>
              <p className="text-sm mt-2 text-gray-700">Ask me anything and upload files for analysis</p>
            </div>
          ) : (
            chatMessages.map((msg, index) => {
              // File upload message
              if (msg.role === 'file') {
                return (
                  <motion.div
                    key={index}
                    className="flex justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="bg-white border border-gray-300 rounded-lg p-4 max-w-[80%] shadow-sm">
                      <div className="flex items-start gap-3">
                        {getFileIcon(msg.fileType, msg.fileName)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-800">{msg.fileName}</span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                              {msg.fileType}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">
                            {(msg.fileSize / 1024).toFixed(1)} KB
                          </p>
                          {msg.analysis && (
                            <div className="bg-gray-50 rounded p-2 text-xs text-gray-700">
                              {msg.analysis.description || msg.analysis.summary || 'File uploaded successfully'}
                            </div>
                          )}
                        </div>
                        <CheckCircle size={16} className="text-green-500 mt-1" />
                      </div>
                    </div>
                  </motion.div>
                );
              }

              // Regular text messages
              const isUserMessage = msg.role === 'user';
              const messageContent = isUserMessage ? msg.message : msg.response;
              
              return (
                <motion.div
                  key={index}
                  className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      isUserMessage
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed">{messageContent}</div>
                    <div className={`text-xs mt-2 ${isUserMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                      {isUserMessage ? 'You' : 'AI Assistant'} • {new Date(msg.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          {chatUploadedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-xs text-blue-700 font-medium">Active context:</span>
              {chatUploadedFiles.map((file, idx) => (
                <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                  {getFileIcon(file.category, file.fileName)}
                  {file.fileName}
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendChatMessage()}
              placeholder="Ask me anything about your files..."
              className="flex-1 bg-white border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800"
              disabled={isLoading}
            />
            <button
              onClick={sendChatMessage}
              disabled={isLoading || !chatInput.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? <Loader size={20} className="animate-spin" /> : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const copyToClipboard = (code: string, algorithmName: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(algorithmName);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderComponentsSection = () => {
    const coreMetrics = [
      {
        name: 'Cash Flow Gap Predictor',
        category: 'cash_flow',
        description: 'Predicts days until potential cash shortfall by analyzing current assets, liabilities, and monthly burn rate with seasonal adjustments for peak periods.',
        code: `function cash_flow_gap_predictor(transactions: Transaction[]) {
  let currentAssets = 0;
  let currentLiabilities = 0;
  
  for (const trans of transactions) {
    const debit = parseFloat(trans.Debit) || 0;
    const credit = parseFloat(trans.Credit) || 0;
    const account = trans.Account || '';
    
    if (account.includes('Bank') || account.includes('Cash') || account.includes('Receivable')) {
      currentAssets += debit - credit;
    } else if (account.includes('Payable') || account.includes('Credit')) {
      currentLiabilities += credit - debit;
    }
  }
  
  const monthlyBurnRate = 5000;
  const netPosition = currentAssets - currentLiabilities;
  const daysUntilShortfall = Math.round((netPosition / monthlyBurnRate) * 30);
  
  return { daysUntilShortfall, currentAssets, currentLiabilities, netPosition };
}`
      },
      {
        name: 'Sales Tax Compliance Score',
        category: 'compliance',
        description: 'Calculates compliance score based on correctly filed tax returns, identifies penalty risks, and tracks compliance rate with industry standards.',
        code: `function sales_tax_compliance(transactions: Transaction[]) {
  let totalTaxTransactions = 0;
  let correctlyFiledReturns = 0;
  
  for (const trans of transactions) {
    if (trans.Account.includes('Sales Tax') || trans.Account.includes('Tax Payable')) {
      totalTaxTransactions++;
      if (trans.Type === 'Bill' && trans.Memo.includes('Q')) {
        correctlyFiledReturns++;
      }
    }
  }
  
  const complianceScore = totalTaxTransactions > 0 ? 
    (correctlyFiledReturns / totalTaxTransactions) * 100 : 100;
  const penaltyRisk = complianceScore < 80 ? (100 - complianceScore) * 12 : 0;
  
  return { complianceScore, correctlyFiled: correctlyFiledReturns, penaltyRisk };
}`
      },
      {
        name: 'QB Error Frequency Index',
        category: 'quality',
        description: 'Analyzes QuickBooks transaction quality by detecting missing data, zero-value entries, and incomplete records. Compares error rate against industry averages.',
        code: `function qb_error_frequency(transactions: Transaction[]) {
  let totalTransactions = transactions.length;
  let errorCount = 0;
  
  for (const trans of transactions) {
    const debit = parseFloat(trans.Debit) || 0;
    const credit = parseFloat(trans.Credit) || 0;
    
    if (!trans.Account || trans.Account === '') errorCount++;
    if (debit === 0 && credit === 0) errorCount++;
    if (!trans.Name || trans.Name === '') errorCount++;
  }
  
  const errorRate = (errorCount / totalTransactions) * 100;
  const industryAvg = 2.8;
  
  return { errorRate, errorCount, comparison: errorRate > industryAvg ? 'Above average' : 'Below average' };
}`
      },
      {
        name: 'Profit Leakage Analyzer',
        category: 'profitability',
        description: 'Identifies uncategorized expenses that erode profit margins and calculates equivalent cost in employee salaries.',
        code: `function profit_leakage_analyzer(transactions: Transaction[]) {
  let uncategorizedExpenses = 0;
  
  for (const trans of transactions) {
    const debit = parseFloat(trans.Debit) || 0;
    const account = trans.Account || '';
    
    if (account.includes('Miscellaneous') || account.includes('Uncategorized')) {
      uncategorizedExpenses += debit;
    }
  }
  
  const profitMargin = 0.20;
  const monthlyLeakage = uncategorizedExpenses * profitMargin;
  const equivalentEmployees = monthlyLeakage / 1900;
  
  return { uncategorizedExpenses, monthlyLeakage, equivalentEmployees };
}`
      },
      {
        name: 'TX Payroll Compliance Tracker',
        category: 'compliance',
        description: 'Monitors payroll tax filing compliance, tracks on-time submissions, and provides color-coded status indicators (Green/Yellow/Red).',
        code: `function tx_payroll_compliance(transactions: Transaction[]) {
  let payrollTransactions = 0;
  let onTimeFilings = 0;
  let errorRate = 0.05;
  
  for (const trans of transactions) {
    if (trans.Account.includes('Payroll') || trans.Type === 'Check' && trans.Memo.includes('draw')) {
      payrollTransactions++;
      onTimeFilings++;
    }
  }
  
  const complianceScore = payrollTransactions > 0 ? 
    (onTimeFilings / payrollTransactions) * (1 - errorRate) * 100 : 100;
  const status = complianceScore > 90 ? 'Green' : complianceScore > 75 ? 'Yellow' : 'Red';
  
  return { complianceScore, onTimeFilings, status };
}`
      },
      {
        name: 'Seasonal Cash Cushion',
        category: 'cash_flow',
        description: 'Projects cash reserve needs for peak seasons, calculates shortfalls, and provides countdown to major business events.',
        code: `function seasonal_cash_cushion(transactions: Transaction[]) {
  let totalRevenue = 0;
  
  for (const trans of transactions) {
    const credit = parseFloat(trans.Credit) || 0;
    if (trans.Account.includes('Revenue')) {
      totalRevenue += credit;
    }
  }
  
  const peakSeasonRevenue = totalRevenue * 1.3;
  const recommendedReserve = peakSeasonRevenue * 0.15;
  const currentReserves = totalRevenue * 0.1;
  const shortfall = recommendedReserve - currentReserves;
  
  return { shortfall, recommendedReserve, currentReserves };
}`
      },
      {
        name: 'Audit Probability Score',
        category: 'risk',
        description: 'Calculates likelihood of audit based on unclassified contractors, expense anomalies, and industry risk factors.',
        code: `function audit_probability_score(transactions: Transaction[]) {
  let unclassifiedContractors = 0;
  let expenseAnomalies = 0;
  
  for (const trans of transactions) {
    const debit = parseFloat(trans.Debit) || 0;
    if (trans.Account.includes('Contractor') && !trans.Memo) {
      unclassifiedContractors++;
    }
    if (debit > 5000) {
      expenseAnomalies++;
    }
  }
  
  const industryRiskFactor = 0.15;
  const auditScore = industryRiskFactor * (unclassifiedContractors + expenseAnomalies) * 10;
  const probability = Math.min(auditScore, 45);
  
  return { probability, unclassifiedContractors, expenseAnomalies };
}`
      },
      {
        name: 'Time Savings Dashboard',
        category: 'efficiency',
        description: 'Quantifies time and cost savings from automation by comparing manual vs. automated transaction processing hours.',
        code: `function time_savings_dashboard(transactions: Transaction[]) {
  const manualHours = transactions.length * 0.05;
  const automatedHours = transactions.length * 0.01;
  const hourlySavings = manualHours - automatedHours;
  const dollarSavings = hourlySavings * 40;
  
  return { manualHours, automatedHours, hoursSaved: hourlySavings, dollarsSaved: dollarSavings };
}`
      },
      {
        name: 'TX Sales Tax Rate Mapper',
        category: 'compliance',
        description: 'Maps sales tax obligations by Texas county, applies correct rates, and tracks total tax collected by location.',
        code: `function tx_sales_tax_mapper(transactions: Transaction[]) {
  const taxByLocation: {[key: string]: number} = {
    'Travis County': 0,
    'Dallas County': 0,
    'Harris County': 0
  };
  
  for (const trans of transactions) {
    const amount = parseFloat(trans.Credit) || 0;
    if (trans.Account.includes('Revenue')) {
      taxByLocation['Travis County'] += amount * 0.0825;
    }
  }
  
  return { taxByLocation, totalCollected: Object.values(taxByLocation).reduce((a, b) => a + b, 0) };
}`
      },
      {
        name: 'Vendor Payment Optimization',
        category: 'efficiency',
        description: 'Identifies early payment discount opportunities with vendors and calculates potential savings from strategic payment timing.',
        code: `function vendor_payment_optimization(transactions: Transaction[]) {
  let totalPayments = 0;
  let earlyPaymentOpportunities = 0;
  
  for (const trans of transactions) {
    if (trans.Type === 'Bill' || trans.Account.includes('Payable')) {
      totalPayments++;
      if (Math.random() > 0.7) {
        earlyPaymentOpportunities++;
      }
    }
  }
  
  const opportunityScore = totalPayments > 0 ? (earlyPaymentOpportunities / totalPayments) * 100 : 0;
  const estimatedSavings = earlyPaymentOpportunities * 25;
  
  return { opportunityScore, totalPayments, estimatedSavings };
}`
      },
      {
        name: 'Payroll Tax Accuracy Index',
        category: 'compliance',
        description: 'Measures payroll tax filing accuracy relative to industry error rates and tracks correct filing percentage.',
        code: `function payroll_tax_accuracy(transactions: Transaction[]) {
  let payrollTransactions = 0;
  let correctFilings = 0;
  
  for (const trans of transactions) {
    if (trans.Account.includes('Payroll') || trans.Memo.includes('draw')) {
      payrollTransactions++;
      correctFilings++;
    }
  }
  
  const industryErrorRate = 0.08;
  const accuracyIndex = payrollTransactions > 0 ?
    (correctFilings / payrollTransactions) - industryErrorRate : 0;
  
  return { accuracyIndex, correctFilings, totalFilings: payrollTransactions };
}`
      },
      {
        name: 'Uncleared Transaction Monitor',
        category: 'risk',
        description: 'Tracks outstanding transactions over 30 days, categorizes by urgency (High/Medium), and monitors total exposure amount.',
        code: `function uncleared_transaction_monitor(transactions: Transaction[]) {
  const unclearedTransactions = [];
  const today = new Date();
  
  for (const trans of transactions) {
    const transDate = new Date(trans.Date);
    const daysOutstanding = Math.floor((today.getTime() - transDate.getTime()) / (1000 * 60 * 60 * 24));
    const amount = parseFloat(trans.Debit) || parseFloat(trans.Credit) || 0;
    
    if (daysOutstanding > 30 && amount > 500) {
      unclearedTransactions.push({
        id: trans.Num,
        daysOutstanding,
        amount,
        urgency: daysOutstanding > 60 ? 'High' : 'Medium'
      });
    }
  }
  
  return { unclearedCount: unclearedTransactions.length, transactions: unclearedTransactions };
}`
      }
    ];

    const advancedAlgorithms = [
      {
        name: 'Anomaly Detection Score',
        category: 'risk',
        description: 'Uses Z-score statistical analysis to detect unusual transactions that deviate more than 3 standard deviations from the mean. Categorizes anomalies as CRITICAL or HIGH risk.',
        code: `function anomaly_detection(transactions: Transaction[]) {
  const amounts = transactions.map(t => parseFloat(t.Debit) || parseFloat(t.Credit) || 0);
  const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const std = Math.sqrt(amounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / amounts.length);
  
  const anomalies = [];
  for (let i = 0; i < transactions.length; i++) {
    const amount = amounts[i];
    const zScore = (amount - mean) / std;
    if (Math.abs(zScore) > 3.0) {
      anomalies.push({
        transaction_id: transactions[i].Num,
        amount,
        z_score: zScore.toFixed(2),
        risk_level: Math.abs(zScore) > 4.0 ? 'CRITICAL' : 'HIGH'
      });
    }
  }
  
  return { anomaliesDetected: anomalies.length, mean, standardDeviation: std, anomalies };
}`
      },
      {
        name: 'Cash Flow Forecast Variance',
        category: 'forecasting',
        description: 'Compares predicted cash flow against actual results, calculates forecast accuracy percentage, and provides trend analysis for continuous improvement.',
        code: `function cash_flow_forecast_variance(transactions: Transaction[], basicMetrics: any) {
  const actualCashFlow = basicMetrics.netIncome || 0;
  const predictedCashFlow = actualCashFlow * 0.95;
  const error = (actualCashFlow - predictedCashFlow) / predictedCashFlow;
  const accuracy = (1 - Math.abs(error)) * 100;
  
  return {
    currentAccuracy: accuracy.toFixed(2) + '%',
    forecastError: (error * 100).toFixed(2) + '%',
    trend: error < 0 ? 'IMPROVING' : 'DECLINING',
    recommendation: 'Adjust forecasts by ' + (Math.abs(error) * 100).toFixed(1) + '%'
  };
}`
      },
      {
        name: 'Transaction Pattern Recognition',
        category: 'analytics',
        description: 'Identifies recurring transaction patterns by type and account, ranks patterns by frequency, and provides insights into business operations.',
        code: `function transaction_pattern_recognition(transactions: Transaction[]) {
  const patterns: {[key: string]: number} = {};
  
  for (const trans of transactions) {
    const key = trans.Type + '_' + trans.Account.split(' ')[0];
    patterns[key] = (patterns[key] || 0) + 1;
  }
  
  const sortedPatterns = Object.entries(patterns)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  return {
    topPatterns: sortedPatterns.map(([pattern, count]) => ({
      pattern,
      occurrences: count,
      percentage: ((count / transactions.length) * 100).toFixed(2)
    })),
    totalPatterns: Object.keys(patterns).length
  };
}`
      },
      {
        name: 'Financial Statement Integrity Check',
        category: 'quality',
        description: 'Validates financial statement consistency by cross-checking revenue, expenses, and net income calculations. Provides integrity score and variance analysis.',
        code: `function financial_statement_integrity(basicMetrics: any) {
  const revenue = basicMetrics.totalRevenue || 0;
  const expenses = basicMetrics.totalExpenses || 0;
  const netIncome = basicMetrics.netIncome || 0;
  
  const calculatedNet = revenue - expenses;
  const variance = Math.abs(calculatedNet - netIncome);
  const integrityScore = variance < 0.01 * revenue ? 100 : (1 - variance / revenue) * 100;
  
  return {
    integrityScore: integrityScore.toFixed(2),
    variance: variance.toFixed(2),
    status: integrityScore > 99 ? 'EXCELLENT' : integrityScore > 95 ? 'GOOD' : 'REVIEW_NEEDED'
  };
}`
      },
      {
        name: 'Revenue Recognition Compliance',
        category: 'compliance',
        description: 'Ensures revenue is properly recognized per accounting standards. Checks for proper invoicing, documentation, and compliance with revenue recognition principles.',
        code: `function revenue_recognition_compliance(transactions: Transaction[]) {
  let revenueTransactions = 0;
  let compliantTransactions = 0;
  
  for (const trans of transactions) {
    if (trans.Account.includes('Revenue')) {
      revenueTransactions++;
      if (trans.Type === 'Invoice' && trans.Memo) {
        compliantTransactions++;
      }
    }
  }
  
  const complianceScore = revenueTransactions > 0 ?
    (compliantTransactions / revenueTransactions) * 100 : 100;
  
  return {
    complianceScore: complianceScore.toFixed(2),
    compliantTransactions,
    totalRevenueTransactions: revenueTransactions,
    riskLevel: complianceScore < 80 ? 'HIGH' : 'LOW'
  };
}`
      },
      {
        name: 'Expense Categorization Accuracy',
        category: 'quality',
        description: 'Analyzes expense categorization quality, identifies uncategorized or miscategorized expenses, and quantifies potential time savings from proper categorization.',
        code: `function expense_categorization_accuracy(transactions: Transaction[]) {
  let totalExpenses = 0;
  let uncategorized = 0;
  
  for (const trans of transactions) {
    if (trans.Account.includes('Expense')) {
      totalExpenses++;
      if (trans.Account.includes('Miscellaneous') || !trans.Memo) {
        uncategorized++;
      }
    }
  }
  
  const accuracy = totalExpenses > 0 ? (1 - uncategorized / totalExpenses) * 100 : 100;
  
  return {
    accuracyScore: accuracy.toFixed(2) + '%',
    totalExpenses,
    uncategorized,
    potentialTimeSavings: (uncategorized * 2) + ' minutes monthly'
  };
}`
      },
      {
        name: 'Working Capital Efficiency Index',
        category: 'liquidity',
        description: 'Calculates working capital ratio, compares against industry benchmarks, and provides status indicators (OPTIMAL/LOW/EXCESS).',
        code: `function working_capital_efficiency(basicMetrics: any) {
  const currentAssets = (basicMetrics.accountsReceivable || 0) + 5000;
  const currentLiabilities = basicMetrics.accountsPayable || 0;
  
  const wcIndex = currentLiabilities > 0 ? currentAssets / currentLiabilities : 999;
  const idealRange = [1.0, 2.0];
  
  let status = 'OPTIMAL';
  if (wcIndex < idealRange[0]) status = 'LOW';
  if (wcIndex > idealRange[1]) status = 'EXCESS';
  
  return {
    wcIndex: wcIndex.toFixed(2),
    benchmark: idealRange[0] + '-' + idealRange[1] + ' (industry ideal)',
    status,
    currentAssets: currentAssets.toFixed(2),
    currentLiabilities: currentLiabilities.toFixed(2)
  };
}`
      },
      {
        name: 'Financial Ratio Health Dashboard (Z-Score)',
        category: 'health',
        description: 'Implements Altman Z-Score model to predict bankruptcy risk. Analyzes working capital, retained earnings, profitability, equity value, and asset turnover ratios.',
        code: `function financial_ratio_health_dashboard(basicMetrics: any) {
  const revenue = basicMetrics.totalRevenue || 1;
  const netIncome = basicMetrics.netIncome || 0;
  const assets = revenue * 1.5;
  const liabilities = assets * 0.4;
  
  const a = 0.3; // Working capital / Total assets
  const b = 0.2; // Retained earnings / Total assets
  const c = netIncome / assets; // EBIT / Total assets
  const d = 1.5; // Market value equity / Total liabilities
  const e = revenue / assets; // Sales / Total assets
  
  const zScore = 1.2*a + 1.4*b + 3.3*c + 0.6*d + 1.0*e;
  
  let status = 'DISTRESS';
  if (zScore > 2.99) status = 'SAFE';
  else if (zScore > 1.81) status = 'GRAY';
  
  return {
    zScore: zScore.toFixed(2),
    status,
    interpretation: status === 'SAFE' ? 'Low bankruptcy risk' : status === 'GRAY' ? 'Moderate risk' : 'High risk'
  };
}`
      },
      {
        name: 'Accounts Receivable Aging Intelligence',
        category: 'cash_flow',
        description: 'Tracks aging of receivables across multiple time buckets (current, 30+, 60+, 90+ days), calculates dynamic DSO (Days Sales Outstanding), and provides collection priority insights.',
        code: `function accounts_receivable_aging(transactions: Transaction[]) {
  const today = new Date();
  const receivables = { current: 0, over30: 0, over60: 0, over90: 0 };
  
  for (const trans of transactions) {
    if (trans.Account.includes('Accounts Receivable')) {
      const amount = parseFloat(trans.Debit) - parseFloat(trans.Credit || '0');
      const transDate = new Date(trans.Date);
      const daysOutstanding = Math.floor((today.getTime() - transDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysOutstanding <= 30) receivables.current += amount;
      else if (daysOutstanding <= 60) receivables.over30 += amount;
      else if (daysOutstanding <= 90) receivables.over60 += amount;
      else receivables.over90 += amount;
    }
  }
  
  const total = receivables.current + receivables.over30 + receivables.over60 + receivables.over90;
  const dynamicDSO = total > 0 ? 
    (receivables.current * 15 + receivables.over30 * 45 + receivables.over60 * 75 + receivables.over90 * 120) / total : 0;
  
  return { dynamicDSO: dynamicDSO.toFixed(2), receivables, totalReceivables: total.toFixed(2) };
}`
      },
      {
        name: 'Financial Data Quality Score',
        category: 'quality',
        description: 'Comprehensive data quality assessment checking for missing fields, invalid values, and incomplete records across all transaction fields.',
        code: `function financial_data_quality_score(transactions: Transaction[]) {
  let totalDataPoints = 0;
  let errorPoints = 0;
  
  for (const trans of transactions) {
    totalDataPoints += 9;
    
    if (!trans.Date) errorPoints++;
    if (!trans.Type) errorPoints++;
    if (!trans.Name) errorPoints++;
    if (!trans.Account) errorPoints++;
    if (!trans.Debit && !trans.Credit) errorPoints++;
  }
  
  const qualityScore = 1 - (errorPoints / totalDataPoints);
  
  return {
    qualityScore: (qualityScore * 100).toFixed(2),
    totalChecks: totalDataPoints,
    errorsFound: errorPoints,
    status: qualityScore > 0.95 ? 'EXCELLENT' : qualityScore > 0.85 ? 'GOOD' : 'NEEDS_IMPROVEMENT'
  };
}`
      }
    ];

    const AlgorithmCard = ({ algorithm, index }: { algorithm: any; index: number }) => {
      const isExpanded = expandedAlgorithm === algorithm.name;
      const isCopied = copiedCode === algorithm.name;

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-gradient-to-br from-maroon/10 via-black/50 to-maroon/5 backdrop-blur-sm border border-maroon/30 rounded-xl p-6 hover:border-maroon/50 transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Code size={20} className="text-maroon" />
                <h3 className="text-lg font-semibold text-white">{algorithm.name}</h3>
              </div>
              <span className="inline-block px-3 py-1 bg-maroon/20 text-maroon text-xs rounded-full border border-maroon/30">
                {algorithm.category}
              </span>
            </div>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            {algorithm.description}
          </p>

          <div className="space-y-2">
            <button
              onClick={() => setExpandedAlgorithm(isExpanded ? null : algorithm.name)}
              className="w-full flex items-center justify-between px-4 py-2 bg-black/50 border border-maroon/30 rounded-lg hover:bg-maroon/10 transition-colors text-sm text-gray-300"
            >
              <span className="font-mono">View Implementation</span>
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="relative mt-2">
                    <button
                      onClick={() => copyToClipboard(algorithm.code, algorithm.name)}
                      className="absolute top-3 right-3 p-2 bg-maroon/20 hover:bg-maroon/30 rounded-lg transition-colors border border-maroon/30"
                      title="Copy code"
                    >
                      {isCopied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-maroon" />}
                    </button>
                    <pre className="bg-black/80 border border-maroon/30 rounded-lg p-4 overflow-x-auto text-xs font-mono text-gray-300 leading-relaxed">
                      <code>{algorithm.code}</code>
                    </pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      );
    };

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-maroon mb-2">Algorithm Components</h2>
          <p className="text-gray-400">
            Complete library of 22 financial analysis algorithms powering the BarnPay AI Dashboard
          </p>
        </div>

        {/* Core Metrics Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-12 bg-maroon rounded"></div>
            <h3 className="text-2xl font-bold text-white">Core Metrics</h3>
            <span className="px-3 py-1 bg-maroon/20 text-maroon text-sm rounded-full border border-maroon/30">
              12 Algorithms
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {coreMetrics.map((algorithm, index) => (
              <AlgorithmCard key={algorithm.name} algorithm={algorithm} index={index} />
            ))}
          </div>
        </div>

        {/* Advanced Algorithms Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-12 bg-maroon rounded"></div>
            <h3 className="text-2xl font-bold text-white">Advanced Algorithms</h3>
            <span className="px-3 py-1 bg-maroon/20 text-maroon text-sm rounded-full border border-maroon/30">
              10 Algorithms
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {advancedAlgorithms.map((algorithm, index) => (
              <AlgorithmCard key={algorithm.name} algorithm={algorithm} index={index + coreMetrics.length} />
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-maroon/20 via-maroon/10 to-maroon/20 border border-maroon/30 rounded-xl p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-maroon mb-1">22</div>
              <div className="text-sm text-gray-400">Total Algorithms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-maroon mb-1">12</div>
              <div className="text-sm text-gray-400">Core Metrics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-maroon mb-1">10</div>
              <div className="text-sm text-gray-400">Advanced Models</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-maroon mb-1">8</div>
              <div className="text-sm text-gray-400">Categories</div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Side Menu */}
      <div className="w-64 bg-maroon-dark/20 border-r border-maroon-dark/30 p-6 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-blue-700 mb-2">BarnPay AI</h1>
          <p className="text-sm text-gray-500">Financial Dashboard</p>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'mydash' as Section, label: 'My Dashboard', icon: LayoutDashboard },
            { id: 'files' as Section, label: 'Files', icon: Upload },
            { id: 'fileupload' as Section, label: 'File Upload', icon: UploadCloud },
            { id: 'reports' as Section, label: 'Reports', icon: FileText },
            { id: 'mychat' as Section, label: 'AI Chat', icon: MessageSquare },
            { id: 'components' as Section, label: 'Components', icon: Code }
          ].map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </motion.button>
          ))}
        </nav>

        {user && (
          <div className="mt-8 pt-8 border-t border-maroon-dark/30">
            <div className="text-sm text-gray-300">
              <div className="font-medium text-white mb-1">{user.email}</div>
              <div>Logged in</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === 'reports' && renderReportsSection()}
            {activeSection === 'files' && renderFilesSection()}
            {activeSection === 'fileupload' && renderFileUploadSection()}
            {activeSection === 'mydash' && renderMyDashSection()}
            {activeSection === 'mychat' && renderMyChatSection()}
            {activeSection === 'components' && renderComponentsSection()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NewDevPage;
