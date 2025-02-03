import React, { useState, useEffect } from 'react';
import {
  Zap,
  Bot,
  Search,
  MenuIcon,
  Layout,
  Code2,
  GitBranch,
  Bug,
  Play,
  Settings,
  Users,
  Brain,
  Sparkles,
  Terminal,
  X,
  ChevronUp,
  Maximize2,
  Minimize2,
} from 'lucide-react';

function App() {
  const [code, setCode] = useState(`// Welcome to Inspira IDE
// Next-Generation AI-Powered Development Environment

function generatePattern(n: number): string[] {
  const pattern: string[] = [];
  
  for (let i = 0; i < n; i++) {
    let row = '';
    for (let j = 0; j <= i; j++) {
      row += '⬡ ';  // Hexagonal pattern
    }
    pattern.push(row);
  }
  
  return pattern;
}

// AI Enhancement Suggestion:
// Add dynamic color generation for visual pattern representation
// Implement real-time pattern preview with WebGL
// Consider adding fractal variations for more complex patterns`);

  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [activeUsers] = useState([
    { id: 1, name: 'Amara', status: 'active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { id: 2, name: 'Kwame', status: 'coding', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  ]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileAIVisible, setIsMobileAIVisible] = useState(false);

  useEffect(() => {
    const suggestions = [
      'Optimize pattern generation with memoization',
      'Add TypeScript interfaces for pattern configurations',
      'Implement WebGL rendering for enhanced visualization',
      'Consider adding animation controls for pattern evolution',
    ];
    
    const animateSuggestions = async () => {
      for (let i = 0; i < suggestions.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setAiSuggestions(prev => [...prev, suggestions[i]]);
      }
    };

    animateSuggestions();
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  const toggleMobileAI = () => setIsMobileAIVisible(!isMobileAIVisible);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="glassmorphism border-b border-indigo-500/20 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleMobileMenu}
            className="lg:hidden touch-target p-2 rounded-lg hover:bg-indigo-500/20"
          >
            <MenuIcon className="w-6 h-6 text-indigo-400 glow-effect" />
          </button>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-indigo-400 glow-effect" />
            <span className="hidden sm:inline">Inspira IDE</span>
            <span className="sm:hidden">Inspira</span>
          </h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-indigo-400" />
            <input
              type="text"
              placeholder="AI Command (Ctrl+Space)"
              className="bg-gray-800/50 text-sm rounded-full pl-9 pr-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-indigo-500/30"
            />
          </div>
          <div className="flex -space-x-2">
            {activeUsers.map(user => (
              <img
                key={user.id}
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border-2 border-indigo-500 glow-effect"
                title={`${user.name} (${user.status})`}
              />
            ))}
          </div>
          <button className="touch-target p-2 rounded-lg hover:bg-indigo-500/20">
            <Settings className="w-5 h-5 text-indigo-400 hover:text-indigo-300" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Left Sidebar - Mobile Responsive */}
        <div className={`
          lg:w-16 glassmorphism border-r border-indigo-500/20
          fixed lg:relative inset-y-0 left-0 z-30
          transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition-transform duration-200 ease-in-out
          flex flex-col items-center py-4 space-y-6
        `}>
          <button className="touch-target p-2 rounded-lg hover:bg-indigo-500/20 text-indigo-400 glow-effect">
            <Layout className="w-6 h-6" />
          </button>
          <button className="touch-target p-2 rounded-lg hover:bg-indigo-500/20 text-indigo-400">
            <Code2 className="w-6 h-6" />
          </button>
          <button className="touch-target p-2 rounded-lg hover:bg-indigo-500/20 text-indigo-400">
            <GitBranch className="w-6 h-6" />
          </button>
          <button className="touch-target p-2 rounded-lg hover:bg-indigo-500/20 text-indigo-400">
            <Bug className="w-6 h-6" />
          </button>
          <button className="touch-target p-2 rounded-lg hover:bg-indigo-500/20 text-indigo-400">
            <Users className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* File Explorer - Responsive */}
          <div className={`
            w-full lg:w-64 glassmorphism border-r border-indigo-500/20 p-4
            ${isMobileMenuOpen ? 'hidden' : 'block'} lg:block
            overflow-y-auto custom-scrollbar
          `}>
            <h2 className="text-sm font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              PROJECT NAVIGATOR
            </h2>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-indigo-300 hover:text-white cursor-pointer group touch-area">
                <Terminal className="w-4 h-4 mr-2 group-hover:text-indigo-400" />
                patterns/
              </div>
              <div className="flex items-center text-sm text-indigo-400 hover:text-indigo-300 cursor-pointer ml-6 group touch-area">
                <Code2 className="w-4 h-4 mr-2 group-hover:text-indigo-400" />
                hexagonal.ts
              </div>
            </div>
          </div>

          {/* Editor and AI Assistant */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Editor Area */}
            <div className="flex-1 holographic-bg hex-pattern p-4 relative">
              <div className="glassmorphism rounded-lg p-4 h-full border border-indigo-500/20 relative">
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-1 rounded hover:bg-indigo-500/20 text-indigo-400"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full bg-transparent resize-none focus:outline-none font-mono text-sm text-indigo-100 code-editor custom-scrollbar"
                  spellCheck="false"
                />
              </div>
            </div>

            {/* AI Assistant - Responsive */}
            <div className={`
              adaptive-panel glassmorphism border-t border-indigo-500/20 p-4
              ${isMobileAIVisible ? 'block' : 'hidden'} lg:block
            `}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-indigo-400 glow-effect" />
                  <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    Neural Code Assistant
                  </span>
                </div>
                <button
                  onClick={toggleMobileAI}
                  className="lg:hidden p-1 rounded hover:bg-indigo-500/20 text-indigo-400"
                >
                  <ChevronUp className={`w-4 h-4 transform ${isMobileAIVisible ? 'rotate-180' : ''}`} />
                </button>
              </div>
              <div className="ai-assistant-bg rounded-lg p-3 text-sm text-indigo-200 custom-scrollbar">
                <div className="flex items-center mb-2">
                  <Sparkles className="w-4 h-4 mr-2 text-indigo-400" />
                  <span className="font-medium">AI Suggestions:</span>
                </div>
                <ul className="space-y-2 ml-6">
                  {aiSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="flex items-center text-indigo-300 hover:text-indigo-200 cursor-pointer transition-colors duration-200 touch-area"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2 glow-effect" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Sidebar - AI Insights - Responsive */}
          <div className={`
            w-full lg:w-72 glassmorphism border-l border-indigo-500/20 p-4
            ${isMobileMenuOpen ? 'hidden' : 'block'} lg:block
            overflow-y-auto custom-scrollbar
          `}>
            <h2 className="text-sm font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              AI INSIGHTS
            </h2>
            <div className="space-y-4">
              <div className="glassmorphism rounded-lg p-3 border border-indigo-500/20">
                <h3 className="text-sm font-medium text-indigo-400 mb-2 flex items-center">
                  <Brain className="w-4 h-4 mr-2" />
                  Pattern Analysis
                </h3>
                <p className="text-xs text-indigo-300">
                  Current implementation scales quadratically. Consider using WebGL for rendering complex patterns.
                </p>
                <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-indigo-500 to-purple-500 glow-effect" />
                </div>
              </div>
              
              <div className="glassmorphism rounded-lg p-3 border border-indigo-500/20">
                <h3 className="text-sm font-medium text-indigo-400 mb-2 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Code Quality
                </h3>
                <p className="text-xs text-indigo-300">
                  95/100 - Excellent pattern generation logic. Consider adding error handling for edge cases.
                </p>
                <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full w-[95%] bg-gradient-to-r from-indigo-500 to-purple-500 glow-effect" />
                </div>
              </div>

              <div className="glassmorphism rounded-lg p-3 border border-indigo-500/20">
                <h3 className="text-sm font-medium text-indigo-400 mb-2">Real-time Collaboration</h3>
                <div className="flex items-center space-x-2">
                  {activeUsers.map(user => (
                    <div key={user.id} className="flex items-center">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-6 h-6 rounded-full border border-indigo-500/50"
                      />
                      <span className="ml-1 text-xs text-indigo-300">{user.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Responsive */}
      <footer className="glassmorphism border-t border-indigo-500/20 p-2 hidden sm:flex items-center justify-between text-xs text-indigo-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <Play className="w-4 h-4 mr-1" />
            Neural Engine Active
          </span>
          <span className="hidden sm:inline">TypeScript</span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
            AI Assisted
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline">Ln 1, Col 1</span>
          <span className="hidden md:inline">UTF-8</span>
          <span className="flex items-center">
            <Brain className="w-3 h-3 mr-1" />
            Neural Enhancement Active
          </span>
        </div>
      </footer>

      {/* Mobile Navigation Bar */}
      <nav className="mobile-nav sm:hidden">
        <div className="flex justify-around items-center">
          <button className="touch-target p-2 rounded-lg text-indigo-400" onClick={toggleMobileMenu}>
            <Layout className="w-6 h-6" />
          </button>
          <button className="touch-target p-2 rounded-lg text-indigo-400">
            <Code2 className="w-6 h-6" />
          </button>
          <button className="touch-target p-2 rounded-lg text-indigo-400" onClick={toggleMobileAI}>
            <Brain className="w-6 h-6" />
          </button>
          <button className="touch-target p-2 rounded-lg text-indigo-400">
            <Users className="w-6 h-6" />
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;