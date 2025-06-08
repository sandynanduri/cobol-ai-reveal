
import React, { useCallback, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
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
        return <File className="h-4 w-4 text-muted-foreground" />;
      case 'analyzing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
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
    <div className="space-y-4">
      {/* Drop Zone */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors",
          isDragOver ? "border-primary bg-primary/5" : "border-border"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-8 text-center">
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Drop COBOL files here</h3>
          <p className="text-muted-foreground mb-4">
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
          <Button asChild variant="outline">
            <label htmlFor="file-input" className="cursor-pointer">
              Browse Files
            </label>
          </Button>
        </div>
      </Card>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <Card className="p-4">
          <h4 className="font-medium mb-3">Uploaded Files ({uploadedFiles.length})</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {uploadedFiles.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getStatusIcon(uploadedFile.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {uploadedFile.file.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(uploadedFile.file.size)}</span>
                      <span>•</span>
                      <span>{getStatusText(uploadedFile.status)}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFile(uploadedFile.id)}
                  disabled={uploadedFile.status === 'analyzing'}
                  className="h-8 w-8 p-0"
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
