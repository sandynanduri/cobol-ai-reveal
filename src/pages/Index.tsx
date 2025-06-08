
import React, { useState } from 'react';
import FileUploadZone from '@/components/FileUploadZone';
import AnalysisResults from '@/components/AnalysisResults';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileCode, Upload, Zap } from 'lucide-react';

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
        READ_customer_files()
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileCode className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">COBOL Analyzer</h1>
              <p className="text-muted-foreground">Upload COBOL files to extract business logic and generate pseudo code</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Upload COBOL Files</h2>
              </div>
              
              <FileUploadZone 
                onFilesAdded={handleFilesAdded}
                uploadedFiles={uploadedFiles}
                onRemoveFile={removeFile}
              />
              
              <div className="flex gap-3 mt-6">
                <Button 
                  onClick={analyzeFiles}
                  disabled={uploadedFiles.length === 0 || isAnalyzing}
                  className="flex-1"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Files'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={clearAll}
                  disabled={uploadedFiles.length === 0}
                >
                  Clear All
                </Button>
              </div>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <AnalysisResults 
              results={analysisResults}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
