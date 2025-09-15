'use client';

import React, { useState, useEffect } from 'react';
import { availableComponents, generateDataFromPrompt } from '@/utils/aiDataGenerator';
import useVisualizationStore from '@/store/visualizationStore';
import BarChartComponent from '@/components/BarChartComponent';
import LineChartComponent from '@/components/LineChartComponent';
import PieChartComponent from '@/components/PieChartComponent';
import TableComponent from '@/components/TableComponent';
import CardComponent from '@/components/CardComponent';
import AreaChartComponent from '@/components/AreaChartComponent';
import { ComponentData } from '@/types/componentData';

// Predefined insights and suggestions
const insights = [
  "📈 Your dashboard shows 23% growth in user engagement this month",
  "🎯 Sales performance has improved by 15% compared to last quarter", 
  "⚡ System performance metrics are optimal across all regions",
  "👥 User acquisition rate has increased by 8% in the past week"
];

const quickSuggestions = [
  { text: "Show user analytics for last 30 days", icon: "👥" },
  { text: "Display revenue trends this quarter", icon: "💰" },
  { text: "Create performance metrics dashboard", icon: "📊" },
  { text: "Show top performing products", icon: "🏆" },
  { text: "Display customer satisfaction scores", icon: "😊" },
  { text: "Show website traffic analytics", icon: "🌐" }
];

const DashboardPage = () => {
  const { visualizations, addVisualization, removeVisualization } = useVisualizationStore();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [currentInsight, setCurrentInsight] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'ai', content: string, timestamp: Date}>>([]);
  const [typedWelcome, setTypedWelcome] = useState('');
  const [typedInsight, setTypedInsight] = useState('');
  const [isTypingWelcome, setIsTypingWelcome] = useState(true);
  const [isTypingInsight, setIsTypingInsight] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [completedInsights, setCompletedInsights] = useState<string[]>([]);

  // Typing effect for welcome message
  useEffect(() => {
    const welcomeText = "👋 Hi Mr. Affan Habib, welcome back!";
    let index = 0;
    setTypedWelcome('');
    
    const typingInterval = setInterval(() => {
      if (index < welcomeText.length) {
        setTypedWelcome(welcomeText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTypingWelcome(false);
        // Show insights after welcome message is typed
        setTimeout(() => {
          setShowInsights(true);
          setIsTypingInsight(true);
        }, 800);
      }
    }, 80); // Adjust typing speed here

    return () => clearInterval(typingInterval);
  }, []);

  // Typing effect for insights - show all one by one
  useEffect(() => {
    if (!showInsights || !isTypingInsight) return;
    if (currentInsightIndex >= insights.length) return; // Stop when all insights are shown

    const currentInsightText = insights[currentInsightIndex];
    let index = 0;
    setTypedInsight('');
    
    const insightTypingInterval = setInterval(() => {
      if (index < currentInsightText.length) {
        setTypedInsight(currentInsightText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(insightTypingInterval);
        setIsTypingInsight(false);
        
        // Add completed insight to the list
        setCompletedInsights(prev => [...prev, currentInsightText]);
        
        // Show badges after first insight is completed
        if (currentInsightIndex === 0) {
          setTimeout(() => setShowBadges(true), 1500);
        }
        
        // Move to next insight after 2 seconds if there are more insights
        setTimeout(() => {
          if (currentInsightIndex < insights.length - 1) {
            setCurrentInsightIndex(prev => prev + 1);
            setIsTypingInsight(true);
          }
        }, 2000);
      }
    }, 50);

    return () => clearInterval(insightTypingInterval);
  }, [showInsights, isTypingInsight, currentInsightIndex]);

  // Keep welcome message always visible - removed auto-hide timer

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatInput.trim()) return;
    
    // Add user message to chat
    const userMessage = { type: 'user' as const, content: chatInput, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    
    setIsLoading(true);
    
    try {
      // Generate data based on user input and selected component
      const prompt = selectedComponent 
        ? `${chatInput} - Use ${selectedComponent} component`
        : chatInput;
        
      const data = await generateDataFromPrompt(prompt);
      addVisualization(data);
      
      // Add AI response to chat
      const aiMessage = { 
        type: 'ai' as const, 
        content: `Created ${data.type} visualization: "${data.title}"`, 
        timestamp: new Date() 
      };
      setChatMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error generating data:', error);
      const errorMessage = { 
        type: 'ai' as const, 
        content: 'Sorry, I encountered an error generating that visualization. Please try again.', 
        timestamp: new Date() 
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setChatInput('');
      setSelectedComponent('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setChatInput(suggestion);
    setIsChatOpen(true);
  };

  const renderVisualization = (viz: ComponentData & { id: string }) => {
    switch (viz.type) {
      case 'BarChart':
        return (
          <BarChartComponent
            data={viz.data}
            dataKey={viz.dataKey || 'value'}
            title={viz.title}
          />
        );
      case 'LineChart':
        return (
          <LineChartComponent
            data={viz.data}
            dataKey={viz.dataKey || 'value'}
            title={viz.title}
          />
        );
      case 'AreaChart':
        return (
          <AreaChartComponent
            data={viz.data}
            dataKey={viz.dataKey || 'value'}
            title={viz.title}
          />
        );
      case 'PieChart':
        return (
          <PieChartComponent
            data={viz.data}
            dataKey={viz.dataKey || 'value'}
            title={viz.title}
          />
        );
      case 'Table':
        return (
          <TableComponent
            data={viz.data}
            columns={viz.columns || []}
            title={viz.title}
          />
        );
      case 'Card':
        return (
          <CardComponent
            title={viz.title}
            value={viz.data[0]?.value || 'N/A'}
          />
        );
      default:
        return (
          <BarChartComponent
            data={viz.data}
            dataKey={viz.dataKey || 'value'}
            title={viz.title}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                AI Analytics Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        {showWelcome && (
          <div className="mb-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 min-h-[2rem]">
                  {typedWelcome}
                  {isTypingWelcome && <span className="cursor-blink text-blue-600 ml-1">|</span>}
                </h2>
                
                {showInsights && (
                  <div className="mb-4 animate-fade-in">
                    <p className="text-gray-600 mb-3">Here are your latest insights:</p>
                    <div className="space-y-3">
                      {/* Completed insights */}
                      {completedInsights.map((insight, index) => (
                        <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border-l-4 border-blue-500">
                          <p className="text-blue-800 font-medium text-sm">
                            {insight}
                          </p>
                        </div>
                      ))}
                      
                      {/* Currently typing insight */}
                      {isTypingInsight && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border-l-4 border-blue-500 min-h-[2.5rem] flex items-center">
                          <p className="text-blue-800 font-medium text-sm">
                            {typedInsight}
                            <span className="cursor-blink text-blue-600 ml-1">|</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setShowWelcome(false)}
                className="text-gray-400 hover:text-gray-600 ml-4 self-start"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Quick Suggestions */}
        {showBadges && (
          <div className="mb-8 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">✨ Quick Actions</h3>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="bg-white/70 backdrop-blur-sm hover:bg-white/90 rounded-full px-3 py-2 border border-white/30 shadow-sm hover:shadow-md transition-all duration-300 text-left group animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                      {suggestion.icon}
                    </span>
                    <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">
                      {suggestion.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Visualization Grid */}
        {visualizations.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Your Visualizations</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {visualizations.map((viz) => (
                <div 
                  key={viz.id}
                  className="relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30"
                  onMouseEnter={() => setHoveredId(viz.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {hoveredId === viz.id && (
                    <button
                      onClick={() => removeVisualization(viz.id)}
                      className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-all duration-300 z-10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  {renderVisualization(viz)}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Enhanced Chat Interface */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-end justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[80vh] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                  <p className="text-xs text-gray-500">Ready to help with your dashboard</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-60">
              {chatMessages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <p>👋 Ask me to create any visualization!</p>
                  <p className="text-sm mt-2">Try: "Show sales data for last month" or click a suggestion below</p>
                </div>
              )}
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-2 max-w-xs">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Component Selection */}
            <div className="px-4 py-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Chart type (optional):</p>
              <div className="flex flex-wrap gap-1">
                {availableComponents.map((component) => (
                  <button
                    key={component}
                    onClick={() => setSelectedComponent(component === selectedComponent ? '' : component)}
                    className={`px-2 py-1 text-xs rounded-full transition-all ${
                      selectedComponent === component
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {component}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleChatSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask me to create any visualization..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || !chatInput.trim()}
                >
                  {isLoading ? '⏳' : '🚀'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;