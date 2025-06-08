import React, { useCallback, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UploadedFile } from '@/pages/Index';

interface FileUploadZoneProps {
  onFilesAdded: (files: File[]) => void;
  uploadedFiles: UploadedFile[];
  onRemoveFile: (id: string) => void;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFilesAdded,
  uploadedFiles,
  onRemoveFile
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.name.toLowerCase().endsWith('.cbl') || 
      file.name.toLowerCase().endsWith('.cob') ||
      file.name.toLowerCase().endsWith('.cobol')
    );
    
    if (files.length > 0) {
      onFilesAdded(files);
    }
  }, [onFilesAdded]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => 
      file.name.toLowerCase().endsWith('.cbl') || 
      file.name.toLowerCase().endsWith('.cob') ||
      file.name.toLowerCase().endsWith('.cobol')
    );
    
    if (files.length > 0) {
      onFilesAdded(files);
    }
    
    // Reset input
    e.target.value = '';
  }, [onFilesAdded]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'pending':
        return <File className="h-4 w-4 text-blue-500" />;
      case 'analyzing':
        return <Loader2 className="h-4 w-4 text-purple-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = (status: UploadedFile['status']) => {
    switch (status) {
      case 'pending':
        return 'Ready';
      case 'analyzing':
        return 'Analyzing...';
      case 'completed':
        return 'Completed';
      case 'error':
        return 'Error';
    }
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <Card
        className={cn(
          "border-2 border-dashed transition-all duration-300 cursor-pointer group",
          isDragOver 
            ? "border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 scale-[1.02] shadow-lg" 
            : "border-gray-300 hover:border-blue-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-12 text-center">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-fit mx-auto">
              <Cloud className="h-12 w-12 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Drop COBOL files here</h3>
          <p className="text-gray-600 mb-6 text-lg">
            Supports .cbl, .cob, and .cobol file formats
          </p>
          <input
            type="file"
            multiple
            accept=".cbl,.cob,.cobol"
            onChange={handleFileInput}
            className="hidden"
            id="file-input"
          />
          <Button asChild variant="outline" size="lg" className="border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
            <label htmlFor="file-input" className="cursor-pointer">
              <Upload className="h-5 w-5 mr-2" />
              Browse Files
            </label>
          </Button>
        </div>
      </Card>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-white to-gray-50 shadow-lg">
          <h4 className="font-bold text-lg mb-4 text-gray-900">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {uploadedFiles.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {getStatusIcon(uploadedFile.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-gray-900">
                      {uploadedFile.file.name}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span>{formatFileSize(uploadedFile.file.size)}</span>
                      <span>•</span>
                      <span className="font-medium">{getStatusText(uploadedFile.status)}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFile(uploadedFile.id)}
                  disabled={uploadedFile.status === 'analyzing'}
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default FileUploadZone;
