
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
      <Card className="p-12 border-0 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full blur-lg opacity-40 animate-pulse"></div>
            <div className="relative p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full w-fit mx-auto shadow-2xl">
              <Brain className="h-12 w-12 text-white animate-pulse" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-white">AI Analyzing COBOL Files</h3>
          <p className="text-lg text-gray-300 leading-relaxed">
            Our advanced AI is processing your files to extract business logic and generate pseudo code...
          </p>
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="p-12 border-0 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
        <div className="text-center">
          <div className="mb-6">
            <div className="p-4 bg-gradient-to-br from-gray-600 to-slate-700 rounded-full w-fit mx-auto opacity-80 shadow-xl">
              <FileCode className="h-12 w-12 text-gray-300" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-white">No Analysis Results</h3>
          <p className="text-lg text-gray-300">
            Upload and analyze COBOL files to see business logic and pseudo code here.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
        <Badge variant="secondary" className="text-lg px-3 py-1 bg-white/20 text-white border-white/20">{results.length} files</Badge>
      </div>

      {results.map((result, index) => (
        <Card key={index} className="overflow-hidden border-0 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
          <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-900/50 to-indigo-900/50">
            <h3 className="font-bold text-lg text-white">{result.fileName}</h3>
          </div>
          
          <Tabs defaultValue="business-logic" className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-2 bg-black/30 border border-white/10">
                <TabsTrigger value="business-logic" className="flex items-center gap-2 text-gray-300 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-sm">
                  <FileText className="h-4 w-4" />
                  Business Logic
                </TabsTrigger>
                <TabsTrigger value="pseudo-code" className="flex items-center gap-2 text-gray-300 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-sm">
                  <Code className="h-4 w-4" />
                  Pseudo Code
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="business-logic" className="p-6 pt-4">
              <ScrollArea className="h-96 w-full rounded-lg border border-white/20 bg-black/30 backdrop-blur-sm">
                <div className="p-6">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-200 font-mono">
                    {result.businessLogic}
                  </pre>
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="pseudo-code" className="p-6 pt-4">
              <ScrollArea className="h-96 w-full rounded-lg border border-white/20">
                <div className="p-6 bg-gradient-to-br from-slate-900 to-black">
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
