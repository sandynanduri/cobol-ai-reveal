
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FileText, Code, Loader2, Brain, Copy, Download, CheckCircle, Send, FileCode } from 'lucide-react';
import { AnalysisResult } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResultsProps {
  results: AnalysisResult[];
  isAnalyzing: boolean;
  uploadedFiles?: any[];
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  results,
  isAnalyzing,
  uploadedFiles = []
}) => {
  const { toast } = useToast();
  const [chatMessage, setChatMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${type} has been copied to your clipboard.`,
    });
  };

  const downloadText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || uploadedFiles.length === 0) return;
    
    setIsSendingMessage(true);
    
    try {
      // Mock API call to LLM - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message sent",
        description: "Your message has been sent to the AI assistant.",
      });
      
      setChatMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            Our advanced AI is processing your files to extract business logic and generate pseudo code...
          </p>
          <div className="flex justify-center">
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
      <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden">
        {/* Chat Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-900/50 to-indigo-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
              <FileCode className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Ready for Analysis</h3>
          </div>
        </div>

        {/* Chat Content Area */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="relative mb-4">
              <div className="p-3 rounded-full bg-white/10 w-fit mx-auto">
                <FileCode className="h-8 w-8 text-gray-300" />
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Once files are analyzed, business logic and pseudo code will appear here.
            </p>
            <div className="text-sm text-gray-400 space-y-1">
              <p>• Upload COBOL files using the dropzone</p>
              <p>• Click "Analyze Files" to start processing</p>
              <p>• View results in organized tabs</p>
            </div>
          </div>

          {/* Chat Input */}
          <div className="relative">
            <Textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your COBOL files... (Press Enter to send, Shift+Enter for new line)"
              className="min-h-[100px] bg-black/30 border-white/20 text-white placeholder:text-gray-400 resize-none pr-12"
              disabled={isSendingMessage}
            />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim() || uploadedFiles.length === 0 || isSendingMessage}
                  size="sm"
                  className="absolute bottom-3 right-3 h-8 w-8 p-0 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
                >
                  {isSendingMessage ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {uploadedFiles.length === 0 
                  ? "Upload files first" 
                  : !chatMessage.trim() 
                  ? "Type a message" 
                  : "Send message (Enter)"
                }
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="text-xs text-gray-400 mt-2">
            Example: "What are the main business functions in these files?" or "Generate pseudo code for the customer validation logic"
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Analysis Complete</h3>
            <p className="text-sm text-gray-300">{results.length} files processed</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1 bg-green-500/20 text-green-300 border-green-500/20">
          {results.length} files
        </Badge>
      </div>

      {results.map((result, index) => (
        <Card key={index} className="overflow-hidden border-0 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
          <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-900/50 to-indigo-900/50">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-lg text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {result.fileName}
              </h4>
            </div>
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
              <div className="relative">
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(result.businessLogic, 'Business Logic')}
                        className="h-8 w-8 p-0 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy business logic</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadText(result.businessLogic, `${result.fileName}_business_logic.txt`)}
                        className="h-8 w-8 p-0 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download business logic</TooltipContent>
                  </Tooltip>
                </div>
                
                <ScrollArea className="h-96 w-full rounded-lg border border-white/20 bg-black/30 backdrop-blur-sm">
                  <div className="p-6 pr-16">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-200 font-mono">
                      {result.businessLogic}
                    </pre>
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
            
            <TabsContent value="pseudo-code" className="p-6 pt-4">
              <div className="relative">
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(result.pseudoCode, 'Pseudo Code')}
                        className="h-8 w-8 p-0 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy pseudo code</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadText(result.pseudoCode, `${result.fileName}_pseudo_code.txt`)}
                        className="h-8 w-8 p-0 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download pseudo code</TooltipContent>
                  </Tooltip>
                </div>
                
                <ScrollArea className="h-96 w-full rounded-lg border border-white/20">
                  <div className="p-6 pr-16 bg-gradient-to-br from-slate-900 to-black">
                    <pre className="text-sm leading-relaxed text-green-400 font-mono">
                      <code>{result.pseudoCode}</code>
                    </pre>
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      ))}
    </div>
  );
};

export default AnalysisResults;
