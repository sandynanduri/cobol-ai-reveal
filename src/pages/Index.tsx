
import React, { useState } from 'react';
import FileUploadZone from '@/components/FileUploadZone';
import AnalysisResults from '@/components/AnalysisResults';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FileCode, Upload, Zap, Sparkles, HelpCircle } from 'lucide-react';

export interface UploadedFile {
  file: File;
  id: string;
  status: 'pending' | 'analyzing' | 'completed' | 'error';
}

export interface AnalysisResult {
  businessLogic: string;
  pseudoCode: string;
  fileName: string;
}

const Index = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFilesAdded = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      file,
      id: `${file.name}-${Date.now()}`,
      status: 'pending'
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const analyzeFiles = async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsAnalyzing(true);
    
    // Update all files to analyzing status
    setUploadedFiles(prev => 
      prev.map(f => ({ ...f, status: 'analyzing' as const }))
    );

    try {
      // Simulate AI analysis with realistic delay
      const results: AnalysisResult[] = [];
      
      for (const uploadedFile of uploadedFiles) {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock analysis results
        const businessLogic = `Business Logic Analysis for ${uploadedFile.file.name}:

This COBOL program appears to handle customer account management operations. The main business functions include:

• Customer Registration: Validates customer information including name, address, and contact details
• Account Creation: Sets up new customer accounts with initial balance validation
• Transaction Processing: Handles deposits, withdrawals, and balance inquiries
• Interest Calculation: Computes monthly interest based on account type and balance
• Report Generation: Creates monthly statements and transaction summaries

Key Business Rules:
- Minimum account balance: $100.00
- Maximum daily withdrawal: $1,000.00
- Interest rates vary by account type (Savings: 2.5%, Checking: 0.1%)
- Overdraft protection available for premium accounts only

Data Validation:
- Customer ID must be 8-digit numeric
- Account numbers follow specific format: XX-XXXXXX-X
- All monetary amounts validated for decimal precision`;

        const pseudoCode = `PROGRAM CustomerAccountManager
BEGIN
    DECLARE customer_record
        customer_id: NUMERIC(8)
        customer_name: STRING(50)
        account_balance: DECIMAL(10,2)
        account_type: STRING(10)
    END_DECLARE

    PROCEDURE validate_customer_data(customer_record)
        IF customer_id IS NOT NUMERIC OR LENGTH(customer_id) != 8 THEN
            RETURN ERROR_INVALID_ID
        END_IF
        
        IF customer_name IS EMPTY THEN
            RETURN ERROR_MISSING_NAME
        END_IF
        
        IF account_balance < 100.00 THEN
            RETURN ERROR_INSUFFICIENT_BALANCE
        END_IF
        
        RETURN SUCCESS
    END_PROCEDURE

    PROCEDURE process_transaction(transaction_type, amount)
        SWITCH transaction_type
            CASE "DEPOSIT":
                account_balance = account_balance + amount
                CALL update_account_record()
            CASE "WITHDRAWAL":
                IF amount > 1000.00 THEN
                    RETURN ERROR_LIMIT_EXCEEDED
                END_IF
                IF account_balance - amount < 0 THEN
                    RETURN ERROR_INSUFFICIENT_FUNDS
                END_IF
                account_balance = account_balance - amount
                CALL update_account_record()
            CASE "INQUIRY":
                RETURN account_balance
        END_SWITCH
    END_PROCEDURE

    MAIN
        read_customer_files()
        WHILE NOT end_of_file
            CALL validate_customer_data(customer_record)
            CALL process_transaction(transaction_type, amount)
            CALL generate_statement()
        END_WHILE
    END_MAIN
END_PROGRAM`;

        results.push({
          businessLogic,
          pseudoCode,
          fileName: uploadedFile.file.name
        });
      }
      
      setAnalysisResults(results);
      
      // Update files to completed status
      setUploadedFiles(prev => 
        prev.map(f => ({ ...f, status: 'completed' as const }))
      );
      
    } catch (error) {
      console.error('Analysis failed:', error);
      setUploadedFiles(prev => 
        prev.map(f => ({ ...f, status: 'error' as const }))
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAll = () => {
    setUploadedFiles([]);
    setAnalysisResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements inspired by the reference image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main geometric pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/20 via-blue-600/20 to-indigo-700/20"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Subtle mesh pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #8b5cf6 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #3b82f6 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Header */}
      <div className="relative border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-2xl shadow-purple-500/25">
              <FileCode className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                COBOL Analyzer
              </h1>
              <p className="text-lg text-gray-300 mt-1">
                Transform legacy COBOL code into modern business logic and pseudo code
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10">
                  <HelpCircle className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-sm p-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white">
                <div className="space-y-2">
                  <h4 className="font-semibold">How to use COBOL Analyzer:</h4>
                  <ol className="text-sm space-y-1 list-decimal list-inside">
                    <li>Upload COBOL files (.cbl, .cob, .cobol)</li>
                    <li>Click "Analyze Files" to start processing</li>
                    <li>View extracted business logic and pseudo code</li>
                  </ol>
                  <p className="text-xs text-gray-300 mt-2">
                    Supported formats: .cbl, .cob, .cobol
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="relative container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                <Upload className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Upload Files</h2>
            </div>

            <Card className="p-6 border-0 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
              <FileUploadZone 
                onFilesAdded={handleFilesAdded}
                uploadedFiles={uploadedFiles}
                onRemoveFile={removeFile}
              />
              
              <div className="flex gap-4 mt-6">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex-1">
                      <Button 
                        onClick={analyzeFiles}
                        disabled={uploadedFiles.length === 0 || isAnalyzing}
                        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-xl shadow-purple-500/25 hover:shadow-2xl transition-all duration-300 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Sparkles className="h-5 w-5 mr-2" />
                        {isAnalyzing ? 'Analyzing with AI...' : 'Analyze Files'}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {uploadedFiles.length === 0 
                      ? "Upload COBOL files first" 
                      : "Start analyzing COBOL files"
                    }
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      onClick={clearAll}
                      disabled={uploadedFiles.length === 0}
                      className="h-12 px-6 border-2 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-purple-300 backdrop-blur-sm transition-all duration-300 disabled:opacity-50"
                    >
                      Clear All
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Remove all uploaded files
                  </TooltipContent>
                </Tooltip>
              </div>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Analysis Results</h2>
            </div>

            <AnalysisResults 
              results={analysisResults}
              isAnalyzing={isAnalyzing}
              uploadedFiles={uploadedFiles}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
