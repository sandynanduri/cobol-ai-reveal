
import React, { useCallback, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
        return <File className="h-4 w-4 text-blue-400" />;
      case 'analyzing':
        return <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
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
          "border-2 border-dashed transition-all duration-300 cursor-pointer group relative overflow-hidden",
          isDragOver 
            ? "border-purple-400 bg-gradient-to-br from-purple-500/30 to-indigo-500/30 scale-[1.02] shadow-2xl shadow-purple-500/40" 
            : "border-white/30 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-indigo-500/10 bg-white/5 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/20"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Glow effect for drag state */}
        {isDragOver && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-500/20 blur-xl"></div>
        )}
        
        <div className="relative p-8 text-center">
          <div className="mb-6 relative">
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full blur-lg transition-opacity",
              isDragOver ? "opacity-50" : "opacity-30 group-hover:opacity-40"
            )}></div>
            <div className="relative p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full w-fit mx-auto shadow-2xl">
              <Cloud className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">
            {uploadedFiles.length === 0 
              ? "Drop COBOL files here to begin analysis" 
              : "Drop more COBOL files here"
            }
          </h3>
          <p className="text-gray-300 mb-6">
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
          <Button asChild variant="outline" size="lg" className="border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-purple-300 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
            <label htmlFor="file-input" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Browse Files
            </label>
          </Button>
        </div>
      </Card>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <Card className="p-6 bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20">
          <h4 className="font-semibold text-lg mb-4 text-white flex items-center gap-2">
            <File className="h-5 w-5" />
            Uploaded Files ({uploadedFiles.length})
          </h4>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {uploadedFiles.map((uploadedFile, index) => (
              <React.Fragment key={uploadedFile.id}>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/10 shadow-lg border border-white/10 hover:bg-white/20 hover:shadow-xl transition-all backdrop-blur-sm group">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {getStatusIcon(uploadedFile.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate text-white">
                        {uploadedFile.file.name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-300 mt-1">
                        <span>{formatFileSize(uploadedFile.file.size)}</span>
                        <span>•</span>
                        <span className={cn(
                          "font-medium px-2 py-1 rounded-full text-xs",
                          uploadedFile.status === 'completed' && "bg-green-500/20 text-green-300",
                          uploadedFile.status === 'analyzing' && "bg-purple-500/20 text-purple-300",
                          uploadedFile.status === 'pending' && "bg-blue-500/20 text-blue-300",
                          uploadedFile.status === 'error' && "bg-red-500/20 text-red-300"
                        )}>
                          {getStatusText(uploadedFile.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFile(uploadedFile.id)}
                    disabled={uploadedFile.status === 'analyzing'}
                    className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-300 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Separator between files */}
                {index < uploadedFiles.length - 1 && (
                  <Separator className="bg-white/10" />
                )}
              </React.Fragment>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default FileUploadZone;
