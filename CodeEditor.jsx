import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Play, 
  Square, 
  Download, 
  Copy, 
  Check, 
  X, 
  FileText, 
  TestTube, 
  Shield, 
  GitBranch,
  Eye,
  EyeOff
} from 'lucide-react';

const CodeEditor = ({ 
  generatedCode, 
  onCodeApprove, 
  onCodeReject, 
  onRunTests,
  isGenerating = false 
}) => {
  const [selectedFile, setSelectedFile] = useState(0);
  const [isApplying, setIsApplying] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [securityScan, setSecurityScan] = useState(null);
  const [showDiff, setShowDiff] = useState(false);
  const [copied, setCopied] = useState(false);
  const editorRef = useRef(null);

  const getLanguageFromFilename = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap = {
      'py': 'python',
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'md': 'markdown',
      'yaml': 'yaml',
      'yml': 'yaml',
      'xml': 'xml',
      'sql': 'sql',
      'go': 'go',
      'rs': 'rust',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c'
    };
    return languageMap[ext] || 'text';
  };

  const runAutomatedTests = async () => {
    if (!generatedCode?.files?.length) return;
    
    setTestResults({ status: 'running', progress: 0 });
    
    // Simulate test execution with progress
    const testSteps = [
      { name: 'Syntax validation', duration: 500 },
      { name: 'Type checking', duration: 800 },
      { name: 'Unit tests', duration: 1200 },
      { name: 'Integration tests', duration: 1000 },
      { name: 'Coverage analysis', duration: 600 }
    ];
    
    let totalProgress = 0;
    const stepProgress = 100 / testSteps.length;
    
    for (const step of testSteps) {
      setTestResults(prev => ({ 
        ...prev, 
        currentStep: step.name,
        progress: totalProgress 
      }));
      
      await new Promise(resolve => setTimeout(resolve, step.duration));
      totalProgress += stepProgress;
    }
    
    // Final results
    setTestResults({
      status: 'completed',
      progress: 100,
      passed: 12,
      failed: 1,
      total: 13,
      coverage: 89.5,
      duration: 3.1,
      details: [
        { file: 'auth.test.js', tests: 8, passed: 8, failed: 0 },
        { file: 'utils.test.js', tests: 3, passed: 3, failed: 0 },
        { file: 'api.test.js', tests: 2, passed: 1, failed: 1 }
      ]
    });
  };

  const runSecurityScan = async () => {
    setSecurityScan({ status: 'running' });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSecurityScan({
      status: 'completed',
      issues: [
        {
          severity: 'medium',
          type: 'Hardcoded Secret',
          file: 'config.js',
          line: 15,
          description: 'Potential API key found in source code'
        }
      ],
      summary: {
        critical: 0,
        high: 0,
        medium: 1,
        low: 0,
        info: 2
      }
    });
  };

  const handleApprove = async () => {
    setIsApplying(true);
    try {
      await onCodeApprove(generatedCode);
    } finally {
      setIsApplying(false);
    }
  };

  const handleCopyCode = async () => {
    if (!generatedCode?.files?.[selectedFile]) return;
    
    try {
      await navigator.clipboard.writeText(generatedCode.files[selectedFile].content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownloadFile = () => {
    if (!generatedCode?.files?.[selectedFile]) return;
    
    const file = generatedCode.files[selectedFile];
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (generatedCode?.files?.length > 0) {
      runAutomatedTests();
      runSecurityScan();
    }
  }, [generatedCode]);

  if (isGenerating) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center h-96 space-y-4">
          <div className="animate-spin text-4xl">⚡</div>
          <div className="text-lg font-medium">Generating Code...</div>
          <div className="text-sm text-muted-foreground text-center max-w-md">
            Our AI agents are working together to create your feature. This usually takes 2-5 minutes.
          </div>
          <Progress value={65} className="w-64" />
        </CardContent>
      </Card>
    );
  }

  if (!generatedCode?.files?.length) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center h-96 text-muted-foreground space-y-4">
          <FileText className="w-16 h-16 opacity-50" />
          <div className="text-lg">No code generated yet</div>
          <div className="text-sm text-center max-w-md">
            Submit a feature request to see AI-generated code appear here with real-time testing and security analysis.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Generated Code</span>
              <Badge variant="outline">
                {generatedCode.files.length} file{generatedCode.files.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleCopyCode}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadFile}>
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowDiff(!showDiff)}>
                {showDiff ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                Diff
              </Button>
              <Button variant="outline" onClick={onCodeReject} disabled={isApplying}>
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button onClick={handleApprove} disabled={isApplying}>
                {isApplying ? (
                  <>
                    <div className="animate-spin w-4 h-4 mr-2">⏳</div>
                    Applying...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Approve & Apply
                  </>
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Test Results & Security */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TestTube className="w-5 h-5 mr-2" />
              Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {testResults?.status === 'running' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Running: {testResults.currentStep}</span>
                  <span className="text-sm">{Math.round(testResults.progress)}%</span>
                </div>
                <Progress value={testResults.progress} />
              </div>
            ) : testResults?.status === 'completed' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                                        <div className="text-2xl font-bold text-green-600">{testResults.passed}</div>
                    <div className="text-xs text-muted-foreground">Passed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{testResults.failed}</div>
                    <div className="text-xs text-muted-foreground">Failed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{testResults.coverage}%</div>
                    <div className="text-xs text-muted-foreground">Coverage</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {testResults.details.map((detail, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{detail.file}</span>
                      <Badge variant={detail.failed === 0 ? "default" : "destructive"}>
                        {detail.passed}/{detail.tests}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Completed in {testResults.duration}s
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                Tests will run automatically when code is generated
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Scan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Security Scan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {securityScan?.status === 'running' ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin text-2xl">🛡️</div>
                <span className="ml-2">Scanning for vulnerabilities...</span>
              </div>
            ) : securityScan?.status === 'completed' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div>
                    <div className="text-lg font-bold text-red-600">{securityScan.summary.critical}</div>
                    <div className="text-muted-foreground">Critical</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">{securityScan.summary.high}</div>
                    <div className="text-muted-foreground">High</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-yellow-600">{securityScan.summary.medium}</div>
                    <div className="text-muted-foreground">Medium</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">{securityScan.summary.low}</div>
                    <div className="text-muted-foreground">Low</div>
                  </div>
                </div>
                
                {securityScan.issues.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Issues Found:</div>
                    {securityScan.issues.map((issue, index) => (
                      <div key={index} className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{issue.type}</span>
                          <Badge variant="outline" className="text-xs">
                            {issue.severity}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {issue.file}:{issue.line}
                        </div>
                        <div className="text-xs">{issue.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                Security scan will run automatically
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Code Editor */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={selectedFile.toString()} onValueChange={(v) => setSelectedFile(parseInt(v))}>
            <div className="border-b">
              <TabsList className="h-auto p-0 bg-transparent">
                {generatedCode.files.map((file, index) => (
                  <TabsTrigger 
                    key={index} 
                    value={index.toString()}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
                  >
                    <div className="flex items-center space-x-2">
                      <span>{file.filename}</span>
                      <Badge variant="outline" className="text-xs">
                        {getLanguageFromFilename(file.filename)}
                      </Badge>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {generatedCode.files.map((file, index) => (
              <TabsContent key={index} value={index.toString()} className="m-0">
                <div className="relative">
                  <Editor
                    height="500px"
                    language={getLanguageFromFilename(file.filename)}
                    value={file.content}
                    theme="vs-dark"
                    onMount={(editor) => {
                      editorRef.current = editor;
                    }}
                    options={{
                      readOnly: true,
                      minimap: { enabled: true },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollbar: {
                        vertical: 'visible',
                        horizontal: 'visible'
                      },
                      folding: true,
                      wordWrap: 'on',
                      automaticLayout: true
                    }}
                  />
                  
                  {/* File Stats Overlay */}
                  <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {file.content.split('\n').length} lines
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Code Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GitBranch className="w-5 h-5 mr-2" />
            Code Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm font-medium">File Statistics</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold">{generatedCode.files.length}</div>
                  <div className="text-muted-foreground">Files</div>
                </div>
                <div>
                  <div className="font-semibold">
                    {generatedCode.files.reduce((acc, file) => acc + file.content.split('\n').length, 0)}
                  </div>
                  <div className="text-muted-foreground">Total Lines</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Language Breakdown</div>
              <div className="space-y-1">
                {Object.entries(
                  generatedCode.files.reduce((acc, file) => {
                    const lang = getLanguageFromFilename(file.filename);
                    acc[lang] = (acc[lang] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([lang, count]) => (
                  <div key={lang} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{lang}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Quality Metrics</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Complexity</span>
                  <Badge variant="outline">Low</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Maintainability</span>
                  <Badge variant="outline">High</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Documentation</span>
                  <Badge variant="outline">Good</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeEditor;