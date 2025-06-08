
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { FileText, Code, Loader2, FileCode } from 'lucide-react';
import { AnalysisResult } from '@/pages/Index';

interface AnalysisResultsProps {
  results: AnalysisResult[];
  isAnalyzing: boolean;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  results,
  isAnalyzing
}) => {
  if (isAnalyzing) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium mb-2">Analyzing COBOL Files</h3>
          <p className="text-muted-foreground">
            Our AI is processing your files to extract business logic and generate pseudo code...
          </p>
        </div>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <FileCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Analysis Results</h3>
          <p className="text-muted-foreground">
            Upload and analyze COBOL files to see business logic and pseudo code here.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Analysis Results</h2>
        <Badge variant="secondary">{results.length} files</Badge>
      </div>

      {results.map((result, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/20">
            <h3 className="font-medium text-sm">{result.fileName}</h3>
          </div>
          
          <Tabs defaultValue="business-logic" className="w-full">
            <div className="px-4 pt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="business-logic" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Business Logic
                </TabsTrigger>
                <TabsTrigger value="pseudo-code" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Pseudo Code
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="business-logic" className="p-4 pt-2">
              <ScrollArea className="h-80 w-full rounded-md border p-4">
                <div className="prose prose-sm max-w-none text-foreground">
                  <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                    {result.businessLogic}
                  </pre>
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="pseudo-code" className="p-4 pt-2">
              <ScrollArea className="h-80 w-full rounded-md border">
                <div className="p-4 bg-muted/30">
                  <pre className="text-sm font-mono leading-relaxed text-foreground">
                    <code>{result.pseudoCode}</code>
                  </pre>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>
      ))}
    </div>
  );
};

export default AnalysisResults;
