
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { FileText, Code, Loader2, FileCode, Sparkles, Brain } from 'lucide-react';
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
      <Card className="p-12 border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <div className="relative p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-fit mx-auto">
              <Brain className="h-12 w-12 text-white animate-pulse" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-900">AI Analyzing COBOL Files</h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our advanced AI is processing your files to extract business logic and generate pseudo code...
          </p>
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="p-12 border-0 shadow-xl bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="text-center">
          <div className="mb-6">
            <div className="p-4 bg-gradient-to-br from-gray-400 to-slate-500 rounded-full w-fit mx-auto opacity-60">
              <FileCode className="h-12 w-12 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-900">No Analysis Results</h3>
          <p className="text-lg text-gray-600">
            Upload and analyze COBOL files to see business logic and pseudo code here.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
        <Badge variant="secondary" className="text-lg px-3 py-1">{results.length} files</Badge>
      </div>

      {results.map((result, index) => (
        <Card key={index} className="overflow-hidden border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-gray-50">
            <h3 className="font-bold text-lg text-gray-900">{result.fileName}</h3>
          </div>
          
          <Tabs defaultValue="business-logic" className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger value="business-logic" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <FileText className="h-4 w-4" />
                  Business Logic
                </TabsTrigger>
                <TabsTrigger value="pseudo-code" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Code className="h-4 w-4" />
                  Pseudo Code
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="business-logic" className="p-6 pt-4">
              <ScrollArea className="h-96 w-full rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50">
                <div className="p-6">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 font-mono">
                    {result.businessLogic}
                  </pre>
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="pseudo-code" className="p-6 pt-4">
              <ScrollArea className="h-96 w-full rounded-lg border border-gray-200">
                <div className="p-6 bg-gradient-to-br from-slate-900 to-gray-900">
                  <pre className="text-sm leading-relaxed text-green-400 font-mono">
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
