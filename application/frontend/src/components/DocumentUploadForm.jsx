import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  File,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';
import auditService from '../services/auditService';
import { useAudit } from '../context/AuditContext';

// Configure PDF.js worker using Vite's URL import
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * DocumentUploadForm Component
 * Comprehensive document upload with drag-and-drop, text input, and metadata
 */
const DocumentUploadForm = () => {
  const { loadAudit } = useAudit();
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'text'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileContents, setFileContents] = useState(''); // Store file contents
  const [showPreview, setShowPreview] = useState(false); // Toggle preview visibility
  const [textContent, setTextContent] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('SECURITY_POLICY');
  const [selectedRegulations, setSelectedRegulations] = useState(['ALL']);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Listen for reset event from modal close
  useEffect(() => {
    const handleReset = () => {
      resetForm();
    };
    
    window.addEventListener('resetUploadForm', handleReset);
    return () => window.removeEventListener('resetUploadForm', handleReset);
  }, []);

  // Document type options
  const documentTypes = [
    { value: 'CONTRACT', label: 'Contract' },
    { value: 'SECURITY_POLICY', label: 'Security Policy' },
    { value: 'HR_POLICY', label: 'HR Policy' },
    { value: 'GDPR_NOTICE', label: 'GDPR Notice' },
    { value: 'OTHER', label: 'Other' }
  ];

  // Regulation options
  const regulations = [
    { value: 'ALL', label: 'All Regulations' },
    { value: 'GDPR', label: 'GDPR' },
    { value: 'ISO27001', label: 'ISO 27001' },
    { value: 'SOC2', label: 'SOC 2' }
  ];

  // Extract text from PDF file
  const extractTextFromPDF = async (file) => {
    try {
      console.log('Starting PDF text extraction for:', file.name);
      const arrayBuffer = await file.arrayBuffer();
      console.log('ArrayBuffer created, size:', arrayBuffer.byteLength);
      
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      console.log('PDF loaded successfully, pages:', pdf.numPages);
      
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        console.log(`Processing page ${i}/${pdf.numPages}`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
      }

      const result = fullText.trim();
      console.log('PDF extraction complete, text length:', result.length);
      return result || 'No text content found in PDF';
    } catch (error) {
      console.error('Detailed PDF extraction error:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      throw error;
    }
  };

  // Extract text from DOCX file
  const extractTextFromDOCX = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      console.error('Error extracting DOCX text:', error);
      throw new Error('Failed to extract text from DOCX');
    }
  };

  // Handle file drop
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError(null);
    setValidationErrors({});

    if (rejectedFiles.length > 0) {
      setError('Invalid file type. Please upload PDF, DOCX, TXT, or Markdown files only.');
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      
      // Auto-fill document name if empty
      if (!documentName) {
        setDocumentName(file.name.replace(/\.[^/.]+$/, ''));
      }

      // Read and store file contents based on file type
      const isTextFile = file.type === 'text/plain' || file.type === 'text/markdown' ||
                         file.name.endsWith('.md') || file.name.endsWith('.markdown');
      const isPDF = file.type === 'application/pdf' || file.name.endsWith('.pdf');
      const isDOCX = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                     file.name.endsWith('.docx');
      
      if (isTextFile) {
        // For text files, read directly
        const reader = new FileReader();
        reader.onload = (e) => {
          const contents = e.target.result;
          setFileContents(contents);
          console.log('=== TEXT FILE CONTENTS ===');
          console.log('File Name:', file.name);
          console.log('File Size:', file.size, 'bytes');
          console.log('Content Length:', contents.length, 'characters');
          console.log('Full Contents:');
          console.log(contents);
          console.log('=== END OF FILE CONTENTS ===');
        };
        reader.onerror = (e) => {
          setError('Failed to read file contents');
          console.error('File read error:', e);
        };
        reader.readAsText(file);
      } else if (isPDF) {
        // Extract text from PDF using PDF.js
        setFileContents('Loading preview...');
        extractTextFromPDF(file)
          .then(text => {
            setFileContents(text);
            console.log('=== PDF FILE CONTENTS ===');
            console.log('File Name:', file.name);
            console.log('File Size:', file.size, 'bytes');
            console.log('Extracted Text Length:', text.length, 'characters');
            console.log('Full Extracted Text:');
            console.log(text);
            console.log('=== END OF FILE CONTENTS ===');
          })
          .catch(err => {
            console.error('Error extracting PDF text:', err);
            const errorMsg = `Unable to extract text from PDF: ${err.message || 'Unknown error'}. The file will be processed during audit.`;
            setFileContents(errorMsg);
            setError(`PDF extraction failed: ${err.message}. You can still proceed with the audit.`);
          });
      } else if (isDOCX) {
        // Extract text from DOCX using Mammoth
        setFileContents('Loading preview...');
        extractTextFromDOCX(file)
          .then(text => {
            setFileContents(text);
            console.log('=== DOCX FILE CONTENTS ===');
            console.log('File Name:', file.name);
            console.log('File Size:', file.size, 'bytes');
            console.log('Extracted Text Length:', text.length, 'characters');
            console.log('Full Extracted Text:');
            console.log(text);
            console.log('=== END OF FILE CONTENTS ===');
          })
          .catch(err => {
            console.error('Error extracting DOCX text:', err);
            setFileContents('Unable to extract text from DOCX. The file will be processed during audit.');
          });
      } else {
        // For other file types
        setFileContents('Preview not available for this file type. The file will be processed during audit.');
        console.log('=== UNSUPPORTED FILE TYPE ===');
        console.log('File Name:', file.name);
        console.log('File Type:', file.type);
        console.log('File Size:', file.size, 'bytes');
        console.log('=== END ===');
      }
    }
  }, [documentName]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md', '.markdown'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  // Handle regulation selection
  const toggleRegulation = (value) => {
    if (value === 'ALL') {
      setSelectedRegulations(['ALL']);
    } else {
      let newSelection = selectedRegulations.filter(r => r !== 'ALL');
      
      if (newSelection.includes(value)) {
        newSelection = newSelection.filter(r => r !== value);
      } else {
        newSelection.push(value);
      }
      
      if (newSelection.length === 0) {
        newSelection = ['ALL'];
      }
      
      setSelectedRegulations(newSelection);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!documentName.trim()) {
      errors.documentName = 'Document name is required';
    }

    if (uploadMode === 'file' && !uploadedFile) {
      errors.file = 'Please upload a file';
    }

    if (uploadMode === 'text' && !textContent.trim()) {
      errors.text = 'Please enter document text';
    }

    if (uploadMode === 'text' && textContent.trim().length < 100) {
      errors.text = 'Document text must be at least 100 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Simulate progress updates
  const updateProgress = async (stage, duration) => {
    const messages = {
      reading: 'Reading document...',
      mapping: 'Mapping regulations...',
      detecting: 'Detecting risks...',
      generating: 'Generating report...'
    };

    setProgressMessage(messages[stage]);
    
    const steps = 10;
    const increment = 25 / steps;
    
    for (let i = 0; i < steps; i++) {
      await new Promise(resolve => setTimeout(resolve, duration / steps));
      setProgress(prev => Math.min(prev + increment, 100));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setStartTime(Date.now());
    setElapsedTime(0);

    // Start timer to update elapsed time
    const timerInterval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - Date.now()) / 1000));
    }, 1000);

    try {
      const documentText = uploadMode === 'file' ? fileContents : textContent;

      // Validate document text is available
      if (!documentText || documentText === 'Loading preview...' || documentText.startsWith('Unable to extract')) {
        throw new Error('Document text not available. Please wait for file processing to complete.');
      }

      // Show initial progress
      setProgressMessage('Preparing document for audit...');
      setProgress(10);

      // Call backend API - this will take 3+ minutes
      const apiStartTime = Date.now();
      setProgressMessage('Calling ICA API for compliance audit...');
      setProgress(20);

      // Update timer to show actual elapsed time
      clearInterval(timerInterval);
      const actualTimerInterval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - apiStartTime) / 1000));
      }, 1000);

      console.log('\n=== SUBMITTING AUDIT REQUEST ===');
      console.log('Document Name:', documentName);
      console.log('Document Type:', documentType);
      console.log('Document Text Length:', documentText.length);
      console.log('Start Time:', new Date(apiStartTime).toISOString());
      
      const auditResponse = await auditService.submitAuditDocument(
        documentText,
        documentName,
        documentType.toLowerCase().replace('_', '-')
      );

      clearInterval(actualTimerInterval);
      const totalTime = Math.floor((Date.now() - apiStartTime) / 1000);

      console.log('\n=== AUDIT RESPONSE RECEIVED ===');
      console.log('Success:', auditResponse.success);
      console.log('Total Time:', totalTime, 'seconds');
      console.log('Response:', auditResponse.data);

      if (!auditResponse.success) {
        throw new Error(auditResponse.error || 'Audit failed');
      }

      setProgressMessage(`Audit complete! (${totalTime}s)`);
      setProgress(100);
      
      // Load the audit result into context
      loadAudit(auditResponse.data);
      console.log('Audit loaded into context successfully!');
      
      // Reset form after a short delay
      setTimeout(() => {
        resetForm();
        setStartTime(null);
        setElapsedTime(0);
      }, 2000);

    } catch (err) {
      console.error('\n=== AUDIT ERROR ===');
      console.error('Error:', err.message);
      console.error('Stack:', err.stack);
      setError(err.message || 'Failed to process audit. Please try again.');
      setProgress(0);
      setProgressMessage('');
      setStartTime(null);
      setElapsedTime(0);
      clearInterval(timerInterval);
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset form
  const resetForm = useCallback(() => {
    setUploadedFile(null);
    setFileContents('');
    setTextContent('');
    setDocumentName('');
    setDocumentType('SECURITY_POLICY');
    setSelectedRegulations(['ALL']);
    setProgress(0);
    setProgressMessage('');
    setError(null);
    setValidationErrors({});
    setShowPreview(false);
    setStartTime(null);
    setElapsedTime(0);
  }, []);

  // Remove uploaded file and reset form to defaults
  const removeFile = () => {
    setUploadedFile(null);
    setFileContents('');
    setDocumentName('');
    setDocumentType('SECURITY_POLICY');
    setSelectedRegulations(['ALL']);
    setValidationErrors(prev => ({ ...prev, file: undefined }));
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Upload Mode Toggle */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-carbon-gray-10 mb-4">Upload Method</h3>
        <div className="flex gap-4">
          <button
            onClick={() => setUploadMode('file')}
            disabled={isProcessing}
            className={`flex-1 py-3 rounded-lg font-medium transition-all duration-200 ${
              uploadMode === 'file'
                ? 'bg-carbon-blue-60 text-white shadow-lg ring-2 ring-carbon-blue-40 ring-offset-2 ring-offset-carbon-gray-100'
                : 'bg-carbon-gray-80 text-carbon-gray-30 hover:bg-carbon-gray-70 hover:ring-2 hover:ring-carbon-gray-60 hover:ring-offset-2 hover:ring-offset-carbon-gray-100'
            } focus:outline-none focus:ring-2 focus:ring-carbon-blue-40 focus:ring-offset-2 focus:ring-offset-carbon-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Upload className="w-5 h-5 inline-block mr-2" />
            Upload File
          </button>
          <button
            onClick={() => setUploadMode('text')}
            disabled={isProcessing}
            className={`flex-1 py-3 rounded-lg font-medium transition-all duration-200 ${
              uploadMode === 'text'
                ? 'bg-carbon-blue-60 text-white shadow-lg ring-2 ring-carbon-blue-40 ring-offset-2 ring-offset-carbon-gray-100'
                : 'bg-carbon-gray-80 text-carbon-gray-30 hover:bg-carbon-gray-70 hover:ring-2 hover:ring-carbon-gray-60 hover:ring-offset-2 hover:ring-offset-carbon-gray-100'
            } focus:outline-none focus:ring-2 focus:ring-carbon-blue-40 focus:ring-offset-2 focus:ring-offset-carbon-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <FileText className="w-5 h-5 inline-block mr-2" />
            Paste Text
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload / Text Input */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-carbon-gray-10 mb-4">
            {uploadMode === 'file'
              ? (uploadedFile ? 'Uploaded Document' : 'Document Upload')
              : 'Document Text'
            }
          </h3>

          {uploadMode === 'file' ? (
            <>
              {!uploadedFile ? (
                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-200
                    ${isDragActive 
                      ? 'border-carbon-blue-60 bg-carbon-blue-60 bg-opacity-10' 
                      : validationErrors.file
                      ? 'border-carbon-red-60 bg-carbon-red-60 bg-opacity-5'
                      : 'border-carbon-gray-70 hover:border-carbon-gray-60'
                    }
                    ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-16 h-16 text-carbon-gray-50 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-carbon-gray-10 mb-2">
                    {isDragActive ? 'Drop your file here' : 'Drag & drop your document'}
                  </p>
                  <p className="text-sm text-carbon-gray-40 mb-4">or click to browse</p>
                  <div className="flex gap-2 justify-center text-xs text-carbon-gray-50">
                    <span className="px-2 py-1 bg-carbon-gray-80 rounded">PDF</span>
                    <span className="px-2 py-1 bg-carbon-gray-80 rounded">DOCX</span>
                    <span className="px-2 py-1 bg-carbon-gray-80 rounded">TXT</span>
                    <span className="px-2 py-1 bg-carbon-gray-80 rounded">MD</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="border-2 border-carbon-green-60 bg-carbon-green-60 bg-opacity-10 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <File className="w-8 h-8 text-carbon-green-60 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-carbon-gray-10">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-carbon-gray-40 mt-1">
                            {formatFileSize(uploadedFile.size)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowPreview(!showPreview)}
                          disabled={isProcessing}
                          className="p-2 hover:bg-carbon-gray-80 rounded transition-colors disabled:opacity-50 flex items-center gap-1 text-xs text-carbon-gray-30"
                          title={showPreview ? 'Hide preview' : 'Show preview'}
                        >
                          {showPreview ? (
                            <>
                              <EyeOff className="w-4 h-4" />
                              <span>Hide</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              <span>Preview</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={removeFile}
                          disabled={isProcessing}
                          className="p-1 hover:bg-carbon-gray-80 rounded transition-colors disabled:opacity-50"
                          title="Remove file"
                        >
                          <X className="w-5 h-5 text-carbon-gray-40" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* File Content Preview */}
                  {showPreview && fileContents && (
                    <div className="mt-4 border-2 border-carbon-gray-70 rounded-lg overflow-hidden">
                      <div className="bg-carbon-gray-80 px-4 py-2 flex items-center justify-between border-b border-carbon-gray-70">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-carbon-blue-40" />
                          <span className="text-sm font-medium text-carbon-gray-10">File Contents Preview</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowPreview(false)}
                          className="p-1 hover:bg-carbon-gray-70 rounded transition-colors"
                          title="Close preview"
                        >
                          <ChevronUp className="w-4 h-4 text-carbon-gray-40" />
                        </button>
                      </div>
                      <div className="bg-carbon-gray-90 p-4 max-h-96 overflow-y-auto">
                        {fileContents === 'Loading preview...' ? (
                          <div className="text-center py-8">
                            <Loader2 className="w-12 h-12 text-carbon-blue-40 mx-auto mb-3 animate-spin" />
                            <p className="text-sm text-carbon-gray-40">
                              Extracting text from file...
                            </p>
                          </div>
                        ) : fileContents.startsWith('Unable to extract') || fileContents.startsWith('Error extracting') ? (
                          <div className="text-center py-8">
                            <AlertCircle className="w-12 h-12 text-carbon-gray-50 mx-auto mb-3" />
                            <p className="text-sm text-carbon-gray-40">
                              {fileContents}
                            </p>
                          </div>
                        ) : (
                          <pre className="text-xs text-carbon-gray-30 font-mono whitespace-pre-wrap break-words">
                            {fileContents}
                          </pre>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
              {validationErrors.file && (
                <p className="text-sm mt-2 flex items-center gap-1" style={{ color: '#da1e28' }}>
                  <AlertCircle className="w-4 h-4" />
                  {validationErrors.file}
                </p>
              )}
            </>
          ) : (
            <>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Paste your policy document text here..."
                disabled={isProcessing}
                className={`
                  w-full h-64 input-field resize-none
                  ${validationErrors.text ? 'border-carbon-red-60' : ''}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-carbon-gray-40">
                  {textContent.length} characters
                </p>
                {validationErrors.text && (
                  <p className="text-sm flex items-center gap-1" style={{ color: '#da1e28' }}>
                    <AlertCircle className="w-4 h-4" />
                    {validationErrors.text}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Document Metadata */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-carbon-gray-10 mb-4">Document Information</h3>
          
          <div className="space-y-4">
            {/* Document Name */}
            <div>
              <label className="block text-sm font-medium text-carbon-gray-30 mb-2">
                Document Name *
              </label>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="e.g., Corporate Privacy Policy v2.3"
                disabled={isProcessing}
                className={`
                  w-full input-field
                  ${validationErrors.documentName ? 'border-carbon-red-60' : ''}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              />
              {validationErrors.documentName && (
                <p className="text-sm mt-1 flex items-center gap-1" style={{ color: '#da1e28' }}>
                  <AlertCircle className="w-4 h-4" />
                  {validationErrors.documentName}
                </p>
              )}
            </div>

            {/* Document Type */}
            <div>
              <label className="block text-sm font-medium text-carbon-gray-30 mb-2">
                Document Type *
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                disabled={isProcessing}
                className="w-full input-field disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Regulation Selector */}
            <div>
              <label className="block text-sm font-medium text-carbon-gray-30 mb-2">
                Regulations to Check *
              </label>
              <div className="flex flex-wrap gap-2">
                {regulations.map(reg => (
                  <button
                    key={reg.value}
                    type="button"
                    onClick={() => toggleRegulation(reg.value)}
                    disabled={isProcessing}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-all duration-200
                      ${selectedRegulations.includes(reg.value)
                        ? 'bg-carbon-blue-60 text-white shadow-lg ring-2 ring-carbon-blue-40 ring-offset-2 ring-offset-carbon-gray-90'
                        : 'bg-carbon-gray-80 text-carbon-gray-30 hover:bg-carbon-gray-70 hover:ring-2 hover:ring-carbon-gray-60 hover:ring-offset-2 hover:ring-offset-carbon-gray-90'
                      }
                      focus:outline-none focus:ring-2 focus:ring-carbon-blue-40 focus:ring-offset-2 focus:ring-offset-carbon-gray-90
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    {reg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {isProcessing && (
          <div className="card p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-carbon-gray-30">{progressMessage}</span>
                  {elapsedTime > 0 && (
                    <span className="text-carbon-blue-40 font-mono">
                      {Math.floor(elapsedTime / 60)}:{String(elapsedTime % 60).padStart(2, '0')}
                    </span>
                  )}
                </div>
                <span className="text-carbon-blue-40 font-semibold">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-3 bg-carbon-gray-80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-carbon-blue-60 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                >
                  <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="card p-4 bg-carbon-red-70 bg-opacity-10 border-2 border-carbon-red-60">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-carbon-red-60 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-carbon-red-60">Error</p>
                <p className="text-sm text-carbon-red-50 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Processing Audit...
            </>
          ) : (
            <>
              <CheckCircle className="w-6 h-6" />
              Run Compliance Audit
            </>
          )}
        </button>
      </form>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default DocumentUploadForm;

// Made with Bob
