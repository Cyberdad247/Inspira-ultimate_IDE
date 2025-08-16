import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { 
  Brain, 
  Zap, 
  Target, 
  Layers, 
  TrendingDown, 
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

const SymbolectEngine = ({ 
  naturalLanguageInput, 
  onSymbolGenerated, 
  onCompressionComplete 
}) => {
  const [symbols, setSymbols] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [compressionStats, setCompressionStats] = useState(null);
  const [processingStage, setProcessingStage] = useState('');
  const [symbolHistory, setSymbolHistory] = useState([]);

  // Enhanced symbol mapping with categories
  const symbolMap = {
    // Authentication & Security
    'authentication': { symbol: '🔐', category: 'security', weight: 0.9 },
    'login': { symbol: '🚪', category: 'security', weight: 0.8 },
    'password': { symbol: '🔑', category: 'security', weight: 0.8 },
    'security': { symbol: '🛡️', category: 'security', weight: 0.9 },
    'encryption': { symbol: '🔒', category: 'security', weight: 0.8 },
    'token': { symbol: '🎫', category: 'security', weight: 0.7 },
    
    // User Interface
    'user': { symbol: '👤', category: 'ui', weight: 0.7 },
    'form': { symbol: '📝', category: 'ui', weight: 0.8 },
    'button': { symbol: '🔘', category: 'ui', weight: 0.6 },
    'modal': { symbol: '🪟', category: 'ui', weight: 0.7 },
    'dropdown': { symbol: '🔽', category: 'ui', weight: 0.6 },
    'navigation': { symbol: '🧭', category: 'ui', weight: 0.7 },
    'menu': { symbol: '☰', category: 'ui', weight: 0.6 },
    
    // Data & Storage
    'database': { symbol: '🗄️', category: 'data', weight: 0.9 },
    'api': { symbol: '🔌', category: 'data', weight: 0.8 },
    'storage': { symbol: '💾', category: 'data', weight: 0.7 },
    'cache': { symbol: '⚡', category: 'data', weight: 0.6 },
    'backup': { symbol: '💿', category: 'data', weight: 0.7 },
    
    // Operations
    'create': { symbol: '➕', category: 'operation', weight: 0.8 },
    'read': { symbol: '👁️', category: 'operation', weight: 0.7 },
    'update': { symbol: '🔄', category: 'operation', weight: 0.8 },
    'delete': { symbol: '🗑️', category: 'operation', weight: 0.8 },
    'search': { symbol: '🔍', category: 'operation', weight: 0.7 },
    'filter': { symbol: '🔽', category: 'operation', weight: 0.6 },
    'sort': { symbol: '📊', category: 'operation', weight: 0.6 },
    
    // System & Architecture
    'frontend': { symbol: '🖥️', category: 'system', weight: 0.8 },
    'backend': { symbol: '⚙️', category: 'system', weight: 0.8 },
    'server': { symbol: '🖥️', category: 'system', weight: 0.7 },
    'client': { symbol: '💻', category: 'system', weight: 0.7 },
    'microservice': { symbol: '🔗', category: 'system', weight: 0.8 },
    
    // Validation & Testing
    'validation': { symbol: '✅', category: 'validation', weight: 0.7 },
    'test': { symbol: '🧪', category: 'validation', weight: 0.8 },
    'error': { symbol: '❌', category: 'validation', weight: 0.6 },
    'success': { symbol: '✨', category: 'validation', weight: 0.6 },
    'loading': { symbol: '⏳', category: 'validation', weight: 0.5 },
    
    // Communication
    'email': { symbol: '📧', category: 'communication', weight: 0.7 },
    'notification': { symbol: '🔔', category: 'communication', weight: 0.7 },
    'message': { symbol: '💬', category: 'communication', weight: 0.6 },
    'chat': { symbol: '💭', category: 'communication', weight: 0.7 }
  };

  // Pattern recognition for complex flows
  const flowPatterns = [
    {
      pattern: /login|auth|sign.?in/i,
      symbols: ['🔐', '👤', '🚪'],
      flow: '🔐→👤→✅',
      description: 'Authentication Flow'
    },
    {
      pattern: /form|submit|save/i,
      symbols: ['📝', '💾', '✅'],
      flow: '📝→💾→✅',
      description: 'Form Submission Flow'
    },
    {
      pattern: /search|find|query/i,
      symbols: ['🔍', '🗄️', '📊'],
            flow: '🔍→🗄️→📊',
      description: 'Search & Retrieval Flow'
    },
    {
      pattern: /crud|create|read|update|delete/i,
      symbols: ['➕', '👁️', '🔄', '🗑️'],
      flow: '➕→👁️→🔄→🗑️',
      description: 'CRUD Operations Flow'
    },
    {
      pattern: /payment|checkout|purchase/i,
      symbols: ['💳', '🛒', '✅'],
      flow: '💳→🛒→✅',
      description: 'Payment Flow'
    },
    {
      pattern: /upload|file|document/i,
      symbols: ['📤', '📁', '💾'],
      flow: '📤→📁→💾',
      description: 'File Upload Flow'
    }
  ];

  const parseNaturalLanguage = useCallback(async (input) => {
    if (!input || input.length < 3) return;
    
    setIsProcessing(true);
    setProcessingStage('Analyzing input...');
    
    try {
      // Stage 1: Tokenization and basic symbol detection
      await new Promise(resolve => setTimeout(resolve, 500));
      setProcessingStage('Detecting symbols...');
      
      const words = input.toLowerCase().split(/\s+/);
      const detectedSymbols = [];
      let totalConfidence = 0;
      
      // Direct word mapping
      words.forEach(word => {
        const cleanWord = word.replace(/[^\w]/g, '');
        if (symbolMap[cleanWord]) {
          const symbolData = symbolMap[cleanWord];
          detectedSymbols.push({
            symbol: symbolData.symbol,
            meaning: cleanWord,
            category: symbolData.category,
            confidence: symbolData.weight + Math.random() * 0.1,
            source: 'direct'
          });
          totalConfidence += symbolData.weight;
        }
      });
      
      // Stage 2: Pattern recognition
      await new Promise(resolve => setTimeout(resolve, 700));
      setProcessingStage('Recognizing patterns...');
      
      flowPatterns.forEach(pattern => {
        if (pattern.pattern.test(input)) {
          detectedSymbols.push({
            symbol: pattern.flow,
            meaning: pattern.description,
            category: 'flow',
            confidence: 0.85 + Math.random() * 0.1,
            source: 'pattern',
            flow: true
          });
          totalConfidence += 0.8;
        }
      });
      
      // Stage 3: Contextual enhancement
      await new Promise(resolve => setTimeout(resolve, 600));
      setProcessingStage('Enhancing context...');
      
      // Add contextual symbols based on combinations
      if (input.includes('user') && input.includes('management')) {
        detectedSymbols.push({
          symbol: '👥→⚙️',
          meaning: 'user_management_system',
          category: 'system',
          confidence: 0.9,
          source: 'contextual'
        });
      }
      
      if (input.includes('real') && input.includes('time')) {
        detectedSymbols.push({
          symbol: '⚡→🔄',
          meaning: 'real_time_updates',
          category: 'system',
          confidence: 0.85,
          source: 'contextual'
        });
      }
      
      // Stage 4: Compression and optimization
      await new Promise(resolve => setTimeout(resolve, 400));
      setProcessingStage('Optimizing compression...');
      
      // Remove duplicates and optimize
      const uniqueSymbols = detectedSymbols.filter((symbol, index, self) => 
        index === self.findIndex(s => s.symbol === symbol.symbol)
      );
      
      // Sort by confidence
      uniqueSymbols.sort((a, b) => b.confidence - a.confidence);
      
      // Calculate compression statistics
      const originalLength = input.length;
      const compressedLength = uniqueSymbols.map(s => s.symbol).join('').length;
      const compressionRatio = Math.floor((1 - compressedLength / originalLength) * 100);
      
      const stats = {
        originalLength,
        compressedLength,
        compressionRatio,
        symbolCount: uniqueSymbols.length,
        tokenReduction: compressionRatio,
        categories: [...new Set(uniqueSymbols.map(s => s.category))].length
      };
      
      setSymbols(uniqueSymbols);
      setConfidence(Math.min(totalConfidence / uniqueSymbols.length, 1.0));
      setCompressionStats(stats);
      
      // Generate compressed representation
      const compressed = uniqueSymbols.map(s => s.symbol).join('⨹');
      const flowSymbols = uniqueSymbols.filter(s => s.flow);
      
      // Add to history
      setSymbolHistory(prev => [{
        input: input.substring(0, 50) + (input.length > 50 ? '...' : ''),
        symbols: uniqueSymbols,
        compressed,
        timestamp: new Date(),
        confidence: Math.min(totalConfidence / uniqueSymbols.length, 1.0)
      }, ...prev.slice(0, 4)]);
      
      // Callback with results
      onSymbolGenerated({
        compressed,
        symbols: uniqueSymbols,
        confidence: Math.min(totalConfidence / uniqueSymbols.length, 1.0),
        stats,
        flows: flowSymbols
      });
      
      if (onCompressionComplete) {
        onCompressionComplete(stats);
      }
      
    } catch (error) {
      console.error('Symbolect parsing error:', error);
      setSymbols([]);
      setConfidence(0);
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  }, [onSymbolGenerated, onCompressionComplete]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (naturalLanguageInput && naturalLanguageInput.length > 10) {
        parseNaturalLanguage(naturalLanguageInput);
      }
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [naturalLanguageInput, parseNaturalLanguage]);

  const getCategoryColor = (category) => {
    const colors = {
      security: 'bg-red-100 text-red-800',
      ui: 'bg-blue-100 text-blue-800',
      data: 'bg-green-100 text-green-800',
      operation: 'bg-purple-100 text-purple-800',
      system: 'bg-orange-100 text-orange-800',
      validation: 'bg-yellow-100 text-yellow-800',
      communication: 'bg-pink-100 text-pink-800',
      flow: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 0.8) return <CheckCircle className="w-3 h-3 text-green-500" />;
    if (confidence >= 0.6) return <Info className="w-3 h-3 text-blue-500" />;
    return <AlertCircle className="w-3 h-3 text-yellow-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Main Symbolect Engine */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Symbolect Engine</span>
              {isProcessing && <div className="animate-spin text-lg">⚡</div>}
            </div>
            <Badge variant="outline" className="text-xs">
              v2.0
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Processing Status */}
          {isProcessing && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>{processingStage}</span>
                <span className="text-muted-foreground">Processing...</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          )}

          {/* Symbol Display */}
          {symbols.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {symbols.map((symbol, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-2 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <span className="text-2xl">{symbol.symbol}</span>
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium">{symbol.meaning}</span>
                        {getConfidenceIcon(symbol.confidence)}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Badge className={`text-xs ${getCategoryColor(symbol.category)}`}>
                          {symbol.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {Math.floor(symbol.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Compressed Representation */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm font-medium mb-2">Compressed Representation:</div>
                <div className="font-mono text-lg break-all">
                  {symbols.map(s => s.symbol).join('⨹')}
                </div>
              </div>
            </div>
          )}

          {/* No symbols detected */}
          {!isProcessing && symbols.length === 0 && naturalLanguageInput && (
            <div className="text-center text-muted-foreground py-8">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <div className="text-lg mb-2">No symbols detected</div>
              <div className="text-sm">
                Try describing a feature with technical terms like "user authentication", "database", or "API"
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compression Statistics */}
      {compressionStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingDown className="w-5 h-5 mr-2" />
              Compression Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {compressionStats.compressionRatio}%
                </div>
                <div className="text-sm text-muted-foreground">Compression Ratio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {compressionStats.symbolCount}
                </div>
                <div className="text-sm text-muted-foreground">Symbols Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {compressionStats.categories}
                </div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.floor(confidence * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Confidence</div>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-muted-foreground">
              Original: {compressionStats.originalLength} chars → 
              Compressed: {compressionStats.compressedLength} chars
            </div>
          </CardContent>
        </Card>
      )}

      {/* Symbol History */}
      {symbolHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Layers className="w-5 h-5 mr-2" />
              Recent Compressions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {symbolHistory.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {entry.input}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {entry.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="font-mono text-sm">
                      {entry.compressed.substring(0, 20)}
                      {entry.compressed.length > 20 ? '...' : ''}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {Math.floor(entry.confidence * 100)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SymbolectEngine;